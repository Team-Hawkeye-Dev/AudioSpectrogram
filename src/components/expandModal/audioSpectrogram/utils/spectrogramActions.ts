import type { MutableRefObject, RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import type WindowedSpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram-windowed.js';
import type TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';

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
