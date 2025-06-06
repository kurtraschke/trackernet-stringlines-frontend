import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import TrafficDaySelector from "../components/TrafficDaySelector.tsx";
import ConfigurationSelector from "../components/ConfigurationSelector.tsx";
import { Temporal } from "temporal-polyfill";
import StringlineDiagram from "../components/StringlineDiagram.tsx";
import ErrorComponent from "../components/ErrorComponent.tsx";
import NotFoundComponent from "../components/NotFoundRouteComponent.tsx";
import { dataQualityForConfiguration } from "../components/DataQuality.tsx";
import { useIsFetching } from "@tanstack/react-query";
import { css } from "@patternfly/react-styles";
import sizing from "@patternfly/react-styles/css/utilities/Sizing/sizing";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import alignment from "@patternfly/react-styles/css/utilities/Alignment/alignment";
import flex from "@patternfly/react-styles/css/utilities/Flex/flex";

export const Route = createFileRoute("/stringline/$config/$trafficDay")({
  component: RouteComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  staticData: {
    fullPage: true
  }
});

function RouteComponent() {
  const { config, trafficDay } = Route.useParams();
  const navigate = useNavigate({ from: "/stringline/$config/$trafficDay" });
  const isFetching = useIsFetching();

  const setSelectedConfiguration = (selectedConfiguration: string) => {
    void navigate({
      to: "/stringline/$config/$trafficDay",
      params: {
        config: selectedConfiguration,
        trafficDay: trafficDay,
      },
    });
  };

  const setSelectedTrafficDay = (selectedTrafficDay: Temporal.PlainDate) => {
    void navigate({
      to: "/stringline/$config/$trafficDay",
      params: {
        config: config,
        trafficDay: selectedTrafficDay.toString({ calendarName: "never" }),
      },
    });
  };

  return (
    <Stack className={css(sizing.h_100)}>
      <StackItem>
        <Split hasGutter className={css(spacing.mbSm)}>
          <SplitItem>
            <ConfigurationSelector
              selectedConfiguration={config}
              onChangeConfiguration={setSelectedConfiguration}
            />
          </SplitItem>
          <SplitItem>
            <TrafficDaySelector
              selectedTrafficDay={Temporal.PlainDate.from(trafficDay)}
              setSelectedTrafficDay={setSelectedTrafficDay}
            />
          </SplitItem>
          <SplitItem className={css(flex.alignSelfFlexEnd)}>
            {dataQualityForConfiguration(config)}
          </SplitItem>
          <SplitItem
            isFilled
            className={css(flex.alignSelfFlexEnd, alignment.textAlignEnd)}
          >
            {isFetching ? <Spinner size="md" /> : null}
          </SplitItem>
        </Split>
      </StackItem>
      <StackItem isFilled>
        <StringlineDiagram
          configurationId={Number.parseInt(config)}
          trafficDay={Temporal.PlainDate.from(trafficDay)}
        />
      </StackItem>
    </Stack>
  );
}
