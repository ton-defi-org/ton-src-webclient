import { TonConnection, TonhubProvider } from "@ton-defi.org/ton-connection";
import { Address, Cell, toNano } from "ton";
import BN from "bn.js";
import { Sha256 } from "@aws-crypto/sha256-js";
export const toSha256Buffer = (s: string) => {
  const sha = new Sha256();
  sha.update(s);
  return Buffer.from(sha.digestSync());
};

const tc = new TonConnection(
  null,
  "https://scalable-api.tonwhales.com/jsonRPC"
);

export async function getSourceItemAddress(codeCellHash: string) {
  const res = await tc._tonClient.callGetMethod(
    Address.parse(process.env.REACT_APP_SOURCES_REGISTRY!),
    "get_source_item_address",
    [
      ["num", new BN(toSha256Buffer("orbs.com")).toString()], // TODO const
      ["num", new BN(Buffer.from(codeCellHash, "base64")).toString(10)],
    ]
  );

  return Cell.fromBoc(Buffer.from(res.stack[0][1].bytes, "base64"))[0]
    .beginParse()
    .readAddress()!;
}

export async function connectAndSendTxn(tonConnect: TonConnection, cell: Cell) {
  await tonConnect.requestTransaction({
    to: Address.parse(process.env.REACT_APP_VERIFIER_REGISTRY!),
    value: toNano(0.05),
    message: cell,
  });
}

export async function readContractDetails(codeCellHash: string): Promise<any> {
  const sourceItemAddr = await getSourceItemAddress(codeCellHash);

  // TODO tc number
  const isDeployed = await tc._tonClient.isContractDeployed(sourceItemAddr);
  console.log(isDeployed, "isDeployed");

  if (isDeployed) {
    const ipfs = await tc.makeGetCall(sourceItemAddr, "get_nft_data", [], (s) =>
      (s[4] as Cell).beginParse().readRemainingBytes().toString()
    );
    console.log("ipfs", ipfs);
    return ipfs;
  }

  return null;
}
