import { readConfig, setUser } from "./config";

async function main() {
  await setUser("Sam");

  const config = await readConfig();
  console.log(config);
}

main();
