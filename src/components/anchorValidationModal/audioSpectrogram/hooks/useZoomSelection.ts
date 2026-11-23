import { useCallback, useMemo } from 'react';
import type { ZoomSelectionProps } from '../types/audioSpectrogram.types';
import { useDragSelection } from './useDragSelection';
import { useWheelScroll } from './useWheelScroll';
import { useFrequencyZoom } from './useFrequencyZoom';
import { useMassiviAppStore } from '../../../../store/useStore';

export const useZoomSelection = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  spectrogramPluginRef,
  initialViewRef,
  spectrogramPlotType,
  isReadyAudio,
  maxFrequencyHz,
  applyZoomView,
}: ZoomSelectionProps) => {
  const spectrogramContainer = spectrogramContainerRef.current;
  const initialView = initialViewRef.current;

  const audioDuration = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramAudioDuration[spectrogramPlotType])

  useWheelScroll({
    spectrogramContainerRef,
    waveSurferInstanceRef,
    spectrogramPlotType,
    isReadyAudio,
  });

  const { frequencyView, zoomInFrequency, zoomOutFrequency, resetFrequencyView } = useFrequencyZoom({
    spectrogramContainerRef,
    spectrogramPluginRef,
    isReadyAudio,
    maxFrequencyHz,
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
      applyZoomView({ minPxPerSec, scrollTime });
    },
    onZoomOut: (minPxPerSec, scrollTime) => {
      applyZoomView({ minPxPerSec, scrollTime });
    },
    onFrequencyZoomIn: zoomInFrequency,
    onFrequencyZoomOut: zoomOutFrequency,
  });

  const resetZoom = useCallback(() => {
    applyZoomView({minPxPerSec: minZoom, scrollTime: 0})
    resetFrequencyView()
  }, [minZoom, applyZoomView, resetFrequencyView]);

  return {
    selection,
    frequencyView,
    onDragStart,
    onDragMove,
    onDragEnd,
    resetZoom,
  };
};
