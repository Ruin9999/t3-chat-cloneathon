import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async ({ db }) => {
    const models = await db.query("models").collect();
    return models;
  },
})