import { createRootRoute } from "@tanstack/react-router";

import "@patternfly/react-core/dist/styles/base.css";
import "../app.css";
import { RootComponent } from "../components/pages/RootComponent.tsx";

export const Route = createRootRoute({
  component: RootComponent,
});
