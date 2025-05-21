import { Temporal, toTemporalInstant } from "temporal-polyfill";

const TRAFFIC_DAY_END: Temporal.PlainTime = Temporal.PlainTime.from("02:59:59");

export function isCurrentTrafficDay(d: Temporal.PlainDate): boolean {
  return Temporal.PlainDate.compare(d, currentTrafficDay()) === 0;
}

export function currentTrafficDay(): Temporal.PlainDate {
  return toTrafficDay(Temporal.Now.instant());
}

export function toTrafficDay(i: Temporal.Instant): Temporal.PlainDate {
  const local = i.toZonedDateTimeISO("Europe/London");

  const offset =
    Temporal.PlainTime.compare(TRAFFIC_DAY_END, local.toPlainTime()) > 0
      ? -1
      : 0;

  return local.toPlainDate().add({ days: offset });
}

export function dateToPlainDate(date: Date): Temporal.PlainDate {
  return toTemporalInstant
    .call(date)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toPlainDate();
}

export function trafficDayToTimeRange(trafficDay: Temporal.PlainDate) {
  return {
    start: trafficDay.toPlainDateTime(Temporal.PlainTime.from("03:00:00")),
    end: trafficDay
      .add(Temporal.Duration.from({ days: 1 }))
      .toPlainDateTime(Temporal.PlainTime.from("02:59:59")),
  };
}
