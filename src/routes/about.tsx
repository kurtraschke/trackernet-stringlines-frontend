import { createFileRoute } from "@tanstack/react-router";

import AboutContent from "../components/about.mdx";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className={"pf-v6-u-mx-4xl"}>
      <AboutContent />
    </div>
  );
}
