import { WalletKeys, generateWallet, signTransaction, verifyTransaction, exportWallet, importWallet } from "./mobileWallet";

export interface CivicWallet {
  balance: number;
  walletKeys: WalletKeys;
}

// Initialize a wallet
export function createWallet(): CivicWallet {
  return {
    balance: 0,
    walletKeys: generateWallet(),
  };
}

// Add funds
export function addFunds(cWallet: CivicWallet, amount: number): CivicWallet {
  cWallet.balance += amount;
  return cWallet;
}

// Spend funds
export function spendFunds(cWallet: CivicWallet, amount: number): CivicWallet {
  if (amount > cWallet.balance) throw new Error("Insufficient balance");
  cWallet.balance -= amount;
  return cWallet;
}

// Sign a transaction
export function signCivicTx(cWallet: CivicWallet, message: string) {
  return signTransaction(cWallet.walletKeys, message);
}

// Verify transaction
export function verifyCivicTx(cWallet: CivicWallet, message: string, signature: Uint8Array) {
  return verifyTransaction(cWallet.walletKeys, message, signature);
}

// Export wallet for mobile/hardware storage
export function exportCivicWallet(cWallet: CivicWallet) {
  return exportWallet(cWallet.walletKeys);
}

// Import wallet for mobile/hardware storage
export function importCivicWallet(walletStr: string, balance = 0): CivicWallet {
  return {
    balance,
    walletKeys: importWallet(walletStr),
  };
}
