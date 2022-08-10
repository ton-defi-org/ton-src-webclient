import { Address, TonClient, Cell } from "ton";

const client = new TonClient({
  endpoint: "https://scalable-api.tonwhales.com/jsonRPC",
});

export async function getHashByContractAddress(address: string) {
  let data = await client.getContractState(Address.parse(address));
  let codeCell = Cell.fromBoc(data.code!);

  return {
    onChainCodeHash: codeCell[0].hash().toString("base64"),
  };
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
