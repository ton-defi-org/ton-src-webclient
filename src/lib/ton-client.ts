import { TonConnection, TonhubProvider } from "@ton-defi.org/ton-connection";
import { Address, Cell, toNano } from "ton";
import BN from "bn.js";

export async function connectAndSendTxn(cell: Cell) {
  const tc = new TonConnection(
    new TonhubProvider({
      persistenceProvider: localStorage,
      onSessionLinkReady: (l) => {
        console.log(l);
        // window.open(l);
      },
      onTransactionLinkReady: (l) => {
        console.log(l, "txn");
      },
    }),
    "https://scalable-api.tonwhales.com/jsonRPC"
  );

  const con = await tc.connect();

  console.log(con);

  const txn = await tc.requestTransaction({
    to: Address.parse(process.env.REACT_APP_VERIFIER_REGISTRY!),
    value: toNano(0.05),
    message: cell,
  });

  console.log(txn);
}

export async function readContractDetails(codeCellHash: string): Promise<any> {
  const tc = new TonConnection(
    new TonhubProvider({
      persistenceProvider: localStorage,
      onSessionLinkReady: (l) => {
        console.log(l);
        // window.open(l);
      },
      onTransactionLinkReady: (l) => {
        console.log(l, "txn");
      },
    }),
    "https://scalable-api.tonwhales.com/jsonRPC"
  );

  // TODO tc number
  console.log("1");
  const res = await tc._tonClient.callGetMethod(
    Address.parse(process.env.REACT_APP_SOURCES_REGISTRY!),
    "get_source_item_address",
    [
      ["num", 0],
      ["num", new BN(Buffer.from(codeCellHash, "base64")).toString(10)],
    ]
  );
  console.log(res.stack[0][1]);

  const sourceItemAddr = Cell.fromBoc(
    Buffer.from(res.stack[0][1].bytes, "base64")
  )[0]
    .beginParse()
    .readAddress()!;

  console.log(sourceItemAddr);

  const isDeployed = await tc._tonClient.isContractDeployed(sourceItemAddr);
  console.log(isDeployed, "isDeployed");

  if (isDeployed) {
    const ipfs = await tc.makeGetCall(sourceItemAddr, "get_nft_data", [], (s) =>
      (s[4] as Cell).beginParse().readRemainingBytes().toString()
    );
    return ipfs;
  }

  return null;
}
