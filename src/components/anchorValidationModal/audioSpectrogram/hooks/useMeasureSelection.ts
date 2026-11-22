import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { TIME_AXIS_HEIGHT_PX } from '../consts/audioSpectrogram.consts';
import { setWaveSurferScrollCallback, setWaveSurferZoomCallback } from '../utils/spectrogramActions';
import type { SpectrogramInteractionContext } from '../types/audioSpectrogram.types';
import type { AudioSpectrogramMeasureControls, MeasureArea, MeasureBox } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import { useMassiviAppStore } from '../../../../store/useStore';

interface UseMeasureSelectionProps extends SpectrogramInteractionContext {
  maxFrequencyHz: number;
}

interface MeasurePoint {
  timeSeconds: number;
  frequencyHz: number;
}

const LEFT_MOUSE_CLICK = 0;

export const useMeasureSelection = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  spectrogramPlotType,
  isReadyAudio,
  maxFrequencyHz,
}: UseMeasureSelectionProps): AudioSpectrogramMeasureControls => {
  const savedMeasureArea = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramMeasureAreas[spectrogramPlotType]);
  const setMeasureArea = useMassiviAppStore((state) => state.anchorValidationSection.setSpectrogramMeasureArea);
  const [draftMeasureArea, setDraftMeasureArea] = useState<MeasureArea | null>(null);
  const [measureBox, setMeasureBox] = useState<MeasureBox | null>(null);
  const startPointRef = useRef<MeasurePoint | null>(null);
  const measureArea = draftMeasureArea ?? savedMeasureArea;

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    const plot = spectrogramContainerRef.current;
    if (!isReadyAudio || !waveSurfer || !plot || !measureArea) return;

    const updateMeasureBox = () => {
      const { startTimeSeconds, endTimeSeconds, startFrequencyHz, endFrequencyHz } = measureArea;
      const pxPerSec = waveSurfer.options.minPxPerSec;
      const pxPerHz = (plot.clientHeight - TIME_AXIS_HEIGHT_PX) / maxFrequencyHz;
      const startTimePx = startTimeSeconds * pxPerSec;
      const scrollPx = waveSurfer.getScroll();

      const left = startTimePx - scrollPx;
      const top = (maxFrequencyHz - endFrequencyHz) * pxPerHz;
      const width = (endTimeSeconds - startTimeSeconds) * pxPerSec;
      const height = (endFrequencyHz - startFrequencyHz) * pxPerHz;
      setMeasureBox({ left, top, width, height });
    };

    updateMeasureBox();
    const unsubscribeScroll = setWaveSurferScrollCallback(waveSurfer, updateMeasureBox);
    const unsubscribeZoom = setWaveSurferZoomCallback(waveSurfer, updateMeasureBox);
    return () => {
      unsubscribeScroll();
      unsubscribeZoom();
    };
  }, [isReadyAudio, measureArea, maxFrequencyHz, spectrogramContainerRef, waveSurferInstanceRef]);

  const getMeasurePoint = useCallback((event: PointerEvent<HTMLDivElement>): MeasurePoint | null => {
    const waveSurfer = waveSurferInstanceRef.current;
    if (!waveSurfer) return null;

    const plot = event.currentTarget;
    const plotRect = plot.getBoundingClientRect();
    const spectrogramHeightPx = plot.clientHeight - TIME_AXIS_HEIGHT_PX;
    const pointerXPx = Math.min(Math.max(event.clientX - plotRect.left, 0), plot.clientWidth);
    const pointerYPx = Math.min(Math.max(event.clientY - plotRect.top, 0), spectrogramHeightPx);
    const scrolledXPx = waveSurfer.getScroll() + pointerXPx;
    const heightFromBottomPx = spectrogramHeightPx - pointerYPx;
    const hzPerPx = maxFrequencyHz / spectrogramHeightPx;

    return {
      timeSeconds: scrolledXPx / waveSurfer.options.minPxPerSec,
      frequencyHz: heightFromBottomPx * hzPerPx,
    };
  }, [maxFrequencyHz, waveSurferInstanceRef]);

  const onMeasureStart = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!isReadyAudio || event.button !== LEFT_MOUSE_CLICK) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startPointRef.current = getMeasurePoint(event);
  }, [isReadyAudio, getMeasurePoint]);

  const onMeasureMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const startPoint = startPointRef.current;
    if (!startPoint) return;
    const endPoint = getMeasurePoint(event);
    const isEmptyArea = !endPoint || endPoint.timeSeconds === startPoint.timeSeconds || endPoint.frequencyHz === startPoint.frequencyHz;
    if (isEmptyArea) return;

    setDraftMeasureArea({
      startTimeSeconds: Math.min(startPoint.timeSeconds, endPoint.timeSeconds),
      endTimeSeconds: Math.max(startPoint.timeSeconds, endPoint.timeSeconds),
      startFrequencyHz: Math.min(startPoint.frequencyHz, endPoint.frequencyHz),
      endFrequencyHz: Math.max(startPoint.frequencyHz, endPoint.frequencyHz),
    });
  }, [getMeasurePoint]);

  const onMeasureEnd = useCallback(() => {
    if (draftMeasureArea) setMeasureArea(spectrogramPlotType, draftMeasureArea);
    startPointRef.current = null;
    setDraftMeasureArea(null);
  }, [draftMeasureArea, setMeasureArea, spectrogramPlotType]);

  return { measureArea, measureBox, isMeasuring: draftMeasureArea !== null, onMeasureStart, onMeasureMove, onMeasureEnd };
};
