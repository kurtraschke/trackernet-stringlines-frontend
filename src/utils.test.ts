import { expect, test } from "vitest";
import { Temporal } from "temporal-polyfill";
import { toTrafficDay, trafficDayToTimeRange } from "./utils.ts";

test("determines current traffic day for local times on or after 03:00:00", () => {
  const input: Temporal.Instant = Temporal.ZonedDateTime.from(
    "2025-05-16 12:00:00[Europe/London]",
  ).toInstant();

  const expected: Temporal.PlainDate = Temporal.PlainDate.from("2025-05-16");

  expect(toTrafficDay(input)).toStrictEqual(expected);
});

test("determines previous traffic day for local times before 03:00:00", () => {
  const input: Temporal.Instant = Temporal.ZonedDateTime.from(
    "2025-05-16 01:30:00[Europe/London]",
  ).toInstant();

  const expected: Temporal.PlainDate = Temporal.PlainDate.from("2025-05-15");

  expect(toTrafficDay(input)).toStrictEqual(expected);
});

test("determines time span of traffic day", () => {
  const input: Temporal.PlainDate = Temporal.PlainDate.from("2025-05-17");

  const expected = {
    start: Temporal.PlainDateTime.from("2025-05-17 03:00:00"),
    end: Temporal.PlainDateTime.from("2025-05-18 02:59:59"),
  };

  expect(trafficDayToTimeRange(input)).toEqual(expected);
});
