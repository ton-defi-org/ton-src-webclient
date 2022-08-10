import { Col, Text, Row, Container } from "@nextui-org/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools";
import { contractStateRecoil, generateRecoil } from "../../store/store";
import { useFileState } from "../../store/useFileState";

export const selectedFileRecoil = generateRecoil({ selected: "" }, () => ({}));

function FileList() {
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileRecoil);
  const contractState = useRecoilValue(contractStateRecoil);

  const rows = contractState.source.data?.sources.map((f) => {
    return (
      <Col
        onClick={() => {
          // @ts-ignore
          setSelectedFile({ selected: f.originalFilename });
        }}
        css={{
          bgColor:
            f.originalFilename === selectedFile.selected
              ? "$blue400"
              : "white",
          textAlign: "left",
          cursor: "pointer",
          py: 8,
          px: 10,
          borderRadius: 4,
          "&:hover": {
            bgColor:
              f.originalFilename === selectedFile.selected
                ? "$blue400"
                : "$blue200",
          },
        }}
      >
        <Text
          css={{
            textAlign: "left",
            cursor: "pointer",
          }}
          key={f.originalFilename}
        >
          {f.originalFilename}
        </Text>
      </Col>
    );
  });

  return <Container css={{ pl: 4, pr: 24 }}>{rows}</Container>;
}

function CodeViewer() {
  const selectedFile = useRecoilValue(selectedFileRecoil);
  const contractState = useRecoilValue(contractStateRecoil);

  const [content, setContent] = useState("");

  useEffect(() => {
    if (!selectedFile) return;
    fetch(
      contractState.source.data?.sources.find(
        (f) => f.originalFilename === selectedFile.selected
      )?.url ?? ""
    )
      .then((f) => f.text())
      .then(setContent);
  }, [selectedFile, contractState.source.data?.sources]);

  return (
    // (
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
        mode="c_cpp"
        theme="xcode"
        name="code__"
        // editorProps={{ $blockScrolling: true }}
        value={content}
        height="600px"
        style={{ width: "100%" }}
        readOnly
        showPrintMargin={false}
        showGutter={false}
        cursorStart={0}
        highlightActiveLine={false}
      />
    </Col>
    // ),
    // (
    //   <Container as="pre" css={{ bgColor: "$accents1", maxH: 480 }}>
    //     {file}
    //   </Container>
    // )
  );
}

export function FileViewer() {
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileRecoil);
  const contractState = useRecoilValue(contractStateRecoil);

  useEffect(() => {
    if (contractState.source.data?.sources?.[0]?.originalFilename) {
      setSelectedFile({
        selected: contractState.source.data?.sources?.[0]?.originalFilename,
      });
    }
  }, [
    contractState.source.data?.sources,
    setSelectedFile,
  ]);

  return (
    <Row css={{ pt: 12 }}>
      {(contractState.source?.data?.sources?.length ?? 0) > 0 && (
        <Col span={2}>
          <FileList />
        </Col>
      )}
      {(contractState.source?.data?.sources?.length ?? 0) &&
        selectedFile.selected && (
          <Col span={10} css={{ border: "$accents0" }}>
            <CodeViewer />
          </Col>
        )}
    </Row>
  );
}
