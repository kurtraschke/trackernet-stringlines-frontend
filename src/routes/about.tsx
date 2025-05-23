import { createFileRoute } from "@tanstack/react-router";

import AboutContent from "../components/about.mdx";
import { css } from "@patternfly/react-styles";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className={css(spacing.mx_4xl)}>
      <AboutContent />
    </div>
  );
}
