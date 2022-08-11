import { Col, Row } from "@nextui-org/react";
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
