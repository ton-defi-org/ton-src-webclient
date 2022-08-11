import { Button } from "@nextui-org/react";
import { useCallback, useRef } from "react";
import { useFileState } from "../../store/useFileState";
import { useDropzone } from "react-dropzone";

export function AddFilesButton() {
  const { addFiles } = useFileState();
  const inputRef = useRef(null);

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onUploadFiles = async (e: any) => {
    // @ts-ignore
    console.log(Array.from(e.target.files).map((f) => f.name));
    await addFiles(Array.from(e.target.files));
  };

  return (
    <div {...getRootProps()}>
      {isDragActive}
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
        {...getInputProps()}
        onChange={onUploadFiles}
        style={{ display: "none" }}
        id="fileUpload"
        type="file"
        multiple
        accept=".fc"
        ref={inputRef}
      />
    </div>
  );
}
