import type { RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';

export interface InitialView {
  minPxPerSec: number;
  scrollTime: number;
}

export interface AudioSpectrogramViewerProps {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  waveSurferInstanceRef: RefObject<WaveSurfer | null>;
  initialViewRef: RefObject<InitialView | null>;
  audioDuration: number;
  isReadyAudio: boolean;
  applyZoomView: (view: InitialView, keepAutoScroll: boolean) => void;
}

export type SpectrogramInteractionContext = Omit<AudioSpectrogramViewerProps, 'initialViewRef' | 'applyZoomView'>;
