import { Tx, Chain, Account, types } from "./deps.ts";

export function registerName(
  nftTrait: string,
  id: number,
  name: string,
  commission: string,
  account: Account
) {
  return Tx.contractCall(
    "nft-name-service",
    "register",
    [
      types.principal(nftTrait),
      types.uint(id),
      types.utf8(name),
      types.principal(commission),
    ],
    account.address
  );
}


export function deleteName(
  nftTrait: string,
  id: number,
  name: string,
  account: Account
) {
  return Tx.contractCall(
    "nft-name-service",
    "delete",
    [
      types.principal(nftTrait),
      types.uint(id),
      types.utf8(name),
    ],
    account.address
  );
}
