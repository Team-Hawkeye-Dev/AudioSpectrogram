import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ZoomSelectionProps } from '../types/audioSpectrogram.types';
import { useDragSelection } from './useDragSelection';
import { useWheelScroll } from './useWheelScroll';
import { FREQUENCY_MIN_HZ } from '../consts/audioSpectrogram.consts';
import { applySpectrogramFrequencyView, zoomInFrequencyView, zoomOutFrequencyView } from '../utils/spectrogramActions';
import type { FrequencyView } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
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

  const fullFrequencyView = useMemo(() => ({ minHz: FREQUENCY_MIN_HZ, maxHz: maxFrequencyHz }), [maxFrequencyHz]);
  const [frequencyView, setFrequencyView] = useState<FrequencyView>(fullFrequencyView);

  useEffect(() => {
    const spectrogramPlugin = spectrogramPluginRef.current;
    if (isReadyAudio && spectrogramPlugin) applySpectrogramFrequencyView(spectrogramPlugin, frequencyView, maxFrequencyHz);
  }, [isReadyAudio, frequencyView, maxFrequencyHz, spectrogramPluginRef]);

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
    onFrequencyZoomIn: (selectionTopRatio, selectionBottomRatio) => {
      setFrequencyView((view) => zoomInFrequencyView(view, selectionTopRatio, selectionBottomRatio));
    },
    onFrequencyZoomOut: () => {
      setFrequencyView((view) => zoomOutFrequencyView(view, maxFrequencyHz));
    },
  });

  const resetZoom = useCallback(() => {
    applyZoomView({minPxPerSec: minZoom, scrollTime: 0})
    setFrequencyView(fullFrequencyView)
  }, [minZoom, applyZoomView, fullFrequencyView]);

  return {
    selection,
    frequencyView,
    onDragStart,
    onDragMove,
    onDragEnd,
    resetZoom,
  };
};
