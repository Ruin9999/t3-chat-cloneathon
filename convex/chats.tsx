import { generateText } from 'ai';
import { v } from "convex/values";
import { trim } from "../lib/utils";
import { openai } from '@ai-sdk/openai';
import { internal } from "./_generated/api";
import { query, action, internalMutation } from "./_generated/server";

export const get = query({
  args: {
    user: v.string(),
  },
  handler: async ({ db }) => {
    const chats = await db.query("chats").collect();
    return chats;
  },
})

export const create = action({
  args: {
    owner: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmedContent = trim(args.content, 100); //Lazy hard trimming.
    const { text } = await generateText({
      model: openai("gpt-4.1-nano"),
      system: "Given a user's request, generate an appropriate title that is within 20 characters.",
      prompt: trimmedContent,
    })

    const id: string = await ctx.runMutation(internal.chats.createChat, { owner: args.owner, title: text });
    return id;
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
      title: args.title
    })
    return id;
  }
})