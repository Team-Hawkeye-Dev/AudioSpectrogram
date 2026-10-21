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

export interface AudioSpectrogramViewerProps {
    maxHz: number;
    stepHz: number;
    spectrogramContainerRef: RefObject<HTMLDivElement | null>;
    zoom: AudioSpectrogramZoomControls;
    isReadyAudio: boolean;
}
