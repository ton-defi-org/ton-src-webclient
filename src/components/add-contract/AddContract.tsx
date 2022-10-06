import { Text, Button, Grid } from "@nextui-org/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { compileRecoil } from "../../store/store";
import { CompileStatus } from "./CompileStatus";
import { BaseCard } from "../shared/BaseCard";
import { AddContractSources } from "./AddContractSources";
import { Steps } from "primereact/steps";

export function AddContract() {
  const [editMode, setEditMode] = useState(false);
  const compileState = useRecoilValue(compileRecoil);
  const items = [
    { label: "Upload sources" },
    { label: "Store onchain verification proof" },
    { label: "Complete verification" },
  ];
  return (
    <>
      <BaseCard>
        <Steps model={items} activeIndex={0} />
        {editMode && (
          <div>
            <Grid.Container direction="column">
              <Grid>
                <AddContractSources />
              </Grid>
              <Grid>
                {(compileState.compileResult?.error ||
                  compileState.compileResult?.result ||
                  compileState.isLoading) && <CompileStatus />}
              </Grid>
            </Grid.Container>
          </div>
        )}
        {!editMode && (
          <BaseCard>
            <Text css={{ mb: 24 }}>No sources for this contract</Text>
            <div>
              <Button auto color="secondary" onClick={() => setEditMode(true)}>
                Add sources
              </Button>
            </div>
          </BaseCard>
        )}
      </BaseCard>
    </>
  );
}
