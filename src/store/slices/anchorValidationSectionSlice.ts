import type { StateCreator } from 'zustand';
import {
    DEFAULT_SPECTROGRAM_AUDIO_DURATION,
    DEFAULT_SPECTROGRAM_AUDIO_GUID,
    DEFAULT_SPECTROGRAM_WINDOWS,
    type SpectrogramType,
} from '../../components/anchorValidationModal/audioSpectrogram/consts/audioSpectrogram.consts';
import { updateSlice } from '../storeSlices';
import { StoreSlices, type MassiviAppState } from '../useStore';

export type SpectrogramWindow = {
    currentStartTime: number;
    currentEndTime: number;
};

export type AnchorValidationSlice = {
    isAnchorValidationModalOpen: boolean;
    setIsAnchorValidationModalOpen: (open: boolean) => void;
    spectrogramAudioGuid: Record<SpectrogramType, string | null>;
    setSpectrogramAudioGuid: (
        spectrogramPlotType: SpectrogramType,
        guid: string | null
    ) => void;
    spectrogramWindows: Record<SpectrogramType, SpectrogramWindow>;
    setSpectrogramWindow: (
        spectrogramPlotType: SpectrogramType,
        spectrogramWindow: SpectrogramWindow
    ) => void;
    spectrogramAudioDuration: Record<SpectrogramType, number>;
    setSpectrogramAudioDuration: (spectrogramPlotType: SpectrogramType, audioDuration: number) => void;
};

export const expandSectionSlice: StateCreator<MassiviAppState, [], [], AnchorValidationSlice> = (set) => ({
    isAnchorValidationModalOpen: false,
    setIsAnchorValidationModalOpen: (open) =>
        set(
            updateSlice(StoreSlices.ANCHOR_VALIDATION_SECTION, {
                isAnchorValidationModalOpen: open
            })
        ),

    spectrogramAudioGuid: DEFAULT_SPECTROGRAM_AUDIO_GUID,
    setSpectrogramAudioGuid: (spectrogramPlotType, guid) =>
        set(
            updateSlice(StoreSlices.ANCHOR_VALIDATION_SECTION, (anchorValidationSection) => ({
                spectrogramAudioGuid: {
                    ...anchorValidationSection.spectrogramAudioGuid,
                    [spectrogramPlotType]: guid
                }
            }))
        ),

    spectrogramWindows: DEFAULT_SPECTROGRAM_WINDOWS,
    setSpectrogramWindow: (spectrogramPlotType, spectrogramWindow) =>
        set(
            updateSlice(StoreSlices.ANCHOR_VALIDATION_SECTION, (expandSection) => ({
                spectrogramWindows: {
                    ...expandSection.spectrogramWindows,
                    [spectrogramPlotType]: spectrogramWindow
                }
            }))
        ),

    spectrogramAudioDuration: DEFAULT_SPECTROGRAM_AUDIO_DURATION,
    setSpectrogramAudioDuration: (spectrogramPlotType, audioDuration) =>
        set(
            updateSlice(StoreSlices.ANCHOR_VALIDATION_SECTION, (expandSection) => ({
                spectrogramAudioDuration: {
                    ...expandSection.spectrogramAudioDuration,
                    [spectrogramPlotType]: audioDuration
                }
            }))
        )
});
