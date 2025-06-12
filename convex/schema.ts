import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    title: v.string(),
    owner: v.string(),
    participants: v.array(v.string()),
  }),
  messages: defineTable({
    content: v.object({ text: v.string() }),
    sender: v.string(),
    model: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("file")),
  }),
  models: defineTable({
    id: v.string(),
    name: v.string(),
    category: v.string(),
    logo: v.string(),
  })
});