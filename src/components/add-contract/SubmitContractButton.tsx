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
import { connectAndSendTxn, readContractDetails } from "../../lib/ton-client";
import { Cell } from "ton";
import { useTonConnection } from "../../WalletConnection";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

enum CaptchState {
  NOT_STARTED,
  PENDING,
  DONE,
}

export function SubmitContractButton() {
  const filesState = useRecoilValue(fileRecoil);
  const [contractState, setContractState] = useRecoilState(contractStateRecoil);
  const [compileState, setCompileState] = useRecoilState(compileRecoil);
  const compilerDetails = useRecoilValue(compilerDetailsRecoil);
  let { contractAddress } = useParams();
  const { getConnection, walletAddress } = useTonConnection();

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
      <Button.Group>
        <Button
          css={{ ml: 16 }}
          disabled={
            captchaState === CaptchState.PENDING ||
            !filesState.hasFiles ||
            !contractState.hash.data ||
            !contractAddress ||
            !!compileState.msgCell
            // compileState.compileResult?.result === "similar" // This implies source has been uploaded already
          }
          onClick={async () => {
            if (captchaState === CaptchState.NOT_STARTED) {
              setCaptchaState(CaptchState.PENDING);
              return;
            }

            if (captchaState !== CaptchState.DONE) return;

            try {
              setCompileState((s) => ({ isLoading: true }));
              const res = await client.tryCompile(
                contractState.hash.data!,
                filesState.uploadedFiles,
                contractAddress!,
                compilerDetails,
                walletAddress!
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
          }}
        >
          Step 1: Compile
        </Button>
        <Button
          disabled={
            !compileState.msgCell ||
            contractState.isSourceItemContractDeployed ||
            !walletAddress
          }
          onClick={async () => {
            if (!walletAddress) return;

            await connectAndSendTxn(
              getConnection(),
              // @ts-ignore fix buffer
              Cell.fromBoc(Buffer.from(compileState.msgCell!.data))[0]
            );

            for (let i = 0; i < 20; i++) {
              const isDeployed = !!(await readContractDetails(
                contractState.hash.data!
              ));
              if (isDeployed) {
                setContractState((s) => ({
                  ...s,
                  isSourceItemContractDeployed: true,
                }));
                break;
              }
              await sleep(3000);
            }
          }}
        >
          Step 2: Submit TXN
        </Button>
        <Button
          color="success"
          disabled={!contractState.isSourceItemContractDeployed}
          onClick={() => {
            window.location.reload();
          }}
        >
          Step 3: View Verified Contract
        </Button>
      </Button.Group>
    </Col>
  );
}
