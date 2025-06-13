import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {
    user: v.string(),
  },
  handler: async ({ db }) => {
    const chats = await db.query("chats").collect();
    return chats;
  },
})