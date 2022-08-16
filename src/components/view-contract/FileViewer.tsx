import { Col, Row, Text } from "@nextui-org/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";

import { contractStateRecoil, generateRecoil } from "../../store/store";
import { useFileState } from "../../store/useFileState";
import { CodeViewer } from "./CodeViewer";
import { FileList } from "./FileList";

export const selectedFileRecoil = generateRecoil({ selected: "" }, () => ({}));

export function FileViewer() {
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileRecoil);
  const contractState = useRecoilValue(contractStateRecoil);

  useEffect(() => {
    if (contractState.source.data?.sources?.[0]?.originalFilename) {
      setSelectedFile({
        selected: contractState.source.data?.sources?.[0]?.originalFilename,
      });
    }
  }, [contractState.source.data?.sources, setSelectedFile]);

  return (
    <Col>
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
      <Row
        css={{
          mt: 8,
          border: "1px solid $accents3",
          br: 12,
          p: 16,
        }}
      >
        <Col css={{d: 'flex', flexDirection: 'column', columnGap: 24}}>
          <Text h4 css={{ mb: 8 }}>
            Is this the actual on-chain code?
          </Text>
          <Text>
            ✅ This code compiles to fift which is compiled to the exact
            bytecode as the contract stored on chain
          </Text>
          <Text>✅ Method names are exactly the same</Text>
          <Text>
            ✅ You can use the code above to write tests that will function
            exactly as the contract stored on chain
          </Text>
          <Text>ℹ️ Variable names may differ from original source code</Text>
          <Text>ℹ️ Comments may not be honest </Text>
          <Text> ❗ Always do your own research</Text>
        </Col>
      </Row>
    </Col>
  );
}
