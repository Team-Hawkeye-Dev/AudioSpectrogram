export const VISIBLE_WINDOW_SECONDS = 90;
export const ZOOM_DEBOUNCE_MS = 150;

export const SECONDS_PER_MINUTE = 60;
export const TIMESTAMP_SECONDS_PAD_LENGTH = 2;
export const TIMESTAMP_SECONDS_PAD_CHAR = '0';

export const DRAG_ZOOM_OUT_FACTOR = 2;
export const CONTAINER_CENTER_RATIO = 0.5;

export const TIME_AXIS_INTERVAL_SECONDS = 5;
export const TIME_AXIS_HEIGHT_PX = 24;

export const SPECTROGRAM_FFT_SAMPLES = 512;
export const FREQUENCY_MIN_HZ = 0;
export const DECODE_SAMPLE_RATE_HZ = 16000;
export const FREQUENCY_STEP = 1000;

export const SpectrogramType = {
    TOP: 'top',
    BOTTOM: 'bottom'
} as const;

export type SpectrogramType = (typeof SpectrogramType)[keyof typeof SpectrogramType];

export const SPECTROGRAM_FREQUENCY_CONFIG = {
    [SpectrogramType.TOP]: {
        maxHz: 8000,
        stepHz: FREQUENCY_STEP
    },
    [SpectrogramType.BOTTOM]: {
        maxHz: 4000,
        stepHz: 500
    }
}
