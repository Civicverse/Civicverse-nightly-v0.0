const { generateKeypair, deriveCivicId } = require("./identity");
const { createAvatar } = require("./avatar");
const { vouch } = require("./trust");
const { readUsers } = require("./storage");

// Step 1: Generate Civic ID
const { publicKey } = generateKeypair();
const civicId = deriveCivicId(publicKey);
console.log("Civic ID:", civicId);

// Step 2: Create avatar
const avatar = createAvatar(civicId, "PlayerOne", { hair: "blue", skin: "orc" });
console.log("Created avatar:", avatar);

// Step 3: Promote to canonical
vouch(civicId);
vouch(civicId);
vouch(civicId);

// Step 4: Read users and show canonical state
const users = readUsers();
console.log("Canonical avatar state:", users[civicId]);

