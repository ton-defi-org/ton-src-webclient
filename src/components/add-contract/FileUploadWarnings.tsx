import { Col, Text, Row, Container, Grid } from "@nextui-org/react";
import { useFileState } from "../../store/useFileState";

export function FileUploadWarnings() {
  const { fileState } = useFileState();
  return (
    <Grid.Container direction="column" css={{ rowGap: 8, mb: 36 }}>
      {fileState.warnings.map((w) => (
        <Grid
          key={w}
          css={{
            alignItems: "baseline",
            bgColor: "$warningLight",
            py: 12,
            pl: 12,
            br: 12,
          }}
        >
          <Text>{w}</Text>
        </Grid>
      ))}
    </Grid.Container>
  );
}
