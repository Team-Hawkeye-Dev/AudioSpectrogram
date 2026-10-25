import type { PlaybackPosition } from "../../../../core/components/spectrogram/audioSpectrogramViewer/types";
import type { SpectrogramWindow } from "../../../../store/slices/anchorValidationSectionSlice";
import type { SoundLabel } from "../../../../services/soundData.types";
import { TOP_DEMO_LABELS } from "../../../../services/top/topDemoLabels";
import { BOTTOM_DEMO_LABELS } from "../../../../services/bottom/bottomDemoLabels";

export const VISIBLE_WINDOW_SECONDS = 90;

export const DEFAULT_INITIAL_SCROLL_TIME = 0;

export const DRAG_ZOOM_OUT_FACTOR = 2;
export const CONTAINER_CENTER_RATIO = 0.5;
export const MIN_ZOOM_SELECTION_PX = 50;
export const CLICK_MAX_DRAG_PX = 2;

export const MAX_ZOOM_VISIBLE_SECONDS = 5;
export const MAX_ZOOM_CANVAS_PX = 60000;

export const TIME_AXIS_INTERVAL_SECONDS = 5;
export const TIME_AXIS_HEIGHT_PX = 24;

export const SPECTROGRAM_FFT_SAMPLES = 512;
export const FREQUENCY_MIN_HZ = 0;
export const DECODE_SAMPLE_RATE_HZ = 16000;

export const MAX_HZ_BOTTOM_SPECTROGRAM = 8000;
export const MAX_HZ_TOP_SPECTROGRAM = 4000;
export const TOP_SPECTROGRAM_STEP_HZ = 500;
export const BOTTOM_SPECTROGRAM_STEP_HZ = 1000;

export const SPECTROGRAM_COLOR_MAP = 'roseus';
export const PROGRESS_LINE_COLOR = '#F28918';
export const PROGRESS_LINE_WIDTH_PX = 2;

export const SpectrogramType = {
    TOP: 'top',
    BOTTOM: 'bottom'
} as const;

export const INITIAL_PLAYBACK_POSITION: PlaybackPosition = { currentTime: 0, progressLinePx: 0 };

export type SpectrogramType = (typeof SpectrogramType)[keyof typeof SpectrogramType];

export const SPECTROGRAM_LABELS: Record<SpectrogramType, SoundLabel[]> = {
    [SpectrogramType.TOP]: TOP_DEMO_LABELS,
    [SpectrogramType.BOTTOM]: BOTTOM_DEMO_LABELS
};


const DEFAULT_SPECTROGRAM_WINDOW: SpectrogramWindow = {
    currentStartTime: 0,
    currentEndTime: VISIBLE_WINDOW_SECONDS
};

export const DEFAULT_SPECTROGRAM_WINDOWS: Record<SpectrogramType, SpectrogramWindow> = {
    [SpectrogramType.TOP]: { ...DEFAULT_SPECTROGRAM_WINDOW },
    [SpectrogramType.BOTTOM]: { ...DEFAULT_SPECTROGRAM_WINDOW }
};

export const DEFAULT_SPECTROGRAM_AUDIO_DURATION: Record<SpectrogramType, number> = {
    [SpectrogramType.TOP]: 0,
    [SpectrogramType.BOTTOM]: 0
};

export const DEFAULT_SPECTROGRAM_AUDIO_GUID: Record<SpectrogramType, string | null> = {
    [SpectrogramType.TOP]: null,
    [SpectrogramType.BOTTOM]: null
};


