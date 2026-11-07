import { createFileRoute } from "@tanstack/react-router";
import ErrorComponent from "../components/ErrorComponent.tsx";
import NotFoundComponent from "../components/NotFoundRouteComponent.tsx";
import { StringlinePage } from "../components/pages/StringlinePage.tsx";

export const Route = createFileRoute("/stringline/$config/$trafficDay")({
  component: StringlinePage,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  staticData: {
    fullPage: true,
  },
});
