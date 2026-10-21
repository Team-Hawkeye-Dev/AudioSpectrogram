import { useEffect, useMemo } from 'react';
import { TIME_AXIS_INTERVAL_SECONDS } from '../consts/audioSpectrogram.consts';
import type { SpectrogramInteractionContext } from '../types/audioSpectrogram.types';
import { onSpectrogramWheel } from '../utils/spectrogramActions';
import { useMassiviAppStore } from '../../../../store/useStore';

export const useWheelScroll = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  spectrogramPlotType,
  isReadyAudio,
}: SpectrogramInteractionContext) => {
  const audioDuration = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramAudioDuration[spectrogramPlotType])
  const setSpectrogramWindow = useMassiviAppStore((state) => state.anchorValidationSection.setSpectrogramWindow)

  const getScrollDirection = useMemo(
    () => (deltaY: number)=> (deltaY < 0 ? 1 : -1), [],
  );

  useEffect(() => {
    const container = spectrogramContainerRef.current;
    if (!isReadyAudio || !container) return;
    
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const waveSurfer = waveSurferInstanceRef.current;
      if (!waveSurfer) return;
    
      const scrollDirection = getScrollDirection(event.deltaY)
      const containerWidth = container.clientWidth;
      const minPxPerSec = waveSurfer.options.minPxPerSec;
      const visibleDuration = containerWidth / minPxPerSec;
      const maxScrollTime = Math.max(0, audioDuration - visibleDuration);
      const currentScrollTime = waveSurfer.getScroll() / minPxPerSec;
      const nextScrollTime = Math.min(
        maxScrollTime,
        Math.max(0, currentScrollTime + scrollDirection * TIME_AXIS_INTERVAL_SECONDS),
      );

      waveSurfer.setScrollTime(nextScrollTime);
      setSpectrogramWindow(spectrogramPlotType, {
        currentStartTime: nextScrollTime,
        currentEndTime: nextScrollTime + visibleDuration
      })
    };

    return onSpectrogramWheel(spectrogramContainerRef, handleWheel)
  }, [audioDuration, spectrogramContainerRef, isReadyAudio, waveSurferInstanceRef, getScrollDirection, setSpectrogramWindow, spectrogramPlotType]);
};
