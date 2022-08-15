import { Row, Col, Text, Loading } from "@nextui-org/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function DataPiece({
  label,
  data,
  loading,
  error,
  format,
}: {
  label: string;
  data?: string;
  loading?: boolean;
  error?: string;
  format?: (data: string) => string;
}) {
  return (
    <Row>
      <Col span={2}>
        <Text h5>{label}</Text>
      </Col>
      <Col>
        {data && !loading && <code>{format ? format(data) : data}</code>}
        {loading && <Skeleton width={"35%"} />}
        {error && <Text color="error">{error}</Text>}
      </Col>
    </Row>
  );
}
