import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    title: v.optional(v.string()),
    owner: v.string(),
    pinned: v.boolean(),
  }).index("byOwner", ["owner"]),
  messages: defineTable({
    chatId: v.string(),
    messageId: v.string(), // Message ID for ai-sdk
    content: v.string(),
    sender: v.string(),
    avatarUrl: v.string(),
    model: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("file")),
  }).index("byChatId", ["chatId"]),
  models: defineTable({
    id: v.string(),
    name: v.string(),
    category: v.union(v.literal("OpenAI"), v.literal("Anthropic"), v.literal("Google"), v.literal("XAI"), v.literal("DeepSeek")),
    logo: v.string(),
    enabled: v.boolean(),
    canUseTools: v.boolean(),
    canInputImages: v.boolean(),
    canGenerateObjects: v.boolean(),
    canWebSearch: v.boolean(),
  })
});