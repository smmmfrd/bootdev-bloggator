import { setUser } from "./config";

type CommandHandler = (...args: string[]) => void;

export type CommandRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  if (cmdName in registry) {
    registry[cmdName](...args);
  }
}

export function handlerLogin(...args: string[]): void {
  if (args.length != 1) {
    throw new Error("Login requires username argument");
  }

  const userName = args[0];
  setUser(userName);
  console.log(`User set to: ${userName}`);
}
