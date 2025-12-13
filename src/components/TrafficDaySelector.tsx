import { DatePicker, FormGroup, Spinner } from "@patternfly/react-core";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Temporal } from "temporal-polyfill";
import { dateToPlainDate } from "../utils.ts";
import { validTrafficDaysQuery } from "../queries.ts";

interface TrafficDaySelectorParams {
  selectedTrafficDay: Temporal.PlainDate;
  setSelectedTrafficDay: (v: Temporal.PlainDate) => void;
}

const TrafficDaySelector: React.FunctionComponent<TrafficDaySelectorParams> = ({
  selectedTrafficDay,
  setSelectedTrafficDay,
}) => {
  const { isPending, isError, data, error } = useQuery(validTrafficDaysQuery());

  if (isPending) {
    return <Spinner size="md" />;
  }

  if (isError) {
    throw new Error("Error loading valid traffic days", { cause: error });
  }

  const rangeValidator = (date: Date) => {
    const d = dateToPlainDate(date);

    if (Temporal.PlainDate.compare(d, data.start) < 0) {
      return "Date is before the allowable range.";
    } else if (Temporal.PlainDate.compare(d, data.end) > 0) {
      return "Date is after the allowable range.";
    }

    return "";
  };

  return (
    <FormGroup label={"Traffic day"} isRequired fieldId={"traffic-day"}>
      <DatePicker
        aria-label="Traffic day"
        placeholder="YYYY-MM-DD"
        value={selectedTrafficDay.toString({ calendarName: "never" })}
        onChange={(_event, _value, date) => {
          if (date) {
            setSelectedTrafficDay(dateToPlainDate(date));
          }
        }}
        validators={[rangeValidator]}
        required
        inputProps={{ id: "traffic-day" }}
      />
    </FormGroup>
  );
};

export default TrafficDaySelector;
