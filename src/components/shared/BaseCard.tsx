import { Container, Card } from "@nextui-org/react";

// @ts-ignore

export function BaseCard({ children, css = {} }) {
  return (
    <Container css={{ pt: 12, flexGrow: 1 }}>
      <Card
        css={{
          // $$cardColor: "$accent3",
          px: 16,
          ...css
        }}
      >
        <Card.Body>{children}</Card.Body>
      </Card>
    </Container>
  );
}
