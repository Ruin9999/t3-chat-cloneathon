import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {
    chatId: v.string(),
  },
  handler: async ({ db }, { chatId }) => {
    const messages = await db.query("messages").filter((q) => q.eq(q.field("_id"), chatId)).collect();
    return messages;
  },
})