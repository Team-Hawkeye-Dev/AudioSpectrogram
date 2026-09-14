import { useCallback, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import type { InitialView } from './useAudioSpectrogramViewer';
import { useDragSelection } from './useDragSelection';
import { useWheelScroll } from './useWheelScroll';

interface UseZoomSelectionProps {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  waveSurferInstanceRef: RefObject<WaveSurfer | null>;
  initialViewRef: RefObject<InitialView | null>;
  audioDuration: number;
  isReadyAudio: boolean;
  applyZoomView: (view: InitialView, keepAutoScroll: boolean) => void;
}

export const useZoomSelection = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  initialViewRef,
  audioDuration,
  isReadyAudio,
  applyZoomView,
}: UseZoomSelectionProps) => {
  const waveSurfer = waveSurferInstanceRef.current;
  const container = spectrogramContainerRef.current;
  const initialView = initialViewRef.current;
  const applyZoomViewRef = useRef(applyZoomView);
  applyZoomViewRef.current = applyZoomView;

  useWheelScroll({
    spectrogramContainerRef,
    waveSurferInstanceRef,
    audioDuration,
    isReadyAudio,
  });

  const minZoom = useMemo(() => {
    if (!initialView || !container) return initialView?.minPxPerSec ?? 0;

    return Math.max(initialView.minPxPerSec, container.clientWidth / audioDuration);
  }, [audioDuration, container, initialView]);

  const { selection, onDragStart, onDragMove, onDragEnd } = useDragSelection({
    spectrogramContainerRef,
    waveSurferInstanceRef,
    audioDuration,
    isReadyAudio,
    onZoomIn: (minPxPerSec, scrollTime) => {
      applyZoomViewRef.current({ minPxPerSec, scrollTime }, false);
    },
    onZoomOut: (minPxPerSec, scrollTime) => {
      applyZoomViewRef.current({ minPxPerSec, scrollTime }, minPxPerSec === minZoom);
    },
  });

  const resetZoom = useCallback(() => {
    if (!waveSurfer || !container || !initialView)  return;

    waveSurfer.setOptions({ autoScroll: true });
    waveSurfer.zoom(minZoom);
    waveSurfer.setScrollTime(0);
  }, [container, initialView, minZoom, waveSurfer]);

  return {
    selection,
    onDragStart,
    onDragMove,
    onDragEnd,
    resetZoom,
  };
};
