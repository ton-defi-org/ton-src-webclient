import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { client } from "../lib/client";
import {
  getContractBalance,
  getContractCodeHash,
  sortByProps,
  workchainForAddress,
} from "../lib/utils";
import { contractStateRecoil } from "./store";

export function useLoadContractDetails() {
  const { contractAddress } = useParams();
  const [contractState, setContractState] = useRecoilState(contractStateRecoil);
  useEffect(() => {
    if (!contractAddress) return;

    setContractState((s) => ({
      ...s,
      workchain: workchainForAddress(contractAddress),
    }));

    (async () => {
      try {
        const onChainCodeHash = await getContractCodeHash(contractAddress);
        setContractState((s) => ({
          ...s,
          hash: { data: onChainCodeHash },
        }));

        const balance = await getContractBalance(contractAddress);
        setContractState((s) => ({
          ...s,
          balance: { data: balance },
        }));
      } catch (e) {
        setContractState((s: any) => ({ ...s, hash: { error: String(e) } }));
      }
    })();
  }, [contractAddress, setContractState]);

  useEffect(() => {
    if (!contractState.hash?.data) return;
    (async () => {
      try {
        const res = await client.get(contractState.hash.data!);
        // console.log(res);
        if (res)
          res.sources = sortByProps(res.sources, [
            ["isEntrypoint", false],
            ["isStdLib", true],
          ]);
        setContractState((prev) => ({
          ...prev,
          source: { data: res ?? null },
        }));
      } catch (e) {
        setContractState((prev) => ({
          ...prev,
          source: { error: `${e}` },
        }));
      }
    })();
  }, [contractState.hash, setContractState]);

  return contractState;
}
