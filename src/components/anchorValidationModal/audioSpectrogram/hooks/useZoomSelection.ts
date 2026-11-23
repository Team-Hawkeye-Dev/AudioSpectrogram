import { useCallback, useMemo, useState } from 'react';
import type { ZoomSelectionProps } from '../types/audioSpectrogram.types';
import { useDragSelection } from './useDragSelection';
import { useWheelScroll } from './useWheelScroll';
import { CONTAINER_CENTER_RATIO, FREQUENCY_MIN_HZ, FULL_PERCENT, MAX_ZOOM_VISIBLE_HZ } from '../consts/audioSpectrogram.consts';
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
  const visibleSpanHz = frequencyView.maxHz - frequencyView.minHz;
  const isMaxYAxisZoom = visibleSpanHz <= MAX_ZOOM_VISIBLE_HZ;

  if (!isReadyAudio && frequencyView !== fullFrequencyView) setFrequencyView(fullFrequencyView);

  const applyYAxisView = useCallback((nextView: FrequencyView) => {
    const spectrogramPlugin = spectrogramPluginRef.current;
    if (!spectrogramPlugin) return;
    const yAxisZoomFactor = maxFrequencyHz / (nextView.maxHz - nextView.minHz);
    const hiddenAbovePercent = (maxFrequencyHz - nextView.maxHz) / maxFrequencyHz * FULL_PERCENT;

    spectrogramPlugin['wrapper'].style.overflow = 'hidden';
    spectrogramPlugin['canvasContainer'].style.transformOrigin = 'top';
    spectrogramPlugin['canvasContainer'].style.transform = `scaleY(${yAxisZoomFactor}) translateY(-${hiddenAbovePercent}%)`;
    setFrequencyView(nextView);
  }, [spectrogramPluginRef, maxFrequencyHz]);

  const zoomInYAxis = (selectionTopRatio: number, selectionBottomRatio: number) => {
    const selectionMaxHz = frequencyView.maxHz - selectionTopRatio * visibleSpanHz;
    const selectionSpanHz = (selectionBottomRatio - selectionTopRatio) * visibleSpanHz;
    const nextVisibleSpanHz = Math.max(selectionSpanHz, MAX_ZOOM_VISIBLE_HZ);
    const nextMinHz = Math.max(FREQUENCY_MIN_HZ, selectionMaxHz - nextVisibleSpanHz);
    applyYAxisView({ minHz: nextMinHz, maxHz: nextMinHz + nextVisibleSpanHz });
  };

  const zoomOutYAxis = () => {
    const halfVisibleSpanHz = visibleSpanHz * CONTAINER_CENTER_RATIO;
    const nextMinHz = Math.max(FREQUENCY_MIN_HZ, frequencyView.minHz - halfVisibleSpanHz);
    const nextMaxHz = Math.min(maxFrequencyHz, frequencyView.maxHz + halfVisibleSpanHz);
    applyYAxisView({ minHz: nextMinHz, maxHz: nextMaxHz });
  };

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
    onYAxisZoomIn: zoomInYAxis,
    onYAxisZoomOut: zoomOutYAxis,
    isMaxYAxisZoom,
  });

  const resetZoom = useCallback(() => {
    applyZoomView({minPxPerSec: minZoom, scrollTime: 0})
    applyYAxisView(fullFrequencyView)
  }, [minZoom, applyZoomView, applyYAxisView, fullFrequencyView]);

  return {
    selection,
    frequencyView,
    onDragStart,
    onDragMove,
    onDragEnd,
    resetZoom,
  };
};
