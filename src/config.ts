import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const configFileName = ".gatorconfig.json";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export async function readConfig(): Promise<Config> {
  const filePath = getConfigFilePath();
  const jsonString: string = readFileSync(filePath, "utf-8");
  const data = await JSON.parse(jsonString);

  const config: Config = {
    dbUrl: data.db_url,
    currentUserName: data.current_user_name,
  };

  return config;
}

export async function setUser(userName: string) {
  let config: Config = await readConfig();

  config.currentUserName = userName;
  writeConfig(config);
}

function writeConfig(config: Config) {
  const temp = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };

  const writable: string = JSON.stringify(temp);
  const filePath = getConfigFilePath();
  writeFileSync(filePath, writable);
}

function getConfigFilePath(): string {
  const homeDir = homedir();
  return path.join(homeDir, configFileName);
}
