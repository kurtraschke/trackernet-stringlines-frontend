import { createFileRoute } from "@tanstack/react-router";
import IndexContent from "../components/IndexContent.tsx";

export const Route = createFileRoute("/")({
  component: IndexContent,
});