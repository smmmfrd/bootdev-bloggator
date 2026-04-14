import { argv, exit } from "node:process";
import {
  CommandRegistry,
  handlerLogin,
  handlerRegister,
  registerCommand,
  runCommand,
} from "./commands";

async function main() {
  const registry: CommandRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);

  const inputs = argv.slice(2);

  if (inputs.length == 0) {
    console.log("Command and arguments are required.");

    exit(1);
  }

  const [command, args] = [inputs[0], inputs.slice(1)];

  try {
    await runCommand(registry, command, ...args);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Error occurred: ${error.message}`);
      exit(1);
    } else {
      console.log("An unknown error occurred.");
    }
  }

  exit(0);
}

main();
