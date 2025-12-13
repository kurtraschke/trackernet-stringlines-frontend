import { Temporal } from "temporal-polyfill";
import { queryOptions } from "@tanstack/react-query";

interface Configuration {
  id: number;
  name: string;
}

const configurationsQueryStaleTime = Temporal.Duration.from("PT5M").total({
  unit: "milliseconds",
});

export function configurationsQuery() {
  return queryOptions({
    queryKey: ["configurations"],
    queryFn: async ({ signal }) => {
      const endpoint = new URL(
        "trackernet_stringline_configurations",
        import.meta.env.VITE_API_BASE_URL,
      );

      const response = await fetch(endpoint, { signal });

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      return (await response.json()) as Configuration[];
    },
    staleTime: configurationsQueryStaleTime,
  });
}

export interface StationName {
  station_code: string;
  station_name: string;
}

const stationNamesQueryStaleTime = Temporal.Duration.from("PT24H").total({
  unit: "milliseconds",
});

export function stationNamesQuery() {
  return queryOptions({
    queryKey: ["stationNames"],
    queryFn: async ({ signal }) => {
      const endpoint = new URL(
        "trackernet_station_names",
        import.meta.env.VITE_API_BASE_URL,
      );

      const response = await fetch(endpoint, { signal });

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      return (await response.json()) as StationName[];
    },
    staleTime: stationNamesQueryStaleTime,
  });
}

export interface ConfigurationDetails {
  id: number;
  name: string;
  direction: number;
  station_codes: string[];
}

const configurationDetailsQueryStaleTime = Temporal.Duration.from("PT5M").total(
  { unit: "milliseconds" },
);

export function configurationDetailsQuery(configurationId: number) {
  return queryOptions({
    queryKey: ["configurationDetails", configurationId],
    queryFn: async ({ signal, queryKey: [, configurationId] }) => {
      const endpoint = new URL(
        "trackernet_stringline_configuration_details",
        import.meta.env.VITE_API_BASE_URL,
      );

      endpoint.searchParams.set("configuration_id", configurationId.toString());

      const response = await fetch(endpoint, { signal });

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      return (await response.json()) as ConfigurationDetails[];
    },
    select: (data) => data[0],
    staleTime: configurationDetailsQueryStaleTime,
  });
}

export interface StringlineDatum {
  line_code: string;
  set: string;
  trip: string;
  destination: string;
  arrival_time: string;
  fetch_time: string;
  generated_timestamp: string;
  location: string;
  leading_car_number: string;
}

export function stringlineQuery(
  configurationId: number,
  trafficDay: Temporal.PlainDate,
) {
  return queryOptions({
    queryKey: ["stringline", configurationId, trafficDay],
    queryFn: async ({ signal, queryKey: [, configurationId, trafficDay] }) => {
      const endpoint = new URL(
        "trackernet_stringlines",
        import.meta.env.VITE_API_BASE_URL,
      );

      endpoint.searchParams.set("configuration_id", configurationId.toString());
      endpoint.searchParams.set(
        "traffic_day",
        (trafficDay as Temporal.PlainDate).toString({
          calendarName: "never",
        }),
      );

      const response = await fetch(endpoint, { signal });

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      return (await response.json()) as StringlineDatum[];
      },
  });
}

interface DateRange {
  start: Temporal.PlainDate;
  end: Temporal.PlainDate;
}

const validTrafficDaysQueryStaleTime = Temporal.Duration.from("PT1M").total({
  unit: "milliseconds",
});

export function validTrafficDaysQuery() {
  interface Data {
    first_traffic_day: string;
    last_traffic_day: string;
  }

  return queryOptions({
    queryKey: ["validTrafficDays"],
    queryFn: async ({ signal }) => {
      const endpoint = new URL(
        "trackernet_valid_traffic_days",
        import.meta.env.VITE_API_BASE_URL,
      );

      const response = await fetch(endpoint, { signal });

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      return (await response.json()) as Data[];
    },
    select: (data): DateRange => {
      const { first_traffic_day, last_traffic_day } = data[0];
      return {
        start: Temporal.PlainDate.from(first_traffic_day),
        end: Temporal.PlainDate.from(last_traffic_day),
      };
    },
    staleTime: validTrafficDaysQueryStaleTime,
  });
}

const disclaimerQueryStaleTime = Temporal.Duration.from("PT24H").total({
  unit: "milliseconds",
});

export function disclaimerQuery() {
  return queryOptions({
    queryKey: ["disclaimer"],
    queryFn: async ({ signal }) => {
      const endpoint = new URL(
        "trackernet_disclaimer",
        import.meta.env.VITE_API_BASE_URL,
      );

      const response = await fetch(endpoint, { signal });

      if (!response.ok) {
        throw new Error("Backend request failed.");
      }

      return await response.text();
    },
    staleTime: disclaimerQueryStaleTime,
  });
}
