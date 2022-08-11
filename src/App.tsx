import {
  NextUIProvider,
  Card,
  Row,
  Col,
  Text,
  Input,
  Progress,
  Loading,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetRecoilState, useRecoilValue } from "recoil";
import { AddContract } from "./components/add-contract/AddContract";
import { compilerDetailsRecoil, contractStateRecoil } from "./store/store";
import { compileRecoil, fileRecoil } from "./store/store";
import { generateRecoil } from "./store/store";
import { ReturnedSource } from "./server-types/server-types";
import { ViewContract } from "./components/view-contract/ViewContract";
import { BaseCard } from "./components/shared/BaseCard";
import { DataPiece } from "./components/shared/DataPiece";
import {
  FetchableDataPiece,
  FetchablePiece,
} from "./components/shared/FetchableDataPiece";
import { useLoadContractDetails } from "./store/useLoadContractDetails";

import { createTheme } from "@nextui-org/react";

const darkTheme = createTheme({
  type: "dark",
});

function ContractAddressInput() {
  const { contractAddress } = useParams();
  const [val, setVal] = useState("");
  const navigate = useNavigate();
  const resetCompile = useResetRecoilState(compileRecoil);
  const resetFile = useResetRecoilState(fileRecoil);
  const resetCompilerDetails = useResetRecoilState(compilerDetailsRecoil);
  const resetContractState = useResetRecoilState(contractStateRecoil);

  // TODO improve these resets
  useEffect(() => {
    // setVal(contractAddress ?? "");
    resetCompile();
    resetFile();
    resetCompilerDetails();
    resetContractState();
  }, [
    contractAddress,
    resetCompile,
    resetFile,
    resetCompilerDetails,
    resetContractState,
  ]);

  return (
    <Input
      css={{
        ml: "auto",
        minWidth: 300,
        bgColor: "white",
        $$inputLabelColor: "yellow",
      }}
      type="search"
      labelLeft="Address"
      rounded
      bordered
      color="primary"
      aria-label="contract address"
      animated={false}
      onChange={(e: any) => {
        setVal(e.target.value);
      }}
      onKeyDown={(e: any) => {
        if (e.keyCode === 13) {
          navigate(`/${val}`);
          setVal("");
        }
      }}
      value={val}
    />
  );
}

function TopBar() {
  return (
    <div>
      <Card
        css={{
          $$cardColor: "$colors$blue500",
          borderRadius: 0,
          pl: 16,
          pr: 16,
        }}
      >
        <Card.Body>
          <Row align="center">
            <Text h3 color="white">
              TonSource
            </Text>
            <ContractAddressInput />
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

function ContractDetails() {
  const { contractAddress } = useParams();
  const contractState = useLoadContractDetails();

  return (
    <BaseCard>
      <Text css={{ mb: 12 }} h4>
        Contract data
      </Text>
      <DataPiece label="Address" data={contractAddress!} />
      <FetchableDataPiece label="Hash" data={contractState.hash} />
    </BaseCard>
  );
}

function App() {
  const contractState = useRecoilValue(contractStateRecoil);
  const { contractAddress } = useParams();
  return (
    <NextUIProvider>
      <Col css={{ pb: 24 }}>
        <TopBar />
        {contractAddress && <ContractDetails />}
        {contractState.source.data === undefined && <Loading type="points-opacity" css={{ mx: "auto", display: 'block', my: 30 }} size="xl" />}
        {contractAddress && contractState.source.data === null && (
          <AddContract />
        )}
        {contractState.source.data && <ViewContract />}
        {!contractAddress && (
          // TODO input
          <Text css={{ textAlign: "center", mt: 48 }} h2>
            Enter a contract address...
          </Text>
        )}
      </Col>
    </NextUIProvider>
  );
}

export default App;