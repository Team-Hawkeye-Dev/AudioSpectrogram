import {
    FREQUENCY_STEP,
    MEASURE_FREQUENCY_DECIMALS,
    MEASURE_SECONDS_PAD_LENGTH,
    MEASURE_TIME_DECIMALS,
    SECONDS_PER_MINUTE,
    TIMESTAMP_SECONDS_PAD_CHAR,
} from "../consts";

export const formatMeasureTime = (seconds: number): string => {
    const roundedSeconds = Number(seconds.toFixed(MEASURE_TIME_DECIMALS));
    const mins = Math.floor(roundedSeconds / SECONDS_PER_MINUTE);
    const secs = (roundedSeconds % SECONDS_PER_MINUTE)
        .toFixed(MEASURE_TIME_DECIMALS)
        .padStart(MEASURE_SECONDS_PAD_LENGTH, TIMESTAMP_SECONDS_PAD_CHAR);
    return `${mins}:${secs}`;
};

export const formatMeasureFrequency = (hz: number): string =>
    `${(hz / FREQUENCY_STEP).toFixed(MEASURE_FREQUENCY_DECIMALS)} kHz`;

export const formatMeasureDuration = (seconds: number): string =>
    `${seconds.toFixed(MEASURE_TIME_DECIMALS)} s`;
