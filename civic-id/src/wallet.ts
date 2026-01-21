import { readUsers, writeUsers } from "./storage";

export function getBalance(civicId: string): number {
  const users = readUsers();
  const user = users.find(u => u.civicId === civicId);
  return user ? user.balance : 0;
}

export function addFunds(civicId: string, amount: number): void {
  const users = readUsers();
  const user = users.find(u => u.civicId === civicId);
  if (user) user.balance += amount;
  writeUsers(users);
}

export function spendFunds(civicId: string, amount: number): void {
  const users = readUsers();
  const user = users.find(u => u.civicId === civicId);
  if (user && user.balance >= amount) user.balance -= amount;
  writeUsers(users);
}

