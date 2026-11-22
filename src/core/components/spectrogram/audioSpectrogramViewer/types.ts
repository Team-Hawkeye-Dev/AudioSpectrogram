import type { PointerEvent, RefObject } from "react";

export interface DragSelection {
    startPx: number;
    currentPx: number;
}

export interface AudioSpectrogramZoomControls {
    selection: DragSelection | null;
    onDragStart: (event: PointerEvent<HTMLDivElement>) => void;
    onDragMove: (event: PointerEvent<HTMLDivElement>) => void;
    onDragEnd: (event: PointerEvent<HTMLDivElement>) => void;
    resetZoom: () => void;
}

export interface MeasureArea {
    startTimeSeconds: number;
    endTimeSeconds: number;
    startFrequencyHz: number;
    endFrequencyHz: number;
}

export interface MeasureBox {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface AudioSpectrogramMeasureControls {
    measureArea: MeasureArea | null;
    measureBox: MeasureBox | null;
    onMeasureStart: (event: PointerEvent<HTMLDivElement>) => void;
    onMeasureMove: (event: PointerEvent<HTMLDivElement>) => void;
    onMeasureEnd: (event: PointerEvent<HTMLDivElement>) => void;
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

export interface AudioSpectrogramViewerProps {
    title: string;
    maxHz: number;
    stepHz: number;
    spectrogramContainerRef: RefObject<HTMLDivElement | null>;
    zoom: AudioSpectrogramZoomControls;
    measure: AudioSpectrogramMeasureControls;
    playback: AudioSpectrogramPlaybackControls;
    detections: AudioSpectrogramDetectionControls;
    isReadyAudio: boolean;
}
