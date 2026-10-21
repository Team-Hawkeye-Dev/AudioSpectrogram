import type { RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import type { SpectrogramType } from '../consts/audioSpectrogram.consts';

export interface InitialView {
  minPxPerSec: number;
  scrollTime: number;
}

export interface AudioSpectrogramSource {
  audioGuid: string | null;
  spectrogramType: SpectrogramType;
  maxHz: number;
  stepHz: number
}

export interface AudioSpectrogramViewerProps {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  waveSurferInstanceRef: RefObject<WaveSurfer | null>;
  initialViewRef: RefObject<InitialView | null>;
    spectrogramPlotType: SpectrogramType;
  isReadyAudio: boolean;
  applyZoomView: (view: InitialView, keepAutoScroll: boolean) => void;
}

export type SpectrogramInteractionContext = Omit<AudioSpectrogramViewerProps, 'initialViewRef' | 'applyZoomView'>;
