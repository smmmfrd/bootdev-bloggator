import { readConfig, setUser } from "./config";
import { createFeed, getFeeds } from "./db/queries/feeds";
import { reset } from "./db/queries/reset";
import { createUser, findUser, getUsers } from "./db/queries/users";
import { fetchFeed, printFeed } from "./feeds";

type CommandHandler = (...args: string[]) => Promise<void>;

export type CommandRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  if (cmdName in registry) {
    await registry[cmdName](...args);
  } else {
    throw new Error(`Unknown command ${cmdName}`);
  }
}

export async function handlerLogin(...args: string[]): Promise<void> {
  if (args.length != 1) {
    throw new Error("Login requires username argument");
  }

  const userName = args[0];

  const userData = await findUser(userName);

  if (!userData) {
    throw new Error(
      `Username ${userName} is not registered, use the register command.`,
    );
  }

  setUser(userName);
  console.log(`User set to: ${userName}`);
}

export async function handlerRegister(...args: string[]): Promise<void> {
  if (args.length < 1) {
    throw new Error("Register requires a username argument");
  }

  const newUserName = args[0];

  try {
    const res = await createUser(newUserName);
    console.log(`User ${newUserName} created.`);
    console.log(res);
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`User with name ${newUserName} already exists`);
    }
  }

  setUser(newUserName);
}

export async function handlerReset(...args: string[]): Promise<void> {
  await reset();
  console.log("Reset the database.");
}

export async function handlerUsers(...args: string[]): Promise<void> {
  const users = await getUsers();
  const currentUser = readConfig().currentUserName;

  for (const user of users) {
    console.log(
      `* ${user.name} ${user.name === currentUser ? "(current)" : ""}`,
    );
  }
}

export async function handlerAgg(...args: string[]): Promise<void> {
  const rss = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(rss.channel);
}

export async function handlerAddFeed(...args: string[]): Promise<void> {
  const [name, url] = args;

  if (!name || !url) {
    throw new Error("Expected a name and URL for the new feed.");
  }

  const currentUserName = readConfig().currentUserName;
  const currentUser = await findUser(currentUserName);

  if (!currentUser) {
    throw new Error("User does not exist");
  }

  console.log(
    `Creating Feed named: ${name}\n\turl: ${url}\n\tby user: ${currentUser.name}`,
  );

  try {
    await createFeed(name, url, currentUser.id);
  } catch (err: unknown) {}
}

export async function handlerFeeds(...args: string[]): Promise<void> {
  const feeds = await getFeeds();
  feeds.forEach(printFeed);
}
