import { readUsers, writeUsers } from "./storage";

export function createAvatar(civicId: string, name: string, appearance: any) {
  const users = readUsers();
  if (users[civicId]) throw new Error("Avatar already exists");

  users[civicId] = {
    civicId,
    avatar: { name, appearance, status: "provisional", level: 1, karma: 0 },
    trust: { vouches: 0, canonical: false }
  };

  writeUsers(users);
  return users[civicId];
}
