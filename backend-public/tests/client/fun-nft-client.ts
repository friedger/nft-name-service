import { Tx, Chain, Account, types } from "./deps.ts";

export function mintFunNFT(account: Account) {
  return Tx.contractCall("fun-nft", "mint", [], account.address);
}

