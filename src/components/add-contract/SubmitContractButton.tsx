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
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { connectAndSendTxn } from "../../lib/ton-client";
import { Cell } from "ton";

enum CaptchState {
  NOT_STARTED,
  PENDING,
  DONE,
}

export function SubmitContractButton() {
  const filesState = useRecoilValue(fileRecoil);
  const contractState = useRecoilValue(contractStateRecoil);
  const [compileState, setCompileState] = useRecoilState(compileRecoil);
  const compilerDetails = useRecoilValue(compilerDetailsRecoil);
  const buttonLabel = compileState.msgCell ? "Submit TXN" : "Compile";
  let { contractAddress } = useParams();

  const [captchaState, setCaptchaState] = useState(
    process.env.NODE_ENV === "production"
      ? CaptchState.NOT_STARTED
      : CaptchState.DONE
  );

  return (
    <Col
      css={{
        mt: 24,
        ml: "auto",
        width: "auto",
        alignItems: "right",
        d: "flex",
      }}
      as="span"
    >
      {process.env.NODE_ENV === "production" &&
        captchaState !== CaptchState.NOT_STARTED && (
          <ReCAPTCHA
            sitekey="6LdVmmghAAAAAJzuecwbSQ9T5oe3PS1bGdxY0FYU"
            onChange={() => setCaptchaState(CaptchState.DONE)}
            onExpired={() => setCaptchaState(CaptchState.PENDING)}
            size={"normal"}
          />
        )}
      <Button
        css={{ ml: 16 }}
        disabled={
          captchaState === CaptchState.PENDING ||
          !filesState.hasFiles ||
          !contractState.hash.data ||
          !contractAddress 
          // compileState.compileResult?.result === "similar" // This implies source has been uploaded already
        }
        onClick={async () => {
          if (captchaState === CaptchState.NOT_STARTED) {
            setCaptchaState(CaptchState.PENDING);
            return;
          }

          if (captchaState !== CaptchState.DONE) return;

          if (!compileState.msgCell) {
            try {
              setCompileState((s) => ({ isLoading: true }));
              const res = await client.tryCompile(
                contractState.hash.data!,
                filesState.uploadedFiles,
                contractAddress!,
                compilerDetails
              );

              console.log(res);

              setCompileState((s) => ({ ...s, ...res, isLoading: false }));
            } catch (e: any) {
              console.log(e);
              setCompileState((s) => ({
                ...s,
                error: e.toString(),
                isLoading: false,
              }));
            }
          } else {
            // @ts-ignore fix buffer
            await connectAndSendTxn(Cell.fromBoc(Buffer.from(compileState.msgCell!.data))[0]);
          }
        }}
      >
        {buttonLabel}
      </Button>
    </Col>
  );
}
