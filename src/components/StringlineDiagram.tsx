import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Temporal } from "temporal-polyfill";
import lines from "./lines.csv";
import type { TopLevelSpec } from "vega-lite";
import {
  stationNamesQuery,
  stringlineQuery,
  configurationDetailsQuery,
  type StationName,
  type StringlineDatum,
  type ConfigurationDetails,
} from "../queries.ts";
import { EmptyState, Spinner } from "@patternfly/react-core";
import { isCurrentTrafficDay, trafficDayToTimeRange } from "../utils.ts";
import { notFound } from "@tanstack/react-router";
import { css } from "@patternfly/react-styles";
import sizing from "@patternfly/react-styles/css/utilities/Sizing/sizing";
import { useVegaEmbed } from "react-vega";
import type { EmbedOptions } from "vega-embed";

interface Line {
  line_code: string;
  line_name: string;
  line_color: string;
}

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
  const {
    isPending: stnIsPending,
    isError: stnIsError,
    data: stnData,
    error: stnError,
  } = useQuery(stationNamesQuery());

  if (stnIsError) {
    throw new Error("Error loading station names", { cause: stnError });
  }

  const {
    isPending: cdIsPending,
    isError: cdIsError,
    data: cdData,
    error: cdError,
  } = useQuery(configurationDetailsQuery(configurationId));

  if (cdIsError) {
    throw new Error("Error loading configuration details", { cause: cdError });
  }

  const staleTime = isCurrentTrafficDay(trafficDay)
    ? currentTrafficDayStaleTime
    : Infinity;
  const refreshInterval = isCurrentTrafficDay(trafficDay)
    ? currentTrafficDayRefreshInterval
    : false;

  const {
    isPending: stlIsPending,
    isError: stlIsError,
    data: stlData,
    error: stlError,
  } = useQuery({
    ...stringlineQuery(configurationId, trafficDay),
    staleTime: staleTime,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: false,
  });

  if (stlIsError) {
    throw new Error("Error loading stringline data", { cause: stlError });
  }

  if ([stnIsPending, cdIsPending, stlIsPending].some((element) => element)) {
    return <EmptyState titleText="Loading" headingLevel="h4" icon={Spinner} />;
  } else {
    if (cdData === undefined) {
      throw notFound({ routeId: "/stringline/$config/$trafficDay" });
    } else if (stnData != undefined && stlData != undefined) {
      return (
        <RenderStringline
          trafficDay={trafficDay}
          configurationDetails={cdData}
          stationNames={stnData}
          lines={lines}
          stringlineData={stlData}
        />
      );
    } else {
      throw new Error("Unknown error.");
    }
  }
};

interface RenderStringlineParams {
  trafficDay: Temporal.PlainDate;
  configurationDetails: ConfigurationDetails;
  stationNames: StationName[];
  lines: Line[];
  stringlineData: StringlineDatum[];
}

const RenderStringline: React.FunctionComponent<RenderStringlineParams> = ({
  trafficDay,
  configurationDetails,
  stationNames,
  lines,
  stringlineData,
}) => {
  const { start: trafficDayStart, end: trafficDayEnd } =
    trafficDayToTimeRange(trafficDay);

  const stationSort = configurationDetails.station_codes.map(
    (value, index) => ({
      station_code: value,
      sort_order: index,
    }),
  );

  const sortDirection = configurationDetails.direction
    ? "ascending"
    : "descending";

  const spec: TopLevelSpec = {
    title: `${configurationDetails.name} on ${trafficDay.toString({ calendarName: "never" })}`,
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
          grid: true,
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

  const ref = React.useRef<HTMLDivElement>(null);

  const options: EmbedOptions = {
    mode: "vega-lite",
    scaleFactor: 2,
  };

  const embed = useVegaEmbed({ ref, spec, options });

  embed?.view
    .data("table", stringlineData)
    .data("stationNames", stationNames)
    .data("lines", lines)
    .data("stationSort", stationSort);

  useEffect(() => {
    void embed?.view.data("table", stringlineData).resize().runAsync();
  }, [embed, stringlineData]);

  useEffect(() => {
    void embed?.view.data("stationNames", stationNames).resize().runAsync();
  }, [embed, stationNames]);

  useEffect(() => {
    void embed?.view.data("lines", lines).resize().runAsync();
  }, [embed, lines]);

  useEffect(() => {
    void embed?.view.data("stationSort", stationSort).resize().runAsync();
  }, [embed, stationSort]);

  return <div className={css(sizing.w_100, sizing.h_100)} ref={ref} />;
};

export default StringlineDiagram;
