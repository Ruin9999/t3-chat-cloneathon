import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    title: v.optional(v.string()),
    owner: v.string(),
    participants: v.optional(v.array(v.string())),
  }),
  messages: defineTable({
    chatId: v.string(),
    content: v.object({ text: v.string() }),
    sender: v.string(),
    avatarUrl: v.string(),
    model: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("file")),
  }),
  models: defineTable({
    id: v.string(),
    name: v.string(),
    category: v.union(v.literal("OpenAI"), v.literal("Anthropic"), v.literal("Google"), v.literal("XAI"), v.literal("DeepSeek")),
    logo: v.string(),
    enabled: v.optional(v.boolean()),
  })
});