import type { PointerEvent, RefObject } from "react";

export interface DragSelection {
    startPx: number;
    currentPx: number;
    startYPx: number;
    currentYPx: number;
}

export interface FrequencyView {
    minHz: number;
    maxHz: number;
}

export interface AudioSpectrogramZoomControls {
    selection: DragSelection | null;
    frequencyView: FrequencyView;
    onDragStart: (event: PointerEvent<HTMLDivElement>) => void;
    onDragMove: (event: PointerEvent<HTMLDivElement>) => void;
    onDragEnd: (event: PointerEvent<HTMLDivElement>) => void;
    resetZoom: () => void;
}

export interface PlaybackPosition {
    currentTime: number;
    progressLinePx: number;
}

export interface AudioSpectrogramPlaybackControls {
    isPlaying: boolean;
    togglePlay: () => void;
    playbackPosition: PlaybackPosition;
}

export interface AudioSpectrogramDetectionControls {
    goToFirstDetection: () => void;
    goToPreviousDetection: () => void;
    goToNextDetection: () => void;
}

export interface AudioSpectrogramSyncControls {
    isSynced: boolean;
    toggleSync: () => void;
}

export interface AudioSpectrogramViewerProps {
    title: string;
    maxHz: number;
    stepHz: number;
    spectrogramContainerRef: RefObject<HTMLDivElement | null>;
    zoom: AudioSpectrogramZoomControls;
    playback: AudioSpectrogramPlaybackControls;
    detections: AudioSpectrogramDetectionControls;
    sync: AudioSpectrogramSyncControls;
    isReadyAudio: boolean;
}
