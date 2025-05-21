import { createFileRoute, redirect } from "@tanstack/react-router";
import { currentTrafficDay } from "../utils.ts";
import { Temporal } from "temporal-polyfill";

export const Route = createFileRoute("/stringline/$config/yesterday")({
  loader: ({ params: { config } }) => {
    redirect({
      throw: true,
      to: "/stringline/$config/$trafficDay",
      params: {
        config: config,
        trafficDay: currentTrafficDay()
          .add(Temporal.Duration.from({ days: -1 }))
          .toString({ calendarName: "never" }),
      },
    });
  },
});
