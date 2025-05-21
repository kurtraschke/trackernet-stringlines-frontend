import { createFileRoute } from "@tanstack/react-router";
import { Bullseye, Title, TitleSizes } from "@patternfly/react-core";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Bullseye>
      <Title headingLevel="h1" size={TitleSizes["4xl"]}>
        Trackernet Stringlines
      </Title>
    </Bullseye>
  );
}
