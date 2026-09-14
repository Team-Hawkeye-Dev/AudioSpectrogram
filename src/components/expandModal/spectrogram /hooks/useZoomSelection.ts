import { useCallback, useMemo } from 'react';
import type { AudioSpectrogramViewerProps } from '../types/spectrogram.types';
import { useDragSelection } from './useDragSelection';
import { useWheelScroll } from './useWheelScroll';

export const useZoomSelection = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  initialViewRef,
  audioDuration,
  isReadyAudio,
  applyZoomView,
}: AudioSpectrogramViewerProps) => {
  const waveSurfer = waveSurferInstanceRef.current;
  const container = spectrogramContainerRef.current;
  const initialView = initialViewRef.current;

  useWheelScroll({
    spectrogramContainerRef,
    waveSurferInstanceRef,
    audioDuration,
    isReadyAudio,
  });

  const minZoom = useMemo(() => {
    if (!initialView || !container) return initialView?.minPxPerSec ?? 0;

    return Math.max(initialView.minPxPerSec, container.clientWidth / audioDuration);
  }, [audioDuration, container, initialView]);

  const { selection, onDragStart, onDragMove, onDragEnd } = useDragSelection({
    spectrogramContainerRef,
    waveSurferInstanceRef,
    audioDuration,
    isReadyAudio,
    onZoomIn: (minPxPerSec, scrollTime) => {
      applyZoomView({ minPxPerSec, scrollTime }, false);
    },
    onZoomOut: (minPxPerSec, scrollTime) => {
      applyZoomView({ minPxPerSec, scrollTime }, minPxPerSec === minZoom);
    },
  });

  const resetZoom = useCallback(() => {
    if (!waveSurfer || !container || !initialView)  return;

    waveSurfer.setOptions({ autoScroll: true });
    waveSurfer.zoom(minZoom);
    waveSurfer.setScrollTime(0);
  }, [container, initialView, minZoom, waveSurfer]);

  return {
    selection,
    onDragStart,
    onDragMove,
    onDragEnd,
    resetZoom,
  };
};
