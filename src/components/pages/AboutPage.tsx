import { css } from "@patternfly/react-styles";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import AboutContent from "../about.mdx";

export function AboutPage() {
  return (
    <div className={css(spacing.mx_4xl)}>
      <AboutContent />
    </div>
  );
}
