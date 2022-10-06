import { Button, Modal, Text } from "@nextui-org/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { walletConnectionRecoil } from "./store/store";
import QR from "react-qr-code";
import { useState, useEffect } from "react";
import WalletConnectionX from "./useTonConnection";

export function useTonConnection() {
  const [link, setLink] = useState<string | undefined>(undefined);
  const [wallet, setWallet] = useRecoilState(walletConnectionRecoil);
  useEffect(() => {
    (async () => {
      const addr = await WalletConnectionX.connect(() => {});
      setWallet({ address: addr.address });
    })();
  }, [setWallet]);

  const connect = async () => {
    const addr = await WalletConnectionX.connect(setLink);
    setLink(undefined);
    setWallet({ address: addr.address });
  };

  return {
    link,
    connect: connect,
    walletAddress: wallet.address,
    getConnection: () => WalletConnectionX.getConnection(),
  };
}

export function WalletConnection() {
  const { address } = useRecoilValue(walletConnectionRecoil);
  const { link, connect } = useTonConnection();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {!address && (
        <Button
          onClick={async () => {
            connect();
            setModalOpen(true);
          }}
        >
          Connect
        </Button>
      )}
      {address && (
        <div>
          {address}
          {/* <Button onClick={()=>{requestTxn({})}}>d</Button> */}
        </div>
      )}

      <Modal
        open={!!link}
        closeButton
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Welcome to
            <Text b size={18}>
              NextUI
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <QR value={link ?? ""} />
        </Modal.Body>
      </Modal>
    </>
  );
}
