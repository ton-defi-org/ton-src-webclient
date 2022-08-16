import { FileViewer, selectedFileRecoil } from "./FileViewer";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  Button,
  Col,
  Container,
  Grid,
  Link,
  Row,
  Text,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { DataPiece } from "../shared/DataPiece";
import { BaseCard } from "../shared/BaseCard";
import { contractStateRecoil } from "../../store/store";
import { useParams } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import _template from "../../res/verify.txt";
import { WrappedAceEditor } from "./WrappedAceEditor";

TimeAgo.addDefaultLocale(en);

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
        data={new TimeAgo("en-US").format(
          new Date(contractState.source?.data?.verificationDate ?? 0)
        )}
      />
    </BaseCard>
  );
}

enum CodeTab {
  DECOMPILED,
  FUNC,
}

export function ViewContractCode() {
  const contractState = useRecoilValue(contractStateRecoil);
  const [selectedTab, setSelectedTab] = useState(
    !!contractState.source.data ? CodeTab.FUNC : CodeTab.DECOMPILED
  );

  // const isDecompiled
  return (
    <BaseCard>
      <Text h4>Source code</Text>
      <Button.Group>
        <Button
          bordered={selectedTab !== CodeTab.FUNC}
          disabled={!contractState.source.data}
          onClick={() => {
            setSelectedTab(CodeTab.FUNC);
          }}
        >
          func
        </Button>
        <Button
          bordered={selectedTab !== CodeTab.DECOMPILED}
          onClick={() => {
            setSelectedTab(CodeTab.DECOMPILED);
          }}
        >
          Decompiled
        </Button>
      </Button.Group>
      {selectedTab === CodeTab.FUNC && <FileViewer />}
      {selectedTab === CodeTab.DECOMPILED && (
        <div style={{ marginTop: 12 }}>
          <WrappedAceEditor
            content={contractState.decompiled.data}
            mode={"javascript"}
          />
        </div>
      )}
    </BaseCard>
  );
}

function download(filename: string, text: string) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function ViewContractVerification() {
  const c = useRecoilValue(contractStateRecoil);
  const { contractAddress } = useParams();

  const [template, setTemplate] = useState("");

  useEffect(() => {
    fetch(_template)
      .then((s) => s.text())
      .then((t) => {
        setTemplate(
          t.replace(
            "%%CONFIG%%",
            JSON.stringify(
              {
                address: contractAddress,
                files: c.source.data!.sources.map((s) => [
                  s.url,
                  s.originalFilename,
                ]),
                compilationCommandLine: c.source.data!.compileCommandLine,
              },
              null,
              4
            )
          )
        );
      });
  }, [c.source.data, setTemplate, contractAddress]);

  return (
    <BaseCard>
      <Text css={{ mb: 12 }} h4>
        Verify manually
      </Text>
      {/* TODO merge style with second ace editor */}

      <WrappedAceEditor mode="javascript" content={template} />

      <pre
        style={{
          border: "1px solid #00000022",
          whiteSpace: "pre-line",
        }}
      >
        <Grid.Container direction="column" css={{ rowGap: 16 }}>
          <Grid>
            1.{" "}
            <Link
              target="_blank"
              href="https://github.com/ton-defi-org/ton-binaries"
            >
              Install func and fift
            </Link>{" "}
            and{" "}
            <Link href="https://nodejs.org/en/download/" target="_blank">
              node.js
            </Link>
          </Grid>
          <Grid>
            2.{" "}
            <Link
              onClick={() => {
                download("verify.js", template);
              }}
            >
              Download
            </Link>{" "}
            <code>verify.js</code> and place it in a new folder
          </Grid>
          <Grid>
            3. Run&nbsp;<code>npm install axios ton</code>
          </Grid>
          <Grid>
            4. Run&nbsp;<code>node verify.js</code>
          </Grid>
        </Grid.Container>
      </pre>
    </BaseCard>
  );
}

export function ViewContract() {
  const { source } = useRecoilValue(contractStateRecoil);

  return (
    <Grid.Container direction="column">
      {source.data && <ViewContractDetails />}
      <ViewContractCode />
      {source.data && <ViewContractVerification />}
    </Grid.Container>
  );
}
