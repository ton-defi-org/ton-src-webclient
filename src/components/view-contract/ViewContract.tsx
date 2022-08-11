import { FileViewer, selectedFileRecoil } from "./FileViewer";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, Grid, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { DataPiece } from "../shared/DataPiece";
import { BaseCard } from "../shared/BaseCard";
import { contractStateRecoil } from "../../store/store";
import { useParams } from "react-router-dom";

export function ViewContractDetails() {
  const contractState = useRecoilValue(contractStateRecoil);

  return (
    <BaseCard>
      <Text css={{ mb: 12 }} h4>
        Compiler details
      </Text>
      {/* <FetchableDataPiece label="Hash" data={contractState.hash} /> */}
      <DataPiece label="Compiler" data={contractState.source.data?.compiler} />
      <DataPiece label="Version" data={contractState.source.data?.version} />
      <DataPiece
        label="Original contract"
        data={contractState.source.data?.knownContractAddress}
      />
      <DataPiece
        label="Command line"
        data={contractState.source.data?.compileCommandLine || "N/A"}
      />
      <DataPiece
        label="Verified since"
        data={new Date(
          contractState.source?.data?.verificationDate ?? 0
        ).toDateString()}
      />
    </BaseCard>
  );
}

export function ViewContractCode() {
  return (
    <BaseCard>
      <Text h4>Source code</Text>
      <FileViewer />
    </BaseCard>
  );
}

function ViewContractVerification() {
  const c = useRecoilValue(contractStateRecoil);
  const { contractAddress } = useParams();

  return (
    <BaseCard>
      <Text h4>Verify manually</Text>
      <pre style={{ border: "1px solid #00000022", whiteSpace: "pre-line" }}>
        {"# Get code hash from tonwhales API. Note: jq must be installed\n"}
        {`CODE_CELL=$(curl -X 'GET' \
  'https://toncenter.com/api/v2/getAddressInformation?address=${contractAddress}' \
  -H 'accept: application/json' | jq -r '.result.code')\n`}

        {"\n# Download all files\n"}
        {c.source.data?.sources.map(
          (x) => `curl ${x.url} -o ${x.originalFilename}\n`
        )}

        {"\n# Compile\n...\n"}
        {"\n# Verify hashes are similar\n...\n"}
      </pre>
    </BaseCard>
  );
}

export function ViewContract() {
  return (
    <Grid.Container direction="column">
      <ViewContractDetails />
      <ViewContractCode />
      <ViewContractVerification />
    </Grid.Container>
  );
}