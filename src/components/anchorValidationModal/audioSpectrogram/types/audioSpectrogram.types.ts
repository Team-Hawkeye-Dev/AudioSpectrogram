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

export interface AudioSpectrogramViewerProps {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  waveSurferInstanceRef: RefObject<WaveSurfer | null>;
  initialViewRef: RefObject<InitialView | null>;
  spectrogramPlotType: SpectrogramType;
  isReadyAudio: boolean;
  isPlaying: boolean;
  togglePlay: () => void;
  playbackPosition: PlaybackPosition;
  applyZoomView: (view: InitialView, keepAutoScroll: boolean) => void;
}

export type ZoomSelectionContext = Omit<AudioSpectrogramViewerProps, 'isPlaying' | 'togglePlay' | 'playbackPosition'>;

export type SpectrogramInteractionContext = Omit<ZoomSelectionContext, 'initialViewRef' | 'applyZoomView'>;
