import { useCallback, useMemo } from 'react';
import type { ZoomSelectionContext } from '../types/audioSpectrogram.types';
import { useDragSelection } from './useDragSelection';
import { useWheelScroll } from './useWheelScroll';
import { useMassiviAppStore } from '../../../../store/useStore';

export const useZoomSelection = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  initialViewRef,
  spectrogramPlotType,
  isReadyAudio,
  applyZoomView,
}: ZoomSelectionContext) => {
  const spectrogramContainer = spectrogramContainerRef.current;
  const initialView = initialViewRef.current;

  const audioDuration = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramAudioDuration[spectrogramPlotType])

  useWheelScroll({
    spectrogramContainerRef,
    waveSurferInstanceRef,
    spectrogramPlotType,
    isReadyAudio,
  });

  const minZoom = useMemo(() => {
    if (!initialView || !spectrogramContainer) return initialView?.minPxPerSec ?? 0;
    const fitToWidthPxPerSec = spectrogramContainer.clientWidth / audioDuration;
    return Math.max(initialView.minPxPerSec, fitToWidthPxPerSec);
  }, [audioDuration, spectrogramContainer, initialView]);

  const { selection, onDragStart, onDragMove, onDragEnd } = useDragSelection({
    spectrogramContainerRef,
    waveSurferInstanceRef,
    spectrogramPlotType,
    isReadyAudio,
    minZoomPxPerSec: minZoom,
    onZoomIn: (minPxPerSec, scrollTime) => {
      applyZoomView({ minPxPerSec, scrollTime }, false);
    },
    onZoomOut: (minPxPerSec, scrollTime) => {
      applyZoomView({ minPxPerSec, scrollTime }, minPxPerSec === minZoom);
    },
  });

  const resetZoom = useCallback(() => {
    applyZoomView({minPxPerSec: minZoom, scrollTime: 0}, true)
  }, [minZoom, applyZoomView]);

  return {
    selection,
    onDragStart,
    onDragMove,
    onDragEnd,
    resetZoom,
  };
};
