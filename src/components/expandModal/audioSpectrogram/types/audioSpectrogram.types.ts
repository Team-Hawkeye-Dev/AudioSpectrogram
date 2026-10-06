import type { RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import type { SpectrogramType } from '../consts/audioSpectrogram.consts';

export interface InitialView {
  minPxPerSec: number;
  scrollTime: number;
}

export interface AudioSpectrogramViewerProps {
  spectrogramPlotType: SpectrogramType;
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  waveSurferInstanceRef: RefObject<WaveSurfer | null>;
  initialViewRef: RefObject<InitialView | null>;
  isReadyAudio: boolean;
  applyZoomView: (view: InitialView, keepAutoScroll: boolean) => void;
}

export type SpectrogramInteractionContext = Omit<AudioSpectrogramViewerProps, 'initialViewRef' | 'applyZoomView'>;
