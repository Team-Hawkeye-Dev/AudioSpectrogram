import { useEffect, useState, type PointerEvent } from 'react';
import type WaveSurfer from 'wavesurfer.js';
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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getSpectrogramHeightPx = (plot: HTMLElement) => plot.clientHeight - TIME_AXIS_HEIGHT_PX;

const getMeasurePoint = (event: PointerEvent<HTMLDivElement>, waveSurfer: WaveSurfer, maxFrequencyHz: number): MeasurePoint => {
  const plot = event.currentTarget;
  const { left, top } = plot.getBoundingClientRect();
  const heightPx = getSpectrogramHeightPx(plot);
  const x = clamp(event.clientX - left, 0, plot.clientWidth);
  const y = clamp(event.clientY - top, 0, heightPx);

  return {
    timeSeconds: (waveSurfer.getScroll() + x) / waveSurfer.options.minPxPerSec,
    frequencyHz: (1 - y / heightPx) * maxFrequencyHz,
  };
};

const toMeasureArea = (start: MeasurePoint, end: MeasurePoint): MeasureArea => ({
  startTimeSeconds: Math.min(start.timeSeconds, end.timeSeconds),
  endTimeSeconds: Math.max(start.timeSeconds, end.timeSeconds),
  startFrequencyHz: Math.min(start.frequencyHz, end.frequencyHz),
  endFrequencyHz: Math.max(start.frequencyHz, end.frequencyHz),
});

const toMeasureBox = (area: MeasureArea, waveSurfer: WaveSurfer, plot: HTMLElement, maxFrequencyHz: number): MeasureBox => {
  const pxPerSec = waveSurfer.options.minPxPerSec;
  const pxPerHz = getSpectrogramHeightPx(plot) / maxFrequencyHz;

  return {
    left: area.startTimeSeconds * pxPerSec - waveSurfer.getScroll(),
    top: (maxFrequencyHz - area.endFrequencyHz) * pxPerHz,
    width: (area.endTimeSeconds - area.startTimeSeconds) * pxPerSec,
    height: (area.endFrequencyHz - area.startFrequencyHz) * pxPerHz,
  };
};

export const useMeasureSelection = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  spectrogramPlotType,
  isReadyAudio,
  maxFrequencyHz,
}: UseMeasureSelectionProps): AudioSpectrogramMeasureControls => {
  const savedMeasureArea = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramMeasureAreas[spectrogramPlotType]);
  const setMeasureArea = useMassiviAppStore((state) => state.anchorValidationSection.setSpectrogramMeasureArea);
  const [startPoint, setStartPoint] = useState<MeasurePoint | null>(null);
  const [draftMeasureArea, setDraftMeasureArea] = useState<MeasureArea | null>(null);
  const [measureBox, setMeasureBox] = useState<MeasureBox | null>(null);
  const measureArea = draftMeasureArea ?? savedMeasureArea;

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    const plot = spectrogramContainerRef.current;
    if (!isReadyAudio || !waveSurfer || !plot || !measureArea) return;

    const updateMeasureBox = () => setMeasureBox(toMeasureBox(measureArea, waveSurfer, plot, maxFrequencyHz));
    updateMeasureBox();
    const unsubscribeScroll = setWaveSurferScrollCallback(waveSurfer, updateMeasureBox);
    const unsubscribeZoom = setWaveSurferZoomCallback(waveSurfer, updateMeasureBox);
    return () => {
      unsubscribeScroll();
      unsubscribeZoom();
    };
  }, [isReadyAudio, measureArea, maxFrequencyHz, spectrogramContainerRef, waveSurferInstanceRef]);

  const onMeasureStart = (event: PointerEvent<HTMLDivElement>) => {
    const waveSurfer = waveSurferInstanceRef.current;
    if (!isReadyAudio || !waveSurfer || event.button !== LEFT_MOUSE_CLICK) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setStartPoint(getMeasurePoint(event, waveSurfer, maxFrequencyHz));
  };

  const onMeasureMove = (event: PointerEvent<HTMLDivElement>) => {
    const waveSurfer = waveSurferInstanceRef.current;
    if (!waveSurfer || !startPoint) return;

    const endPoint = getMeasurePoint(event, waveSurfer, maxFrequencyHz);
    const isEmptyArea = endPoint.timeSeconds === startPoint.timeSeconds || endPoint.frequencyHz === startPoint.frequencyHz;
    if (!isEmptyArea) setDraftMeasureArea(toMeasureArea(startPoint, endPoint));
  };

  const onMeasureEnd = () => {
    if (draftMeasureArea) setMeasureArea(spectrogramPlotType, draftMeasureArea);
    setDraftMeasureArea(null);
    setStartPoint(null);
  };

  return { measureArea, measureBox, isMeasuring: startPoint !== null, onMeasureStart, onMeasureMove, onMeasureEnd };
};
