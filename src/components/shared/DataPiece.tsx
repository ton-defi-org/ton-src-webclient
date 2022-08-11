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
        {data && !loading && <Text>{data}</Text>}
        {loading && (
          <Row css={{alignItems: 'baseline'}}>
            <Text css={{ opacity: 0 }}>-</Text>
            <Loading type="points-opacity" />
          </Row>
        )}
        {error && <Text color="error">{error}</Text>}
      </Col>
    </Row>
  );
}
