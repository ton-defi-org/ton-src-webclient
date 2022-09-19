import { Col, Loading } from "@nextui-org/react";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { contractStateRecoil } from "../../store/store";
import { selectedFileRecoil } from "./FileViewer";
import { WrappedAceEditor } from "./WrappedAceEditor";

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
      )?.codeLocationPointer?.replace("", "https://tonsource.infura-ipfs.io/ipfs/") ?? ""
    )
      .then((f) => f.text())
      .then(setContent);
  }, [selectedFile, contractState.source.data?.sources]);

  return <WrappedAceEditor mode="c_cpp" content={content} />;
}
