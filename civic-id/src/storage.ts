import fs from "fs";
import path from "path";

const USERS_FILE = path.join(__dirname, "users.json");

export function readUsers(): any[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf8");
  return JSON.parse(data);
}

export function writeUsers(users: any[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

