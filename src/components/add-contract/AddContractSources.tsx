import { Text, Grid } from "@nextui-org/react";
import { useFileState } from "../../store/useFileState";
import { CompilerDetails } from "./CompilerDetails";
import { UploadFilesTable } from "./UploadFilesTable";
import { BaseCard } from "../shared/BaseCard";
import { SubmitContractButton } from "./SubmitContractButton";
import { FileUploadWarnings } from "./FileUploadWarnings";
import { AddFilesButton } from "./AddFilesButton";

export function AddContractSources() {
  const { fileState } = useFileState();

  return (
    <BaseCard>
      <Grid.Container css={{ mb: 8 }}>
        <Grid>
          <Text css={{ mb: 12 }} h4>
            Add sources
          </Text>
        </Grid>
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
          Start by adding source files
        </Text>
      )}
      {fileState.hasFiles && <UploadFilesTable />}
      {fileState.hasFiles && <FileUploadWarnings />}
      <CompilerDetails />
      <SubmitContractButton />
    </BaseCard>
  );
}
