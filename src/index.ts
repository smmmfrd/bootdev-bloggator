import { CommandRegistry, handlerLogin, registerCommand } from "./commands";

async function main() {
  const registry: CommandRegistry = {};
  registerCommand(registry, "login", handlerLogin);

  console.log(registry);
}

main();
