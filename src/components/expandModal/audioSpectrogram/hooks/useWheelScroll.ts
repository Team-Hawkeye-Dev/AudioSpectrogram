import { useEffect } from 'react';
import { TIME_AXIS_INTERVAL_SECONDS } from '../consts/audioSpectrogram.consts';
import type { SpectrogramInteractionContext } from '../types/audioSpectrogram.types';
import { onSpectrogramWheel } from '../utils/spectrogramActions';

export const useWheelScroll = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  audioDuration,
  isReadyAudio,
}: SpectrogramInteractionContext) => {
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

    return onSpectrogramWheel(spectrogramContainerRef, handleWheel);
  }, [audioDuration, spectrogramContainerRef, isReadyAudio, waveSurferInstanceRef]);
};
