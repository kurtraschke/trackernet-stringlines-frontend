import { css } from "@patternfly/react-styles";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import HowToContent from "../howto.mdx";

export function HowToPage() {
  return (
    <div className={css(spacing.mx_4xl)}>
      <HowToContent />
    </div>
  );
}
