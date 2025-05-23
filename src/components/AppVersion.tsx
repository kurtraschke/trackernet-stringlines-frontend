import { name, version } from "~build/package";
import { github, sha, abbreviatedSha } from "~build/git";
import now from "~build/time";

import { toTemporalInstant } from "temporal-polyfill";
import { Link } from "@tanstack/react-router";
import React from "react";
import { Button } from "@patternfly/react-core";

interface RepositoryLinkProps {
  github: string | null;
  sha: string;
  abbreviatedSha: string;
}

const RepositoryLink: React.FunctionComponent<RepositoryLinkProps> = ({
  github,
  sha,
  abbreviatedSha,
}) => {
  if (github) {
    return (
      <Button
        variant="link"
        isInline
        component={(props) => (
          <Link {...props} to={github + "/commit/" + sha} />
        )}
      >
        {abbreviatedSha}
      </Button>
    );
  } else {
    return abbreviatedSha;
  }
};

const AppVersion: React.FunctionComponent = () => {
  return (
    <p>
      This is {name} {version} (
      <RepositoryLink
        github={github}
        sha={sha}
        abbreviatedSha={abbreviatedSha}
      />
      ), built at{" "}
      {toTemporalInstant
        .call(now)
        .toZonedDateTimeISO("UTC")
        .toLocaleString(undefined, { hour12: false })}
    </p>
  );
};

export default AppVersion;
