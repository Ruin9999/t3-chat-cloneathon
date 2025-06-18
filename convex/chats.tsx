import { generateText } from 'ai';
import { v, ConvexError } from "convex/values";
import { trim } from "../lib/utils";
import { openai } from '@ai-sdk/openai';
import { Id } from './_generated/dataModel';
import { internal } from "./_generated/api";
import { query, action, mutation, internalMutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new ConvexError("Unauthenticated call to query.");
  
    const id = identity.subject;    
    const chats = await ctx.db
      .query("chats")
      .withIndex("byOwner", (q) => q.eq("owner", id))
      .collect();
    return chats;
  },
})

export const create = action({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new ConvexError("Unauthorized call to action.");

    const trimmedContent = trim(args.content, 100); //Lazy hard trimming.
    const { text } = await generateText({
      model: openai("gpt-4.1-nano"),
      system: "Given a user's request, generate an appropriate title that is within 20 characters.",
      prompt: trimmedContent,
    })

    const id: string = await ctx.runMutation(internal.chats.createChat, { owner: identity.subject, title: text });
    return id;
  }
})

export const deleteChat = mutation({
  args: { 
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new ConvexError("Unauthorized call to mutation.");

    const chat = await ctx.db.get(args.chatId as Id<"chats">);
    if (!chat) throw new ConvexError("Requested document does not exist");
    if (chat.owner !== identity.subject) throw new ConvexError("User does not have sufficient permissions to complete this action");

    await ctx.db.delete(args.chatId as Id<"chats">);
    const messages = await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  }
})

export const toggleChatPin = mutation({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new ConvexError("Unauthorized call to query");

    const chat = await ctx.db.get(args.chatId as Id<"chats">);
    if (!chat) throw new ConvexError("Trying to delete a document that does not exist");
    if (chat.owner !== identity.subject) throw new ConvexError("User does not have sufficient permissions to complete this aciton");

    const newPinnedState = !chat.pinned;
    await ctx.db.patch(args.chatId as Id<"chats">, { pinned: newPinnedState });
  }
})

export const createChat = internalMutation({
  args: {
    owner: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("chats", {
      owner: args.owner,
      title: args.title,
      pinned: false,
    })
    return id;
  }
})