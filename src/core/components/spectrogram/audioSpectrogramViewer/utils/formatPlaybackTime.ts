import { SECONDS_PER_MINUTE, TIMESTAMP_SECONDS_PAD_CHAR, TIMESTAMP_SECONDS_PAD_LENGTH } from "../consts";

export const timeFormat = (seconds: number): string => {
    const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = Math.floor(seconds % SECONDS_PER_MINUTE);
    return `${mins}:${secs.toString().padStart(TIMESTAMP_SECONDS_PAD_LENGTH, TIMESTAMP_SECONDS_PAD_CHAR)}`;
};
