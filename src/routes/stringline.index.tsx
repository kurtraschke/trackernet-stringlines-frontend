import { createFileRoute, redirect } from "@tanstack/react-router";
import { currentTrafficDay } from "../utils.ts";

export const Route = createFileRoute("/stringline/")({
  loader: () => {
    throw redirect({
      to: "/stringline/$config/$trafficDay",
      params: {
        config: "500",
        trafficDay: currentTrafficDay().toString({ calendarName: "never" }),
      },
    });
  },
});
