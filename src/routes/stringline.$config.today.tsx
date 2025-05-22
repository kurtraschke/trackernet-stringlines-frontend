import { createFileRoute, redirect } from "@tanstack/react-router";
import { currentTrafficDay } from "../utils.ts";

export const Route = createFileRoute("/stringline/$config/today")({
  loader: ({ params: { config } }) => {
    throw redirect({
      to: "/stringline/$config/$trafficDay",
      params: {
        config: config,
        trafficDay: currentTrafficDay().toString({ calendarName: "never" }),
      },
    });
  },
});
