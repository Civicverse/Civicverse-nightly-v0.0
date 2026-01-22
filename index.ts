import { createWallet, addFunds, spendFunds, signCivicTx, verifyCivicTx, exportCivicWallet, importCivicWallet } from "./wallet";

const myWallet = createWallet();
console.log("Initial balance:", myWallet.balance);

addFunds(myWallet, 100);
console.log("After adding 100:", myWallet.balance);

spendFunds(myWallet, 30);
console.log("After spending 30:", myWallet.balance);

// Sign a transaction
const message = "Send 10 X to PlayerTwo";
const signature = signCivicTx(myWallet, message);
console.log("Transaction signature:", Buffer.from(signature).toString("hex"));

// Verify transaction
console.log("Verify transaction:", verifyCivicTx(myWallet, message, signature));

// Export wallet
const exported = exportCivicWallet(myWallet);
console.log("Exported wallet:", exported);

// Import wallet
const importedWallet = importCivicWallet(exported, myWallet.balance);
console.log("Imported wallet balance:", importedWallet.balance);
