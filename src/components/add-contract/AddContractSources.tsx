import { Text, Grid } from "@nextui-org/react";
import { useFileState } from "../../store/useFileState";
import { CompilerDetails } from "./CompilerDetails";
import { UploadFilesTable } from "./UploadFilesTable";
import { BaseCard } from "../shared/BaseCard";
import { SubmitContractButton } from "./SubmitContractButton";
import { FileUploadWarnings } from "./FileUploadWarnings";
import { AddFilesButton } from "./AddFilesButton";
import { useDropzone } from "react-dropzone";

export function AddContractSources() {
  const { fileState, addFiles } = useFileState();

  const onDrop = (acceptedFiles: any) => {
    addFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div
      {...getRootProps()}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Grid.Container css={{ mb: 8 }}>
        <Grid css={{ ml: "auto" }}>
          <AddFilesButton />
        </Grid>
      </Grid.Container>
      {!fileState.hasFiles && (
        <Text
          css={{
            ta: "center",
            py: 30,
            my: 30,
            bgColor: "#00000007",
            color: "$accents6",
            br: 12,
          }}
        >
          Drop ".fc" files here
        </Text>
      )}
      {fileState.hasFiles && <UploadFilesTable />}
      {fileState.hasFiles && <FileUploadWarnings />}
      <CompilerDetails />
      <SubmitContractButton />
    </div>
  );
}
