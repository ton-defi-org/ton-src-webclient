import { TonConnection, TonhubProvider } from "@ton-defi.org/ton-connection";
import { Address, Cell, toNano } from "ton";

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
