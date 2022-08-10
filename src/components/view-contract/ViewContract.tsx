import { FileViewer, selectedFileRecoil } from "./FileViewer";
import { useRecoilState, useRecoilValue } from "recoil";
import { Button, Grid, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { DataPiece } from "../shared/DataPiece";
import { BaseCard } from "../shared/BaseCard";
import { contractStateRecoil } from "../../store/store";
import { useParams } from 'react-router-dom';

export function ViewContractDetails() {
  const contractState = useRecoilValue(contractStateRecoil);

  return (
    <BaseCard>
      <Text h4>Compiler details</Text>
      <br />
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
  const {contractAddress} = useParams();

  return (
    <BaseCard>
      <Text css={{ mb: 8 }} h4>
        Verify manually
      </Text>
      {/* <Grid.Container direction="column" gap={1}>
        <Grid>
          <Button css={{ ta: "left" }} flat>
            Ensure code hash is the same as displayed in this page (tonscan
            etc.)
          </Button>
        </Grid>
        <Grid>
          <Button css={{ ta: "left" }} flat>
            Download sources (.zip)
          </Button>
        </Grid>
        <Grid>
          <Button css={{ ta: "left" }} flat>
            Compile and run ./fift-to-hash.sh
          </Button>
        </Grid>
      </Grid.Container> */}
      <pre style={{ border: "1px solid #00000022", whiteSpace: "pre-line" }}>
        {"# Get code hash from tonwhales API\n"}
        {`curl -X 'GET' \
  'https://toncenter.com/api/v2/getAddressInformation?address=${contractAddress}' \
  -H 'accept: application/json'\n`}

        {"\n# Download all files\n"}
        {c.source.data?.sources.map(
          (x) => `curl ${x.url} > ${x.originalFilename}\n`
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
