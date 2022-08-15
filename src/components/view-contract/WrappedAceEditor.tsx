import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools";
import { Col, Loading } from "@nextui-org/react";

export function WrappedAceEditor({
  content,
  mode,
}: {
  content?: string;
  mode: "c_cpp" | "javascript";
}) {
  return (
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
        mode={mode}
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
  );
}
