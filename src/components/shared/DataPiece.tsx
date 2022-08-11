import { Row, Col, Text, Loading } from "@nextui-org/react";

export function DataPiece({
  label,
  data,
  loading,
  error,
}: {
  label: string;
  data?: string;
  loading?: boolean;
  error?: string;
}) {
  return (
    <Row>
      <Col span={2}>
        <Text h5>{label}</Text>
      </Col>
      <Col>
        {data && !loading && <code>{data}</code>}
        {loading && (
          <Row css={{ alignItems: "baseline" }}>
            <code style={{ opacity: 0 }}>-</code>
            <Loading type="points-opacity" />
          </Row>
        )}
        {error && <Text color="error">{error}</Text>}
      </Col>
    </Row>
  );
}
