import type { MutableRefObject, RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';

export const onSpectrogramReady = (
  waveSurferInstanceRef: MutableRefObject<WaveSurfer | null>,
  waveSurfer: WaveSurfer,
  setAudioDuration: (audioDuration: number) => void,
  setIsReadyAudio: (isReadyAudio: boolean) => void,
): (() => void) => {
  waveSurferInstanceRef.current = waveSurfer;
  waveSurfer.on('ready', (audioDuration) => {
    setAudioDuration(audioDuration);
    setIsReadyAudio(true);
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
