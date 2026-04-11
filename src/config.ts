import { readFileSync } from "node:fs";

const filePath = ".gatorconfig.json";

type Config = {
  dbURL: string;
  currentUserName: string | null;
};

export async function readConfig(): Promise<Config> {
  const jsonString: string = readFileSync(filePath, "utf-8");
  const data: Config = await JSON.parse(jsonString);

  return data;
}
