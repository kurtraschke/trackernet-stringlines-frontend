import { createFileRoute } from '@tanstack/react-router'
import HowToContent from '../components/howto.mdx'
import { css } from "@patternfly/react-styles";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

export const Route = createFileRoute('/howto')({
  component: HowTo,
})

function HowTo() {
  return (
    <div className={css(spacing.mx_4xl)}>
      <HowToContent />
    </div>
  )
}
