import { VegaLite } from "react-vega";
import { useQuery } from "@tanstack/react-query";
import React, { use } from "react";
import { ClickHouseContext } from "../ClickHouseContext.ts";
import { Temporal } from "temporal-polyfill";
import lines from "./lines.csv";
import type { TopLevelSpec } from "vega-lite";
import {
  stationNamesQuery,
  stringlineQuery,
  configurationDetailsQuery,
} from "../queries.ts";
import { EmptyState, Spinner } from "@patternfly/react-core";
import { isCurrentTrafficDay, trafficDayToTimeRange } from "../utils.ts";
import { notFound } from "@tanstack/react-router";
import { css } from "@patternfly/react-styles";
import sizing from "@patternfly/react-styles/css/utilities/Sizing/sizing";

const currentTrafficDayStaleTime = Temporal.Duration.from("PT1M").total({
  unit: "millisecond",
});

const currentTrafficDayRefreshInterval = Temporal.Duration.from("PT1M").total({
  unit: "millisecond",
});

interface StringlineDiagramParams {
  configurationId: number;
  trafficDay: Temporal.PlainDate;
}

const StringlineDiagram: React.FunctionComponent<StringlineDiagramParams> = ({
  configurationId,
  trafficDay,
}) => {
  const client = use(ClickHouseContext);

  const {
    isPending: stnIsPending,
    isError: stnIsError,
    data: stnData,
    error: stnError,
  } = useQuery(stationNamesQuery(client));

  if (stnIsError) {
    throw new Error("Error loading station names", { cause: stnError });
  }

  const {
    isPending: cdIsPending,
    isError: cdIsError,
    data: cdData,
    error: cdError,
  } = useQuery(configurationDetailsQuery(client, configurationId));

  if (cdIsError) {
    throw new Error("Error loading configuration details", { cause: cdError });
  }

  const staleTime = isCurrentTrafficDay(trafficDay) ? currentTrafficDayStaleTime : Infinity;
  const refreshInterval = isCurrentTrafficDay(trafficDay) ? currentTrafficDayRefreshInterval : false;

  const {
    isPending: stlIsPending,
    isError: stlIsError,
    data: stlData,
    error: stlError,
  } = useQuery({
    ...stringlineQuery(client, configurationId, trafficDay),
    staleTime: staleTime,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: false,
  });

  if (stlIsError) {
    throw new Error("Error loading stringline data", { cause: stlError });
  }

  if ([stnIsPending, cdIsPending, stlIsPending].some((element) => element)) {
    return <EmptyState titleText="Loading" headingLevel="h4" icon={Spinner} />;
  }

  if (cdData === undefined) {
    throw notFound({ routeId: "/stringline/$config/$trafficDay" });
  }

  const { start: trafficDayStart, end: trafficDayEnd } =
    trafficDayToTimeRange(trafficDay);

  const sortDataset = cdData.station_codes.map((value, index) => ({
    station_code: value,
    sort_order: index,
  }));

  const sortDirection = cdData.direction ? "ascending" : "descending";

  const spec: TopLevelSpec = {
    title: `${cdData.name} on ${trafficDay.toString({ calendarName: "never" })}`,
    width: "container",
    height: "container",
    data: { name: "table" },
    config: { font: "Red Hat Text" },
    transform: [
      {
        calculate: "datum.line_code + '/' + datum.set + '/' + datum.trip",
        as: "train_id",
      },
      {
        calculate: "datum.location == 'At Platform'",
        as: "is_at_platform",
      },
      {
        lookup: "station_code",
        from: {
          data: { name: "stationNames" },
          key: "station_code",
          fields: ["station_name"],
        },
      },
      {
        lookup: "station_code",
        from: {
          data: { name: "stationSort" },
          key: "station_code",
          fields: ["sort_order"],
        },
      },
      {
        lookup: "line_code",
        from: {
          data: { name: "lines" },
          key: "line_code",
          fields: ["line_name"],
        },
      },
    ],
    mark: {
      type: "line",
      point: true,
    },
    params: [
      {
        name: "grid",
        select: "interval",
        bind: "scales",
      },
      {
        name: "hover_train_id",
        select: {
          type: "point",
          fields: ["train_id"],
          on: "pointerover",
        },
      },
      {
        name: "hover_set",
        select: {
          type: "point",
          fields: ["set"],
          on: "pointerover",
        },
      },
    ],
    encoding: {
      x: {
        field: "arrival_time",
        type: "temporal",
        axis: { format: "%H:%M" },
        scale: {
          domain: [trafficDayStart.toString(), trafficDayEnd.toString()],
        },
        title: "Arrival Time",
      },
      y: {
        field: "station_code",
        type: "nominal",
        sort: { field: "sort_order", order: sortDirection },
        title: "Station",
        axis: {
          labelExpr:
            'data("stationNames")[indexof(pluck(data("stationNames"), "station_code"), datum.value)]["station_name"]',
          grid: true
        },
      },
      detail: {
        field: "train_id",
        type: "nominal",
      },
      shape: {
        field: "is_at_platform",
        type: "nominal",
        title: "Observation Type",
        legend: { labelExpr: "datum.value ? 'Actual': 'Predicted'" },
      },
      opacity: {
        condition: {
          param: "hover_set",
          value: 1,
        },
        value: 0.2,
      },
      strokeWidth: {
        condition: {
          param: "hover_train_id",
          value: 2,
          empty: true,
        },
      },
      color: {
        field: "line_name",
        type: "nominal",
        title: "Line",
        scale: {
          domain: lines.map(({ line_name }) => line_name),
          range: lines.map(({ line_color }) => line_color),
        },
      },
      tooltip: [
        { field: "line_name", type: "nominal", title: "Line" },
        { field: "set", type: "nominal", title: "Set" },
        { field: "trip", type: "nominal", title: "Trip" },
        { field: "station_code", type: "nominal", title: "Station Code" },
        { field: "station_name", type: "nominal", title: "Station Name" },
        {
          field: "arrival_time",
          type: "temporal",
          title: "Arrival Time",
          format: "%H:%M:%S",
        },
        { field: "destination", type: "nominal", title: "Destination" },
        { field: "location", type: "nominal", title: "Location" },
        {
          field: "leading_car_number",
          type: "nominal",
          title: "Leading Car Number",
        },
      ],
    },
  };

  return (
    <VegaLite
      spec={spec}
      scaleFactor={2}
      className={css(sizing.w_100, sizing.h_100)}
      data={{
        stationNames: stnData,
        lines,
        table: stlData,
        stationSort: sortDataset,
      }}
    />
  );
};

export default StringlineDiagram;
