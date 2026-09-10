import { useCallback, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import type { InitialView } from './useSpectrgoramViewer';
import { useDragSelection } from './useDragSelection';
import { useWheelScroll } from './useWheelScroll';

interface UseZoomSelectionProps {
  containerRef: RefObject<HTMLDivElement | null>;
  waveSurferRef: RefObject<WaveSurfer | null>;
  initialViewRef: RefObject<InitialView | null>;
  audioDuration: number;
  isReadyAudio: boolean;
  applyZoomView: (view: InitialView, keepAutoScroll: boolean) => void;
}

export const useZoomSelection = ({
  containerRef,
  waveSurferRef,
  initialViewRef,
  audioDuration,
  isReadyAudio,
  applyZoomView,
}: UseZoomSelectionProps) => {
  const waveSurfer = waveSurferRef.current;
  const container = containerRef.current;
  const initialView = initialViewRef.current;
  const applyZoomViewRef = useRef(applyZoomView);
  applyZoomViewRef.current = applyZoomView;

  useWheelScroll({
    containerRef,
    waveSurferRef,
    audioDuration,
    isReadyAudio,
  });

  const minZoom = useMemo(() => {
    if (!initialView || !container) return initialView?.minPxPerSec ?? 0;
    
    return Math.max(initialView.minPxPerSec, container.clientWidth / audioDuration);
  }, [audioDuration, container, initialView]);

  const { selection, onDragStart, onDragMove, onDragEnd } = useDragSelection({
    containerRef,
    waveSurferRef,
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
