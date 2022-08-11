import { Col, Loading } from "@nextui-org/react";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { contractStateRecoil } from "../../store/store";
import { selectedFileRecoil } from "./FileViewer";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools";

export function CodeViewer() {
  const selectedFile = useRecoilValue(selectedFileRecoil);
  const contractState = useRecoilValue(contractStateRecoil);

  const [content, setContent] = useState("");

  useEffect(() => {
    setContent("");
    if (!selectedFile) {
      return;
    }
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
      {!content && <Loading type="points-opacity" />}
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
