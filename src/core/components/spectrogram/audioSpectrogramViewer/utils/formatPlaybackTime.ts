import { CLOCK_TIME_LOCALE, MS_PER_SECOND, SECONDS_PER_MINUTE, TIMESTAMP_SECONDS_PAD_CHAR, TIMESTAMP_SECONDS_PAD_LENGTH } from "../consts";

export const timeFormat = (seconds: number): string => {
    const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = Math.floor(seconds % SECONDS_PER_MINUTE);
    return `${mins}:${secs.toString().padStart(TIMESTAMP_SECONDS_PAD_LENGTH, TIMESTAMP_SECONDS_PAD_CHAR)}`;
};

const clockTimeFormat = new Intl.DateTimeFormat(CLOCK_TIME_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
});

export const formatClockTime = (startTimeMs: number, seconds: number): string =>
    clockTimeFormat.format(startTimeMs + seconds * MS_PER_SECOND);
