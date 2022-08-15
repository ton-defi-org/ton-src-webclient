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
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools";

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

export function ViewContractCode() {
  return (
    <BaseCard>
      <Text h4>Source code</Text>
      <FileViewer />
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
                // TODO get this from server
                compilationCommandLine: `func -o temp.fift -SPA ${c.source
                  .data!.sources.filter((s) => s.includeInCompile)
                  .reverse()
                  .map((s) => s.originalFilename)
                  .join(" ")}`,
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

      <Col
        css={{
          border: "1.5px solid #00000024",
          br: 8,
          px: 12,
          pt: 12,
          minHeight: 600,
        }}
      >
        <AceEditor
          fontSize={14}
          mode="javascript"
          theme="xcode"
          name="code__"
          // editorProps={{ $blockScrolling: true }}
          value={template}
          height="600px"
          style={{ width: "100%" }}
          readOnly
          showPrintMargin={false}
          showGutter={false}
          cursorStart={0}
          highlightActiveLine={false}
        />
      </Col>
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
              onClick={() => {
                download("verify.js", template);
              }}
            >
              Download
            </Link>{" "}
            <code>verify.js</code> and place it in a new folder
          </Grid>
          <Grid>
            2. Run&nbsp;<code>npm install axios ton</code>
          </Grid>
          <Grid>
            3. Run&nbsp;<code>node verify.js</code>
          </Grid>
        </Grid.Container>
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
