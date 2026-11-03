import type { Theme } from "@mui/material/styles";
import WindowedSpectrogramPlugin, {
    type WindowedSpectrogramPluginOptions,
} from "wavesurfer.js/dist/plugins/spectrogram-windowed.js";
import TimelinePlugin, { type TimelinePluginOptions } from "wavesurfer.js/dist/plugins/timeline.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import {
    DECODE_SAMPLE_RATE_HZ,
    FREQUENCY_MIN_HZ,
    PROGRESS_LINE_COLOR,
    PROGRESS_LINE_WIDTH_PX,
    SPECTROGRAM_COLOR_MAP,
    SPECTROGRAM_FFT_SAMPLES,
    TIME_AXIS_HEIGHT_PX,
    TIME_AXIS_INTERVAL_SECONDS,
} from "./audioSpectrogram.consts";
import { forceSpectrogramSegmentRendering, renderEveryTimeLabel } from "../utils/spectrogramActions";
import { formatClockTime } from "../../../../core/components/spectrogram/audioSpectrogramViewer/utils/formatPlaybackTime";

export const DEFAULT_WAVESURFER_OPTIONS = {
    height: 0,
    sampleRate: DECODE_SAMPLE_RATE_HZ,
    interact: false,
    dragToSeek: false,
    autoScroll: true,
    autoCenter: false,
    hideScrollbar: true,
    cursorColor: PROGRESS_LINE_COLOR,
    cursorWidth: PROGRESS_LINE_WIDTH_PX,
    renderFunction: () => {}
};

const createSpectrogramOptions = (containerHeight: number, maxFrequencyHz: number): WindowedSpectrogramPluginOptions => ({
    height: containerHeight,
    frequencyMin: FREQUENCY_MIN_HZ,
    frequencyMax: maxFrequencyHz,
    fftSamples: SPECTROGRAM_FFT_SAMPLES,
    colorMap: SPECTROGRAM_COLOR_MAP,
    scale: 'linear',
    progressiveLoading: false,
    useWebWorker: true,
    labels: false,
});

const createTimelinePluginOptions = (theme: Theme, timelineStartMs: number): TimelinePluginOptions => ({
    height: TIME_AXIS_HEIGHT_PX,
    timeInterval: TIME_AXIS_INTERVAL_SECONDS,
    primaryLabelInterval: TIME_AXIS_INTERVAL_SECONDS,
    formatTimeCallback: (seconds) => formatClockTime(timelineStartMs, seconds),
    style: {
        fontSize: String(theme.typography.body2.fontSize),
        background: theme.palette.background.default,
        color: theme.palette.text.secondary,
    },
});

export const createWaveSurferPlugins = ({
    containerHeight,
    maxFrequencyHz,
    theme,
    timelineStartMs
}: {
    containerHeight: number;
    maxFrequencyHz: number;
    theme: Theme;
    timelineStartMs: number
}) => {
    const spectrogramPlugin = WindowedSpectrogramPlugin.create(
        createSpectrogramOptions(containerHeight, maxFrequencyHz)
    );
    forceSpectrogramSegmentRendering(spectrogramPlugin);

    const timeLinePlugin = TimelinePlugin.create(
        createTimelinePluginOptions(theme, timelineStartMs)
    );
    renderEveryTimeLabel(timeLinePlugin);

    const regionsPlugin = RegionsPlugin.create();

    return {
        spectrogramPlugin,
        regionsPlugin,
        plugins: [spectrogramPlugin, timeLinePlugin, regionsPlugin]
    };
};
