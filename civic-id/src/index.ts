import { readUsers, writeUsers } from "./storage";
import { getBalance, addFunds, spendFunds } from "./wallet";
import { vouch } from "./trust";
import { createAvatar } from "./avatar";
import crypto from "crypto";

// Create a new Civic ID and avatar
const civicId = crypto.randomBytes(32).toString("hex");
const avatar = createAvatar(civicId, "PlayerOne");

const users = readUsers();
users.push(avatar);
writeUsers(users);

console.log("Civic ID:", civicId);
console.log("Created avatar:", avatar);

// Wallet operations
console.log("Initial balance:", getBalance(civicId));
addFunds(civicId, 100);
console.log("Balance after adding 100:", getBalance(civicId));
spendFunds(civicId, 30);
console.log("Balance after spending 30:", getBalance(civicId));

// Trust operations
vouch(civicId);
console.log("Avatar after vouching:", readUsers().find(u => u.civicId === civicId));

