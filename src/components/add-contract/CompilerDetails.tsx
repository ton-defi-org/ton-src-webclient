import { Row, Col } from "@nextui-org/react";
import {
  Container,
  Card,
  Text,
  Dropdown,
  Grid,
  Input,
} from "@nextui-org/react";
import { compilerDetailsRecoil, useRecoilStateMerger } from "../../store/store";

export function CompilerDetails() {
  const [compilerDetails, setCompilerDetails] = useRecoilStateMerger(
    compilerDetailsRecoil
  );
  return (
    <Col>
      <Row>
        <Text css={{ mb: 12 }} h4>
          Compiler
        </Text>
      </Row>
      <Row>
        <Grid.Container>
          <Grid xs={1.3} css={{ mr: 12 }}>
            <Input
              readOnly
              bordered
              animated={false}
              labelLeft="Compiler"
              aria-label="Compiler"
              css={{ cursor: "pointer" }}
              value={compilerDetails.compiler}
            />
          </Grid>
          <Grid xs={1.8}>
            <Dropdown>
              <Dropdown.Button
                css={{
                  // bgColor: "$secondary",
                  // color: "$white",
                  borderColor: "$accents3",
                  boxSizing: "content-box",
                  // py: 2
                }}
                color="secondary"
                bordered
              >
                {compilerDetails.version}
              </Dropdown.Button>
              <Dropdown.Menu
                disallowEmptySelection
                selectionMode="single"
                // @ts-ignore
                onAction={(k) => setCompilerDetails({ version: k })}
              >
                <Dropdown.Item key="0.0.9">0.0.9</Dropdown.Item>
                <Dropdown.Item key="0.1.0">0.1.0</Dropdown.Item>
                <Dropdown.Item key="0.2.0">0.2.0</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Grid>
          <Grid xs>
            <Input
              animated={false}
              shadow={false}
              fullWidth
              bordered
              status="secondary"
              placeholder="func command"
              aria-label="func command"
            />
          </Grid>
        </Grid.Container>
      </Row>
    </Col>
  );
}
