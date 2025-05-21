import React, { use } from "react";
import { ClickHouseContext } from "../ClickHouseContext.ts";
import { useQuery } from "@tanstack/react-query";
import { disclaimerQuery } from "../queries.ts";
import {
  Alert,
  CodeBlock,
  CodeBlockCode,
  Content,
  Spinner,
} from "@patternfly/react-core";

const Disclaimer: React.FunctionComponent = () => {
  const client = use(ClickHouseContext);

  const { isPending, isError, data, error } = useQuery(disclaimerQuery(client));

  if (isError) {
    return (
      <Alert
        variant="warning"
        isInline
        isExpandable
        title="Could not load disclaimer"
      >
        An error occurred and it was not possible to load the disclaimer which
        should appear here.
        <br />
        Error details:
        <CodeBlock>
          <CodeBlockCode>{error.message}</CodeBlockCode>
        </CodeBlock>
      </Alert>
    );
  }

  if (isPending) {
    return <Spinner size="lg" />;
  }

  return <Content>{data}</Content>;
};

export default Disclaimer;
