import {
  Clarinet,
  Tx,
  Chain,
  Account,
  assertEquals,
  types,
} from "./client/deps.ts";
import { mintFunNFT } from "./client/fun-nft-client.ts";
import { registerName, deleteName } from "./client/nft-name-service-client.ts";

Clarinet.test({
  name: "User can register a name on owned nft",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;

    // mint nft
    let block = chain.mineBlock([mintFunNFT(deployer)]);
    block.receipts[0].result.expectOk().expectBool(true);

    block = chain.mineBlock([
      registerName(
        `${deployer.address}.fun-nft`,
        1,
        "Fun Man",
        `${deployer.address}.commission-free`,
        deployer
      ),
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "User can delete a name on owned nft",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;

    // mint nft
    let block = chain.mineBlock([
      mintFunNFT(deployer),
      registerName(
        `${deployer.address}.fun-nft`,
        1,
        "Fun Man",
        `${deployer.address}.commission-free`,
        deployer
      ),
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectBool(true);

    block = chain.mineBlock([
      deleteName(`${deployer.address}.fun-nft`, 1, "Fun Man", deployer),
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "User can't register existing name in collection",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;

    // mint nft
    let block = chain.mineBlock([
      mintFunNFT(deployer),
      mintFunNFT(deployer),
      registerName(
        `${deployer.address}.fun-nft`,
        1,
        "Fun Man",
        `${deployer.address}.commission-free`,
        deployer
      ),
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[1].result.expectOk().expectBool(true);
    block.receipts[2].result.expectOk().expectBool(true);

    block = chain.mineBlock([
      registerName(
        `${deployer.address}.fun-nft`,
        2,
        "Fun Man",
        `${deployer.address}.commission-free`,
        deployer
      ),
    ]);
    block.receipts[0].result.expectErr().expectUint(501);
  },
});

Clarinet.test({
  name: "Client can take a fee for registering a name",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;

    // mint nft
    let block = chain.mineBlock([mintFunNFT(deployer)]);
    block.receipts[0].result.expectOk().expectBool(true);

    block = chain.mineBlock([
      registerName(
        `${deployer.address}.fun-nft`,
        1,
        "Fun Man",
        `${deployer.address}.commission-fixed`,
        deployer
      ),
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
    block.receipts[0].events.expectSTXTransferEvent(
      2_000_000,
      deployer.address,
      "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9"
    );
  },
});
