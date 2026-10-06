import type { StateCreator } from 'zustand';
import { SpectrogramType, VISIBLE_WINDOW_SECONDS } from '../../components/expandModal/audioSpectrogram/consts/audioSpectrogram.consts';
import { updateSlice } from '../storeSlices';
import { StoreSlices, type MassiviAppState } from '../useStore';

type TopSpectrogramSliceDto = {
    topGuid: string;
    startSliceTime: number
    endSliceTime: number
}

type BottomSpectrogramSliceDto = {
    bottomGuid: string;
    startSliceTime: number
    endSliceTime: number
}

export type SpectrogramWindow = {
    currentStartTime: number;
    currentEndTime: number;
};

const DEFAULT_SPECTROGRAM_WINDOW: SpectrogramWindow = {
    currentStartTime: 0,
    currentEndTime: VISIBLE_WINDOW_SECONDS
};

const DEFAULT_SPECTROGRAM_WINDOWS: Record<SpectrogramType, SpectrogramWindow> = {
    [SpectrogramType.TOP]: { ...DEFAULT_SPECTROGRAM_WINDOW },
    [SpectrogramType.BOTTOM]: { ...DEFAULT_SPECTROGRAM_WINDOW }
};

const DEFAULT_SPECTROGRAM_AUDIO_DURATION: Record<SpectrogramType, number> = {
    [SpectrogramType.TOP]: 0,
    [SpectrogramType.BOTTOM]: 0
};

export type ExpandSectionSlice = {
    isExpandPolygonModalOpen: boolean;
    setIsExpandModalOpen: (open: boolean) => void;
    topMetadata: TopSpectrogramSliceDto | null;
    setTopMetadata: (data: TopSpectrogramSliceDto | null) => void;
    bottomMetadata: BottomSpectrogramSliceDto | null;
    setBottomMetadata: (data: BottomSpectrogramSliceDto | null) => void;
    spectrogramWindows: Record<SpectrogramType, SpectrogramWindow>;
    setSpectrogramWindow: (
        spectrogramPlotType: SpectrogramType,
        spectrogramWindow: SpectrogramWindow
    ) => void;
    spectrogramAudioDuration: Record<SpectrogramType, number>;
    setSpectrogramAudioDuration: (spectrogramPlotType: SpectrogramType, audioDuration: number) => void;
};

export const expandSectionSlice: StateCreator<MassiviAppState, [], [], ExpandSectionSlice> = (set) => ({
    isExpandPolygonModalOpen: false,
    setIsExpandModalOpen: (open) =>
        set(
            updateSlice(StoreSlices.EXPAND_SECTION, {
                isExpandPolygonModalOpen: open
            })
        ),

    topMetadata: null,
    setTopMetadata: (topMetadata) =>
        set(
            updateSlice(StoreSlices.EXPAND_SECTION, {
                topMetadata
            })
        ),

    bottomMetadata: null,
    setBottomMetadata: (bottomMetadata) =>
        set(
            updateSlice(StoreSlices.EXPAND_SECTION, {
                bottomMetadata
            })
        ),

    spectrogramWindows: DEFAULT_SPECTROGRAM_WINDOWS,
    setSpectrogramWindow: (spectrogramPlotType, spectrogramWindow) =>
        set(
            updateSlice(StoreSlices.EXPAND_SECTION, (expandSection) => ({
                spectrogramWindows: {
                    ...expandSection.spectrogramWindows,
                    [spectrogramPlotType]: spectrogramWindow
                }
            }))
        ),

    spectrogramAudioDuration: DEFAULT_SPECTROGRAM_AUDIO_DURATION,
    setSpectrogramAudioDuration: (spectrogramPlotType, audioDuration) =>
        set(
            updateSlice(StoreSlices.EXPAND_SECTION, (expandSection) => ({
                spectrogramAudioDuration: {
                    ...expandSection.spectrogramAudioDuration,
                    [spectrogramPlotType]: audioDuration
                }
            }))
        )
});
