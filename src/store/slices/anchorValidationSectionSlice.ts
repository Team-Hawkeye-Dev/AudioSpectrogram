import type { StateCreator } from 'zustand';
import {
    DEFAULT_SPECTROGRAM_AUDIO_DURATION,
    DEFAULT_SPECTROGRAM_AUDIO_GUID,
    DEFAULT_SPECTROGRAM_MEASURE_AREAS,
    DEFAULT_SPECTROGRAM_WINDOWS,
    type SpectrogramType,
} from '../../components/anchorValidationModal/audioSpectrogram/consts/audioSpectrogram.consts';
import type { MeasureArea } from '../../core/components/spectrogram/audioSpectrogramViewer/types';
import { updateSlice } from '../storeSlices';
import { StoreSlices, type MassiviAppState } from '../useStore';

export type SpectrogramWindow = {
    currentStartTime: number;
    currentEndTime: number;
};

export type SyncedSpectrogramView = {
    startTime: number;
    visibleSeconds: number;
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
    spectrogramMeasureAreas: Record<SpectrogramType, MeasureArea | null>;
    setSpectrogramMeasureArea: (spectrogramPlotType: SpectrogramType, measureArea: MeasureArea) => void;
    isSpectrogramSyncEnabled: boolean;
    setIsSpectrogramSyncEnabled: (isEnabled: boolean) => void;
    syncedSpectrogramView: SyncedSpectrogramView | null;
    setSyncedSpectrogramView: (syncedView: SyncedSpectrogramView | null) => void;
};

export const expandSectionSlice: StateCreator<MassiviAppState, [], [], AnchorValidationSlice> = (set) => ({
    isAnchorValidationModalOpen: false,
    setIsAnchorValidationModalOpen: (open) =>
        set(
            updateSlice(StoreSlices.ANCHOR_VALIDATION_SECTION, {
                isAnchorValidationModalOpen: open, 
                ...(open ? {} : {
                    isSpectrogramSyncEnabled: true,
                    syncedSpectrogramView: null,
                }),
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
        ),

    spectrogramMeasureAreas: DEFAULT_SPECTROGRAM_MEASURE_AREAS,
    setSpectrogramMeasureArea: (spectrogramPlotType, measureArea) =>
        set(
            updateSlice(StoreSlices.ANCHOR_VALIDATION_SECTION, (anchorValidationSection) => ({
                spectrogramMeasureAreas: {
                    ...anchorValidationSection.spectrogramMeasureAreas,
                    [spectrogramPlotType]: measureArea
                }
            }))
        ),

    isSpectrogramSyncEnabled: true,
    setIsSpectrogramSyncEnabled: (isEnabled) =>
        set(
            updateSlice(StoreSlices.ANCHOR_VALIDATION_SECTION, {
                isSpectrogramSyncEnabled: isEnabled
            })
        ),

    syncedSpectrogramView: null,
    setSyncedSpectrogramView: (syncedView) =>
        set(
            updateSlice(StoreSlices.ANCHOR_VALIDATION_SECTION, {
                syncedSpectrogramView: syncedView
            })
        )
});
