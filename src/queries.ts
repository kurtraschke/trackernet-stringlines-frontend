// noinspection SqlNoDataSourceInspection,SqlResolve

import { Temporal } from "temporal-polyfill";
import { queryOptions } from "@tanstack/react-query";
import type { WebClickHouseClient } from "@clickhouse/client-web/dist/client";

interface Configuration {
  id: number;
  name: string;
}

export function configurationsQuery(client: WebClickHouseClient) {
  return queryOptions({
    queryKey: ["configurations"],
    queryFn: ({ signal }) =>
      client
        .query({
          query: `SELECT id, name
                  FROM v_web_configurations`,
          format: "JSONEachRow",
          clickhouse_settings: { output_format_json_quote_64bit_integers: 0 },
          abort_signal: signal,
        })
        .then((rs) => rs.json<Configuration>()),
    staleTime: 5 * 60 * 1000,
  });
}

interface StationName {
  station_code: string;
  station_name: string;
}

export function stationNamesQuery(client: WebClickHouseClient) {
  return queryOptions({
    queryKey: ["stationNames"],
    queryFn: ({ signal }) =>
      client
        .query({
          query: `SELECT station_code, station_name
                  FROM v_web_station_names`,
          format: "JSONEachRow",
          abort_signal: signal,
        })
        .then((rs) => rs.json<StationName>()),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

interface ConfigurationDetails {
  id: number;
  name: string;
  station_codes: string[];
}

export function configurationDetailsQuery(
  client: WebClickHouseClient,
  configurationId: number,
) {
  return queryOptions({
    queryKey: ["configurationDetails", configurationId],
    queryFn: ({ signal, queryKey: [, configurationId] }) =>
      client
        .query({
          query: `SELECT id, name, station_codes
                  FROM v_web_configuration_details(p_configuration_id={configuration_id: UInt64})`,
          format: "JSONEachRow",
          clickhouse_settings: { output_format_json_quote_64bit_integers: 0 },
          abort_signal: signal,
          query_params: {
            configuration_id: configurationId,
          },
        })
        .then((rs) => rs.json<ConfigurationDetails>()),
    select: (data) => data[0],
    staleTime: 5 * 60 * 1000,
  });
}

interface StringlineDatum {
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
  client: WebClickHouseClient,
  configurationId: number,
  trafficDay: Temporal.PlainDate,
) {
  return queryOptions({
    queryKey: ["stringline", configurationId, trafficDay],
    queryFn: ({ signal, queryKey: [, configurationId, trafficDay] }) =>
      client
        .query({
          query: `SELECT line_code, set, trip, station_code, destination, 
                         arrival_time, fetch_time, generated_timestamp, location, leading_car_number
                  FROM v_web_stringline(p_traffic_day={traffic_day: Date}, p_configuration_id={configuration_id: UInt64})`,
          format: "JSONEachRow",
          abort_signal: signal,
          query_params: {
            traffic_day: (trafficDay as Temporal.PlainDate).toString({
              calendarName: "never",
            }),
            configuration_id: configurationId,
          },
        })
        .then((rs) => rs.json<StringlineDatum>()),
  });
}

interface DateRange {
  start: Temporal.PlainDate;
  end: Temporal.PlainDate;
}

export function validTrafficDaysQuery(client: WebClickHouseClient) {
  interface Data {
    first_traffic_day: string;
    last_traffic_day: string;
  }

  return queryOptions({
    queryKey: ["validTrafficDays"],
    queryFn: ({ signal }) =>
      client
        .query({
          query: `SELECT first_traffic_day, last_traffic_day
                  FROM v_web_valid_traffic_days`,
          format: "JSONEachRow",
          abort_signal: signal,
        })
        .then((rs) => rs.json<Data>()),
    select: (data): DateRange => {
      const { first_traffic_day, last_traffic_day } = data[0];
      return {
        start: Temporal.PlainDate.from(first_traffic_day),
        end: Temporal.PlainDate.from(last_traffic_day),
      };
    },
  });
}

interface Disclaimer {
  disclaimer: string;
}

export function disclaimerQuery(client: WebClickHouseClient) {
  return queryOptions({
    queryKey: ["disclaimer"],
    queryFn: ({ signal }) =>
      client
        .query({
          query: `SELECT disclaimer
                  FROM v_web_disclaimer`,
          format: "JSONEachRow",
          abort_signal: signal,
        })
        .then((rs) => rs.json<Disclaimer>()),
    select: (rows) => rows[0].disclaimer,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
