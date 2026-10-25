import type { RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import type { SpectrogramType } from '../consts/audioSpectrogram.consts';
import type { PlaybackPosition } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';

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

export interface SpectrogramInteractionContext {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  waveSurferInstanceRef: RefObject<WaveSurfer | null>;
  spectrogramPlotType: SpectrogramType;
  isReadyAudio: boolean;
}

export interface ZoomSelectionProps extends SpectrogramInteractionContext {
   initialViewRef: RefObject<InitialView | null>;
    applyZoomView: (view: InitialView, keepAutoScroll: boolean) => void;
}

export interface AudioSpectrogramViewerProps extends ZoomSelectionProps {
  isPlaying: boolean;
  togglePlay: () => void;
  playbackPosition: PlaybackPosition;
}
