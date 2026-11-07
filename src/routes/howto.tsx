import { createFileRoute } from "@tanstack/react-router";
import { HowToPage } from "../components/pages/HowToPage.tsx";

export const Route = createFileRoute("/howto")({
  component: HowToPage,
});
