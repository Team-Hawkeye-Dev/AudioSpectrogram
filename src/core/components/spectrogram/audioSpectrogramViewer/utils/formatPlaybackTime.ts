import { MS_PER_SECOND, SECONDS_PER_MINUTE, TIMESTAMP_SECONDS_PAD_CHAR, TIMESTAMP_SECONDS_PAD_LENGTH } from "../consts";

export const timeFormat = (seconds: number): string => {
    const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = Math.floor(seconds % SECONDS_PER_MINUTE);
    return `${mins}:${secs.toString().padStart(TIMESTAMP_SECONDS_PAD_LENGTH, TIMESTAMP_SECONDS_PAD_CHAR)}`;
};

export const formatClockTime = (startTimeMs: number, seconds: number): string => {
    const clockTimeMs = startTimeMs + seconds * MS_PER_SECOND;
    return new Date(clockTimeMs).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    });
};
