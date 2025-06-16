import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    chatId: v.string(),
  },
  handler: async ({ db }, { chatId }) => {
    const messages = await db.query("messages").filter((q) => q.eq(q.field("chatId"), chatId)).collect();
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
    return await ctx.db.insert("messages", args);
  },
})