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
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const navigate = useNavigate();

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
            <Text
              h3
              color="white"
              onClick={() => {
                navigate("/");
              }}
              css={{ cursor: "pointer" }}
            >
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
        Contract
      </Text>
      <DataPiece label="Address" data={contractAddress!} />
      <DataPiece label="Workchain" data={`${contractState.workchain ?? ""}`} />
      <FetchableDataPiece label="Hash" data={contractState.hash} />
      <FetchableDataPiece
        label="Balance"
        data={contractState.balance}
        format={(d) => `${d} TON`}
      />
    </BaseCard>
  );
}

function App() {
  const contractState = useRecoilValue(contractStateRecoil);
  const { contractAddress } = useParams();
  const navigate = useNavigate();

  return (
    <NextUIProvider>
      <Col css={{ pb: 24 }}>
        <TopBar />
        {contractAddress && <ContractDetails />}
        {contractAddress && contractState.source.data === undefined && (
          <BaseCard>
            <Skeleton count={4} />
          </BaseCard>
        )}
        {contractAddress && contractState.source.data === null && (
          <AddContract />
        )}
        {contractState.source.data !== undefined && <ViewContract />}
        {!contractAddress && (
          // TODO input
          // <Text css={{ textAlign: "center", mt: 48 }} h2>
          //   Enter a contract address...
          // </Text>d
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Input
              status="primary"
              css={{
                mt: 90,
                "--nextui--inputColor": "white",
                "--nextui--inputFontSize": "1.7rem",
                "--nextui--inputHeightRatio": 3,
                w: "50%",
              }}
              placeholder="Enter contract address"
              bordered
              animated={false}
              type="search"
              onKeyDown={(e: any) => {
                if (e.keyCode === 13) {
                  navigate(`/${e.target.value}`);
                }
              }}
            />
          </div>
        )}
      </Col>
    </NextUIProvider>
  );
}

export default App;
