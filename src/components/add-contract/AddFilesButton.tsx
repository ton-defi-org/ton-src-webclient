import { Button } from "@nextui-org/react";
import { useRef } from "react";
import { useFileState } from "../../store/useFileState";

export function AddFilesButton() {
  const { addFiles } = useFileState();
  const inputRef = useRef(null);

  const onUploadFiles = async (e: any) => {
    await addFiles(Array.from(e.target.files));
  };

  return (
    <div>
      <div>
        <Button
          onClick={() => {
            // @ts-ignore
            inputRef.current?.click();
          }}
          auto
          color={"secondary"}
        >
          Add source files
        </Button>
      </div>
      <input
        onChange={onUploadFiles}
        style={{ display: "none" }}
        id="fileUpload"
        type="file"
        multiple
        accept=".fc"
        ref={inputRef} />
    </div>
  );
}
