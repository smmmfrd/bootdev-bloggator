import { feeds, users } from "src/schema";
import { db } from "..";
import { eq } from "drizzle-orm";

export async function createFeed(name: string, url: string, user_id: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, user_id })
    .returning();
  return result;
}

export async function getFeeds() {
  const results = await db
    .select({
      userName: users.name,
      url: feeds.url,
      name: feeds.name,
    })
    .from(feeds)
    .leftJoin(users, eq(feeds.user_id, users.id));
  return results;
}
