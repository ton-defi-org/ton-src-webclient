import { Button } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  compileRecoil,
  contractStateRecoil,
  fileRecoil,
} from "../../store/store";
import { compilerDetailsRecoil } from "../../store/store";
import { client } from "../../lib/client";
import { Col } from "@nextui-org/react";

export function SubmitContractButton() {
  const filesState = useRecoilValue(fileRecoil);
  const contractState = useRecoilValue(contractStateRecoil);
  const [compileState, setCompileState] = useRecoilState(compileRecoil);
  const compilerDetails = useRecoilValue(compilerDetailsRecoil);
  let { contractAddress } = useParams();

  return (
    <Col
      css={{
        mt: 24,
        ml: "auto",
        width: "auto",
      }}
      as="span"
    >
      <Button
        disabled={
          !filesState.hasFiles ||
          !contractState.hash.data ||
          !contractAddress ||
          filesState.warnings.length > 0 ||
          compileState.result === "similar" // This implies source has been uploaded already
        }
        onClick={async () => {
          try {
            setCompileState((s) => ({ isLoading: true }));
            const res = await client.tryCompile(
              contractState.hash.data!,
              filesState.uploadedFiles,
              contractAddress!,
              compilerDetails
            );

            setCompileState((s) => ({ ...s, ...res, isLoading: false }));
          } catch (e: any) {
            setCompileState((s) => ({
              ...s,
              error: e.toString(),
              isLoading: false,
            }));
          }
        }}
      >
        Submit
      </Button>
    </Col>
  );
}
