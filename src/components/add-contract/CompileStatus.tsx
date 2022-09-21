import { useRecoilValue } from "recoil";
import { Loading, Row, Col, Text, Button } from "@nextui-org/react";
import { DataPiece } from "../shared/DataPiece";
import { compileRecoil } from "../../store/store";
import { BaseCard } from "../shared/BaseCard";

export function CompileStatus() {
  const compileState = useRecoilValue(compileRecoil);

  let matchIcon = "";

  if (compileState.compileResult?.result === "similar") {
    matchIcon = "✅";
  } else if (compileState.compileResult?.result) {
    matchIcon = "❌";
  }

  return (
    <BaseCard>
      <Text css={{ mb: 12 }} h4>
        Compilation status
      </Text>

      {compileState.isLoading && (
        <Row>
          <Loading type="points-opacity" />
        </Row>
      )}

      {compileState.compileResult?.error && (
        <Row css={{ br: 8, bgColor: "$accents2", mb: 8, px: 16 }}>
          <pre style={{ whiteSpace: "pre-line" }}>
            {compileState.compileResult?.error}
          </pre>
        </Row>
      )}

      {compileState.compileResult?.hash && (
        <DataPiece label="Hash" data={compileState.compileResult?.hash + " " + matchIcon} />
      )}
      {compileState.compileResult?.result === "not_similar" && (
        <Text color="error">Hashes do not match</Text>
      )}
    </BaseCard>
  );
}
