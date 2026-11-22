import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { LEFT_MOUSE_BUTTON, TIME_AXIS_HEIGHT_PX } from '../consts/audioSpectrogram.consts';
import { onSpectrogramViewChange } from '../utils/spectrogramActions';
import type { SpectrogramInteractionContext } from '../types/audioSpectrogram.types';
import type {
  AudioSpectrogramMeasureControls,
  MeasureArea,
  MeasureBox,
} from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import { useMassiviAppStore } from '../../../../store/useStore';

interface UseMeasureSelectionProps extends SpectrogramInteractionContext {
  maxFrequencyHz: number;
}

interface PlotPoint {
  x: number;
  y: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getSpectrogramHeightPx = (plot: HTMLElement) => plot.clientHeight - TIME_AXIS_HEIGHT_PX;

const getPlotPoint = (event: PointerEvent<HTMLDivElement>): PlotPoint => {
  const plot = event.currentTarget;
  const plotRect = plot.getBoundingClientRect();
  const x = event.clientX - plotRect.left;
  const y = event.clientY - plotRect.top;

  return {
    x: clamp(x, 0, plot.clientWidth),
    y: clamp(y, 0, getSpectrogramHeightPx(plot)),
  };
};

const pointsToMeasureArea = (
  startPoint: PlotPoint,
  endPoint: PlotPoint,
  waveSurfer: WaveSurfer,
  spectrogramHeightPx: number,
  maxFrequencyHz: number,
): MeasureArea => {
  const pxPerSec = waveSurfer.options.minPxPerSec;
  const scrollPx = waveSurfer.getScroll();
  const hzPerPx = maxFrequencyHz / spectrogramHeightPx;

  const left = Math.min(startPoint.x, endPoint.x);
  const right = Math.max(startPoint.x, endPoint.x);
  const top = Math.min(startPoint.y, endPoint.y);
  const bottom = Math.max(startPoint.y, endPoint.y);

  return {
    startTimeSeconds: (scrollPx + left) / pxPerSec,
    endTimeSeconds: (scrollPx + right) / pxPerSec,
    startFrequencyHz: (spectrogramHeightPx - bottom) * hzPerPx,
    endFrequencyHz: (spectrogramHeightPx - top) * hzPerPx,
  };
};

const measureAreaToBox = (
  measureArea: MeasureArea,
  waveSurfer: WaveSurfer,
  spectrogramHeightPx: number,
  maxFrequencyHz: number,
): MeasureBox => {
  const pxPerSec = waveSurfer.options.minPxPerSec;
  const scrollPx = waveSurfer.getScroll();
  const pxPerHz = spectrogramHeightPx / maxFrequencyHz;

  const left = measureArea.startTimeSeconds * pxPerSec - scrollPx;
  const right = measureArea.endTimeSeconds * pxPerSec - scrollPx;
  const top = spectrogramHeightPx - measureArea.endFrequencyHz * pxPerHz;
  const bottom = spectrogramHeightPx - measureArea.startFrequencyHz * pxPerHz;

  return { left, top, width: right - left, height: bottom - top };
};

export const useMeasureSelection = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  spectrogramPlotType,
  isReadyAudio,
  maxFrequencyHz,
}: UseMeasureSelectionProps): AudioSpectrogramMeasureControls => {
  const measureArea = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramMeasureAreas[spectrogramPlotType]);
  const setMeasureArea = useMassiviAppStore((state) => state.anchorValidationSection.setSpectrogramMeasureArea);
  const [measureBox, setMeasureBox] = useState<MeasureBox | null>(null);
  const startPointRef = useRef<PlotPoint | null>(null);

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    const plot = spectrogramContainerRef.current;
    if (!isReadyAudio || !waveSurfer || !plot || !measureArea) {
      setMeasureBox(null);
      return;
    }

    const updateMeasureBox = () =>
      setMeasureBox(measureAreaToBox(measureArea, waveSurfer, getSpectrogramHeightPx(plot), maxFrequencyHz));

    updateMeasureBox();
    return onSpectrogramViewChange(waveSurfer, updateMeasureBox);
  }, [isReadyAudio, measureArea, maxFrequencyHz, spectrogramContainerRef, waveSurferInstanceRef]);

  const onMeasureStart = (event: PointerEvent<HTMLDivElement>) => {
    if (!isReadyAudio || event.button !== LEFT_MOUSE_BUTTON) return;

    startPointRef.current = getPlotPoint(event);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onMeasureMove = (event: PointerEvent<HTMLDivElement>) => {
    const waveSurfer = waveSurferInstanceRef.current;
    const startPoint = startPointRef.current;
    if (!waveSurfer || !startPoint) return;

    const endPoint = getPlotPoint(event);
    const isEmptyArea = endPoint.x === startPoint.x || endPoint.y === startPoint.y;
    if (isEmptyArea) return;

    const spectrogramHeightPx = getSpectrogramHeightPx(event.currentTarget);
    setMeasureArea(spectrogramPlotType, pointsToMeasureArea(startPoint, endPoint, waveSurfer, spectrogramHeightPx, maxFrequencyHz));
  };

  const onMeasureEnd = (event: PointerEvent<HTMLDivElement>) => {
    onMeasureMove(event);
    startPointRef.current = null;
  };

  return { measureArea, measureBox, onMeasureStart, onMeasureMove, onMeasureEnd };
};
