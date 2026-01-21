import nacl from "tweetnacl";
import { sha256 } from "js-sha256";

export function generateKeypair() {
  const keypair = nacl.sign.keyPair();
  return {
    publicKey: Buffer.from(keypair.publicKey).toString("hex"),
    privateKey: Buffer.from(keypair.secretKey).toString("hex")
  };
}

export function deriveCivicId(publicKey: string) {
  return sha256(publicKey);
}
