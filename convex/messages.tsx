import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: { 
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new ConvexError("Unauthorized call to query.");

    const messages = await ctx.db.query("messages").filter((q) => q.eq(q.field("chatId"), args.chatId)).collect();
    return messages;
  },
})

export const create = mutation({
  args: {
    chatId: v.string(),
    messageId: v.string(),
    content: v.string(),
    sender: v.string(),
    avatarUrl: v.string(),
    model: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("file")),
  },
  handler: async (ctx, args) => { 
    const identity = ctx.auth.getUserIdentity();
    if (identity === null) throw new ConvexError("Unauthorized call to mutation.");

    return await ctx.db.insert("messages", args);
  },
})