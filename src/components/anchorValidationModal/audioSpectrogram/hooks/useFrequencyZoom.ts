import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react';
import type WindowedSpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram-windowed.js';
import { FREQUENCY_MIN_HZ, TIME_AXIS_HEIGHT_PX } from '../consts/audioSpectrogram.consts';
import { applySpectrogramFrequencyView } from '../utils/spectrogramActions';
import { zoomInFrequencyView, zoomOutFrequencyView } from '../utils/frequencyView';
import type { FrequencyView } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';

interface UseFrequencyZoomProps {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  spectrogramPluginRef: RefObject<WindowedSpectrogramPlugin | null>;
  isReadyAudio: boolean;
  maxFrequencyHz: number;
}

export const useFrequencyZoom = ({
  spectrogramContainerRef,
  spectrogramPluginRef,
  isReadyAudio,
  maxFrequencyHz,
}: UseFrequencyZoomProps) => {
  const fullFrequencyView = useMemo(() => ({ minHz: FREQUENCY_MIN_HZ, maxHz: maxFrequencyHz }), [maxFrequencyHz]);
  const [frequencyView, setFrequencyView] = useState<FrequencyView>(fullFrequencyView);

  useEffect(() => {
    const spectrogramPlugin = spectrogramPluginRef.current;
    if (isReadyAudio && spectrogramPlugin) applySpectrogramFrequencyView(spectrogramPlugin, frequencyView, maxFrequencyHz);
  }, [isReadyAudio, frequencyView, maxFrequencyHz, spectrogramPluginRef]);

  const zoomInFrequency = useCallback((selectionTopPx: number, selectionBottomPx: number) => {
    const container = spectrogramContainerRef.current;
    if (!container) return;

    const spectrogramHeightPx = container.clientHeight - TIME_AXIS_HEIGHT_PX;
    const selectionTopRatio = selectionTopPx / spectrogramHeightPx;
    const selectionBottomRatio = selectionBottomPx / spectrogramHeightPx;
    setFrequencyView((view) => zoomInFrequencyView(view, selectionTopRatio, selectionBottomRatio, maxFrequencyHz));
  }, [maxFrequencyHz, spectrogramContainerRef]);

  const zoomOutFrequency = useCallback(
    () => setFrequencyView((view) => zoomOutFrequencyView(view, maxFrequencyHz)),
    [maxFrequencyHz],
  );

  const resetFrequencyView = useCallback(() => setFrequencyView(fullFrequencyView), [fullFrequencyView]);

  return { frequencyView, zoomInFrequency, zoomOutFrequency, resetFrequencyView };
};
