import { Address, TonClient, Cell, fromNano } from "ton";

const client = new TonClient({
  endpoint: "https://scalable-api.tonwhales.com/jsonRPC",
});

export function workchainForAddress(address: string): string {
  try {
    const _address = Address.parse(address);
    switch (_address.workChain) {
      case -1:
        return "Masterchain";
      case 0:
        return "Basic Workchain";
      default:
        return `${_address.workChain}`;
    }
  } catch (e) {
    return "";
  }
}

export async function getContractBalance(address: string) {
  const _address = Address.parse(address);
  const b = await client.getBalance(_address);

  return fromNano(b);
}
export async function getContractCodeHash(address: string) {
  const _address = Address.parse(address);
  let data = await client.getContractState(_address);
  let codeCell = Cell.fromBoc(data.code!);

  return codeCell[0].hash().toString("base64");
}

export function sortByProps(
  arr: any[],
  props: [prop: string, isAsc: boolean][]
) {
  const _props = props.reverse().slice();
  return arr
    .slice()
    .sort((s1: any, s2: any) =>
      _props.reduce(
        (sortRes, [prop, isAsc], i) =>
          sortRes +
          (Number(s2[prop]) - Number(s1[prop])) * (i + 1) * (isAsc ? -1 : 1),
        0
      )
    );
}
