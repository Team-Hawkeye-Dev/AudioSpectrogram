import { useEffect, useState, type PointerEvent } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { TIME_AXIS_HEIGHT_PX } from '../consts/audioSpectrogram.consts';
import type { SpectrogramInteractionContext } from '../types/audioSpectrogram.types';
import type { AudioSpectrogramMeasureControls, MeasureArea, MeasureBox } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import { useMassiviAppStore } from '../../../../store/useStore';

interface UseMeasureSelectionProps extends SpectrogramInteractionContext {
  maxFrequencyHz: number;
}

interface PlotPoint {
  x: number;
  y: number;
}

interface PlotScale {
  pxPerSec: number;
  scrollPx: number;
  heightPx: number;
  hzPerPx: number;
}

const LEFT_MOUSE_CLICK = 0;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getSpectrogramHeightPx = (plot: HTMLElement) => plot.clientHeight - TIME_AXIS_HEIGHT_PX;

const getPlotPoint = (event: PointerEvent<HTMLDivElement>): PlotPoint => {
  const plot = event.currentTarget;
  const { left, top } = plot.getBoundingClientRect();
  return {
    x: clamp(event.clientX - left, 0, plot.clientWidth),
    y: clamp(event.clientY - top, 0, getSpectrogramHeightPx(plot)),
  };
};

const getPlotScale = (waveSurfer: WaveSurfer, plot: HTMLElement, maxFrequencyHz: number): PlotScale => {
  const heightPx = getSpectrogramHeightPx(plot);
  return { pxPerSec: waveSurfer.options.minPxPerSec, scrollPx: waveSurfer.getScroll(), heightPx, hzPerPx: maxFrequencyHz / heightPx };
};

const pointsToMeasureArea = (start: PlotPoint, end: PlotPoint, { pxPerSec, scrollPx, heightPx, hzPerPx }: PlotScale): MeasureArea => ({
  startTimeSeconds: (scrollPx + Math.min(start.x, end.x)) / pxPerSec,
  endTimeSeconds: (scrollPx + Math.max(start.x, end.x)) / pxPerSec,
  startFrequencyHz: (heightPx - Math.max(start.y, end.y)) * hzPerPx,
  endFrequencyHz: (heightPx - Math.min(start.y, end.y)) * hzPerPx,
});

const measureAreaToBox = (area: MeasureArea, { pxPerSec, scrollPx, heightPx, hzPerPx }: PlotScale): MeasureBox => ({
  left: area.startTimeSeconds * pxPerSec - scrollPx,
  top: heightPx - area.endFrequencyHz / hzPerPx,
  width: (area.endTimeSeconds - area.startTimeSeconds) * pxPerSec,
  height: (area.endFrequencyHz - area.startFrequencyHz) / hzPerPx,
});

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
  const [startPoint, setStartPoint] = useState<PlotPoint | null>(null);

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    const plot = spectrogramContainerRef.current;
    if (!isReadyAudio || !waveSurfer || !plot || !measureArea) {
      setMeasureBox(null);
      return;
    }

    const updateMeasureBox = () => setMeasureBox(measureAreaToBox(measureArea, getPlotScale(waveSurfer, plot, maxFrequencyHz)));
    updateMeasureBox();
    const unsubscribeScroll = waveSurfer.on('scroll', updateMeasureBox);
    const unsubscribeZoom = waveSurfer.on('zoom', updateMeasureBox);
    return () => {
      unsubscribeScroll();
      unsubscribeZoom();
    };
  }, [isReadyAudio, measureArea, maxFrequencyHz, spectrogramContainerRef, waveSurferInstanceRef]);

  const onMeasureStart = (event: PointerEvent<HTMLDivElement>) => {
    if (!isReadyAudio || event.button !== LEFT_MOUSE_CLICK) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setStartPoint(getPlotPoint(event));
  };

  const onMeasureMove = (event: PointerEvent<HTMLDivElement>) => {
    const waveSurfer = waveSurferInstanceRef.current;
    if (!waveSurfer || !startPoint) return;

    const endPoint = getPlotPoint(event);
    const isEmptyArea = endPoint.x === startPoint.x || endPoint.y === startPoint.y;
    if (isEmptyArea) return;

    const scale = getPlotScale(waveSurfer, event.currentTarget, maxFrequencyHz);
    setMeasureArea(spectrogramPlotType, pointsToMeasureArea(startPoint, endPoint, scale));
  };

  const onMeasureEnd = () => setStartPoint(null);

  return { measureArea, measureBox, isMeasuring: startPoint !== null, onMeasureStart, onMeasureMove, onMeasureEnd };
};
