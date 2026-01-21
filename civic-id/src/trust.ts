import { readUsers, writeUsers } from "./storage";

export function vouch(civicId: string): void {
  const users = readUsers();
  const user = users.find(u => u.civicId === civicId);
  if (user) user.trust += 1;
  writeUsers(users);
}

