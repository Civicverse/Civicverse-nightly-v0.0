import fs from "fs";
const USER_FILE = "./user-data/users.json";

export function readUsers() {
  if (!fs.existsSync(USER_FILE)) return {};
  return JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
}

export function writeUsers(users: any) {
  fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2));
}
