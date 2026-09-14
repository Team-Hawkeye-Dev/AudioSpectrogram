import { useEffect, type RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { TIME_AXIS_INTERVAL_SECONDS } from '../consts/spectrogram.consts';

interface UseWheelScrollProps {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  waveSurferInstanceRef: RefObject<WaveSurfer | null>;
  audioDuration: number;
  isReadyAudio: boolean;
}

export const useWheelScroll = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  audioDuration,
  isReadyAudio,
}: UseWheelScrollProps) => {
  useEffect(() => {
    const container = spectrogramContainerRef.current;
    if (!isReadyAudio || !container) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const waveSurfer = waveSurferInstanceRef.current;
      if (!waveSurfer) {
        return;
      }

      const direction = event.deltaY < 0 ? 1 : -1;
      const containerWidth = container.clientWidth;
      const minPxPerSec = waveSurfer.options.minPxPerSec;
      const visibleDuration = containerWidth / minPxPerSec;
      const maxScrollTime = Math.max(0, audioDuration - visibleDuration);
      const currentScrollTime = waveSurfer.getScroll() / minPxPerSec;
      const nextScrollTime = Math.min(
        maxScrollTime,
        Math.max(0, currentScrollTime + direction * TIME_AXIS_INTERVAL_SECONDS),
      );

      waveSurfer.setOptions({ autoScroll: false });
      waveSurfer.setScrollTime(nextScrollTime);
    };

    container.addEventListener('wheel', handleWheel, { capture: true, passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [audioDuration, spectrogramContainerRef, isReadyAudio, waveSurferInstanceRef]);
};
