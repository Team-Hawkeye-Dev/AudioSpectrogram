import { useCallback, useMemo } from 'react';
import type { AudioSpectrogramViewerProps } from '../types/audioSpectrogram.types';
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
}: AudioSpectrogramViewerProps) => {
  const waveSurferInstance = waveSurferInstanceRef.current;
  const spectrogramContainer = spectrogramContainerRef.current;
  const initialView = initialViewRef.current;

  const audioDuration = useMassiviAppStore((state) => state.expandSection.spectrogramAudioDuration[spectrogramPlotType])

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
    onZoomIn: (minPxPerSec, scrollTime) => {
      applyZoomView({ minPxPerSec, scrollTime }, false);
    },
    onZoomOut: (minPxPerSec, scrollTime) => {
      applyZoomView({ minPxPerSec, scrollTime }, minPxPerSec === minZoom);
    },
  });

  const resetZoom = useCallback(() => {
    if (!waveSurferInstance) return;

    waveSurferInstance.setOptions({ autoScroll: true });
    waveSurferInstance.zoom(minZoom);
    waveSurferInstance.setScrollTime(0);
  }, [minZoom, waveSurferInstance]);

  return {
    selection,
    onDragStart,
    onDragMove,
    onDragEnd,
    resetZoom,
  };
};
