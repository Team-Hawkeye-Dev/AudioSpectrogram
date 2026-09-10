import { useEffect, type RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { TIME_AXIS_INTERVAL_SECONDS } from '../consts/spectrogram.consts';

interface UseWheelScrollProps {
  containerRef: RefObject<HTMLDivElement | null>;
  waveSurferRef: RefObject<WaveSurfer | null>;
  audioDuration: number;
  isReadyAudio: boolean;
}

export const useWheelScroll = ({
  containerRef,
  waveSurferRef,
  audioDuration,
  isReadyAudio,
}: UseWheelScrollProps) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!isReadyAudio || !container) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const waveSurfer = waveSurferRef.current;
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
  }, [audioDuration, containerRef, isReadyAudio, waveSurferRef]);
};
