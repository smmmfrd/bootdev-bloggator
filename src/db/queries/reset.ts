import { users } from "src/schema";
import { db } from "..";

export async function reset() {
  await db.delete(users);
}
