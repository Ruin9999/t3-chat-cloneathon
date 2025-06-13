import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async ({ db }) => {
    const models = await db.query("models").collect();
    return models;
  },
})

export const getCategoryByModelId = query({
  args: { modelId: v.string() },  
  handler: async ({ db }, { modelId }) => {
    const category = await db.query("models")
      .filter((q) => q.eq(q.field("id"), modelId))
      .first();
    return category ? category.category : null;
  },
})