const { readUsers, writeUsers } = require("./storage");

function vouch(civicId) {
  const users = readUsers();
  if (!users[civicId]) throw new Error("User not found");

  users[civicId].trust.vouches += 1;
  if (users[civicId].trust.vouches >= 3) {
    users[civicId].avatar.status = "canonical";
    users[civicId].trust.canonical = true;
  }

  writeUsers(users);
  return users[civicId];
}

module.exports = { vouch };

