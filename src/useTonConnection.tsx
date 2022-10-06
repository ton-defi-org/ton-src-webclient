import { TonConnection, TonhubProvider } from "@ton-defi.org/ton-connection";
import { Address } from "ton";
import { RPC_API } from "./lib/utils";

class WalletConnection {
  private static connection?: TonConnection;

  private constructor() {}

  public static getConnection() {
    if (!this.connection) {
      throw new Error("Connection missing");
    }
    return this.connection;
  }

  public static isContractDeployed(contractAddr: Address) {
    return this.connection?._tonClient.isContractDeployed(contractAddr);
  }

  public static async connect(
    onLinkReady: (link: string) => void,
    onTransactionLinkReady?: (link: string) => void
  ) {
    let prov;

    prov = new TonhubProvider({
      onSessionLinkReady: onLinkReady,
      persistenceProvider: localStorage,
      onTransactionLinkReady,
    });

    this.connection = new TonConnection(prov, RPC_API);
    return this.connection.connect();
  }
}

export default WalletConnection;
