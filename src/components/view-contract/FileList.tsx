import { Col, Text, Container } from "@nextui-org/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { contractStateRecoil } from "../../store/store";
import { selectedFileRecoil } from "./FileViewer";

export function FileList() {
  const [selectedFile, setSelectedFile] = useRecoilState(selectedFileRecoil);
  const contractState = useRecoilValue(contractStateRecoil);

  const rows = contractState.source.data?.sources.map((f) => {
    return (
      <Col
        key={f.filename}
        onClick={() => {
          if (selectedFile.selected !== f.filename) {
            // @ts-ignore
            setSelectedFile({ selected: f.filename });
          }
        }}
        css={{
          bgColor:
            f.filename === selectedFile.selected ? "$blue400" : "white",
          textAlign: "left",
          cursor: "pointer",
          py: 8,
          px: 10,
          borderRadius: 4,
          "&:hover": {
            bgColor:
              f.filename === selectedFile.selected
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
          key={f.filename}
        >
          {f.filename}
        </Text>
      </Col>
    );
  });

  return <Container css={{ pl: 4, pr: 24 }}>{rows}</Container>;
}
