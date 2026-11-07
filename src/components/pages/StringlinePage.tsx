import { useNavigate, useParams } from "@tanstack/react-router";
import { useIsFetching } from "@tanstack/react-query";
import { Temporal } from "temporal-polyfill";
import {
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import sizing from "@patternfly/react-styles/css/utilities/Sizing/sizing";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import flex from "@patternfly/react-styles/css/utilities/Flex/flex";
import alignment from "@patternfly/react-styles/css/utilities/Alignment/alignment";
import ConfigurationSelector from "../ConfigurationSelector.tsx";
import TrafficDaySelector from "../TrafficDaySelector.tsx";
import { dataQualityForConfiguration } from "../DataQuality.tsx";
import StringlineDiagram from "../StringlineDiagram.tsx";

export function StringlinePage() {
  const { config, trafficDay } = useParams({ from: "/stringline/$config/$trafficDay", });
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
