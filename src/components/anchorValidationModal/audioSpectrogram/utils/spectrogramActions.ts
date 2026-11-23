import type { MutableRefObject, RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import type WindowedSpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram-windowed.js';
import type TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import type { Region } from 'wavesurfer.js/dist/plugins/regions.js';
import type { FrequencyView, PlaybackPosition } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import { CONTAINER_CENTER_RATIO, FREQUENCY_MIN_HZ } from '../consts/audioSpectrogram.consts';

export const onSpectrogramReady = (
  waveSurferInstanceRef: MutableRefObject<WaveSurfer | null>,
  waveSurfer: WaveSurfer,
  setAudioDuration: (audioDuration: number) => void,
  setIsReadyAudio: (isReadyAudio: boolean) => void,
  onAudioReady?: (audioDuration: number) => void
): (() => void) => {
  waveSurferInstanceRef.current = waveSurfer;
  waveSurfer.on('ready', (audioDuration) => {
    setAudioDuration(audioDuration);
    setIsReadyAudio(true);
    onAudioReady?.(audioDuration)
  });

  return () => {
    waveSurfer.destroy();
    waveSurferInstanceRef.current = null;
    setIsReadyAudio(false);
    setAudioDuration(0);
  };
};

export const onSpectrogramWheel = (
  spectrogramContainerRef: RefObject<HTMLDivElement | null>,
  onWheel: (event: WheelEvent) => void,
): (() => void) => {
  const container = spectrogramContainerRef.current;
  if (!container) return () => {};

  container.addEventListener('wheel', onWheel, { capture: true, passive: false });
  return () => container.removeEventListener('wheel', onWheel, { capture: true });
};

export const rerenderSpectrogramAtZoom = (
  spectrogramPlugin: WindowedSpectrogramPlugin | null,
  decodedAudio: AudioBuffer,
) => {
  void spectrogramPlugin?.render(decodedAudio)
}

export const forceSpectrogramSegmentRendering = (
  spectrogramPlugin: WindowedSpectrogramPlugin,
) => {
  spectrogramPlugin['getWidth'] = () => 0
}

export const renderEveryTimeLabel = (timeLinePlugin: TimelinePlugin) => {
  timeLinePlugin['virtualAppend'] = (
    _startPx: number,
    timeLine: HTMLElement,
    notch: HTMLElement
  ) => {
    timeLine.appendChild(notch)
  }
  timeLinePlugin['updateVisibleNotches'] = () => {}
}

export const setWaveSurferPlayCallback = (waveSurfer: WaveSurfer, onPlay: () => void): (() => void) =>
  waveSurfer.on('play', onPlay)

export const setWaveSurferScrollCallback = (waveSurfer: WaveSurfer, onScroll: () => void): (() => void) =>
  waveSurfer.on('scroll', onScroll)

export const setWaveSurferZoomCallback = (waveSurfer: WaveSurfer, onZoom: () => void): (() => void) =>
  waveSurfer.on('zoom', onZoom)

export const onSpectrogramPlayback = (
  waveSurfer: WaveSurfer,
  setIsPlaying: (isPlaying: boolean) => void,
  setPlaybackPosition: (playbackPosition: PlaybackPosition) => void,
) => {
  const updatePlaybackPosition = () => {
    const currentTime = waveSurfer.getCurrentTime()
    const progressLineOffsetPx = currentTime * waveSurfer.options.minPxPerSec
    const progressLinePx = progressLineOffsetPx - waveSurfer.getScroll()
    setPlaybackPosition({ currentTime, progressLinePx })
  }

  setWaveSurferPlayCallback(waveSurfer, () => setIsPlaying(true))
  waveSurfer.on('pause', () => setIsPlaying(false))
  waveSurfer.on('finish', () => setIsPlaying(false))
  waveSurfer.on('timeupdate', updatePlaybackPosition)
  setWaveSurferScrollCallback(waveSurfer, updatePlaybackPosition)
  setWaveSurferZoomCallback(waveSurfer, updatePlaybackPosition)
}

export const scrollRegionIntoView = (waveSurfer: WaveSurfer, region: Region, containerWidthPx: number) => {
  const { minPxPerSec } = waveSurfer.options
  const visibleStartTime = waveSurfer.getScroll() / minPxPerSec
  const visibleEndTime = visibleStartTime + containerWidthPx / minPxPerSec
  const isRegionVisible = region.start >= visibleStartTime && region.end <= visibleEndTime
  if (!isRegionVisible) waveSurfer.setScrollTime(region.start)
}

export const zoomInFrequencyView = (frequencyView: FrequencyView, selectionTopRatio: number, selectionBottomRatio: number): FrequencyView => {
  const visibleSpanHz = frequencyView.maxHz - frequencyView.minHz
  return {
    minHz: frequencyView.maxHz - selectionBottomRatio * visibleSpanHz,
    maxHz: frequencyView.maxHz - selectionTopRatio * visibleSpanHz,
  }
}

export const zoomOutFrequencyView = (frequencyView: FrequencyView, maxFrequencyHz: number): FrequencyView => {
  const halfVisibleSpanHz = (frequencyView.maxHz - frequencyView.minHz) * CONTAINER_CENTER_RATIO
  return {
    minHz: Math.max(FREQUENCY_MIN_HZ, frequencyView.minHz - halfVisibleSpanHz),
    maxHz: Math.min(maxFrequencyHz, frequencyView.maxHz + halfVisibleSpanHz),
  }
}

export const applySpectrogramFrequencyView = (
  spectrogramPlugin: WindowedSpectrogramPlugin,
  frequencyView: FrequencyView,
  maxFrequencyHz: number,
) => {
  const visibleSpanHz = frequencyView.maxHz - frequencyView.minHz
  const zoomFactor = maxFrequencyHz / visibleSpanHz
  const zoomedPxPerHz = spectrogramPlugin['height'] / visibleSpanHz
  const hiddenAbovePx = (maxFrequencyHz - frequencyView.maxHz) * zoomedPxPerHz
  const canvasContainer = spectrogramPlugin['canvasContainer']

  spectrogramPlugin['wrapper'].style.overflow = 'hidden'
  canvasContainer.style.transformOrigin = 'top'
  canvasContainer.style.transform = `translateY(-${hiddenAbovePx}px) scaleY(${zoomFactor})`
}
