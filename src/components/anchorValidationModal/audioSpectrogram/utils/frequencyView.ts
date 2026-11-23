import {
  CONTAINER_CENTER_RATIO,
  DRAG_ZOOM_OUT_FACTOR,
  FREQUENCY_MIN_HZ,
  MAX_FREQUENCY_ZOOM,
} from '../consts/audioSpectrogram.consts';
import type { FrequencyView } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';

const fitFrequencyView = (centerHz: number, visibleSpanHz: number, maxFrequencyHz: number): FrequencyView => {
  const topHz = centerHz + visibleSpanHz * CONTAINER_CENTER_RATIO;
  const maxHz = Math.min(maxFrequencyHz, Math.max(FREQUENCY_MIN_HZ + visibleSpanHz, topHz));
  return { minHz: maxHz - visibleSpanHz, maxHz };
};

export const zoomInFrequencyView = (
  view: FrequencyView,
  selectionTopRatio: number,
  selectionBottomRatio: number,
  maxFrequencyHz: number,
): FrequencyView => {
  const visibleSpanHz = view.maxHz - view.minHz;
  const selectionTopHz = view.maxHz - selectionTopRatio * visibleSpanHz;
  const selectionSpanHz = (selectionBottomRatio - selectionTopRatio) * visibleSpanHz;
  const selectionCenterHz = selectionTopHz - selectionSpanHz * CONTAINER_CENTER_RATIO;
  const minVisibleSpanHz = maxFrequencyHz / MAX_FREQUENCY_ZOOM;
  const nextVisibleSpanHz = Math.max(selectionSpanHz, minVisibleSpanHz);

  return fitFrequencyView(selectionCenterHz, nextVisibleSpanHz, maxFrequencyHz);
};

export const zoomOutFrequencyView = (view: FrequencyView, maxFrequencyHz: number): FrequencyView => {
  const visibleSpanHz = view.maxHz - view.minHz;
  const centerHz = view.maxHz - visibleSpanHz * CONTAINER_CENTER_RATIO;
  const nextVisibleSpanHz = Math.min(maxFrequencyHz, visibleSpanHz * DRAG_ZOOM_OUT_FACTOR);

  return fitFrequencyView(centerHz, nextVisibleSpanHz, maxFrequencyHz);
};
