import { useEffect, type RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { useSnackbar } from 'notistack';
import { SYNC_TOLERANCE_PX } from '../consts/audioSpectrogram.consts';
import { setWaveSurferScrollCallback, setWaveSurferZoomCallback } from '../utils/spectrogramActions';
import type { InitialView } from '../types/audioSpectrogram.types';
import type { AudioSpectrogramSyncControls } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import type { SyncedSpectrogramView } from '../../../../store/slices/anchorValidationSectionSlice';
import { useMassiviAppStore } from '../../../../store/useStore';

interface UseSpectrogramSyncProps {
  waveSurferInstanceRef: RefObject<WaveSurfer | null>;
  isReadyAudio: boolean;
  applyZoomView: (view: InitialView) => void;
  resetZoom: () => void;
}

const isOutOfSync = (differencePx: number) => Math.abs(differencePx) >= SYNC_TOLERANCE_PX;

const getVisibleView = (waveSurfer: WaveSurfer): SyncedSpectrogramView => {
  const pxPerSec = waveSurfer.options.minPxPerSec;
  const visibleWidthPx = waveSurfer.getWidth();
  const startTime = waveSurfer.getScroll() / pxPerSec;
  const visibleSeconds = visibleWidthPx / pxPerSec;

  return { startTime, visibleSeconds };
};

const followSyncedView = (waveSurfer: WaveSurfer, syncedView: SyncedSpectrogramView, applyZoomView: (view: InitialView) => void) => {
  const currentPxPerSec = waveSurfer.options.minPxPerSec;
  const currentScrollPx = waveSurfer.getScroll();
  const visibleWidthPx = waveSurfer.getWidth();

  const targetPxPerSec = visibleWidthPx / syncedView.visibleSeconds;
  const targetScrollPx = syncedView.startTime * targetPxPerSec;
  const zoomDifferencePx = (targetPxPerSec - currentPxPerSec) * syncedView.visibleSeconds;
  const scrollDifferencePx = targetScrollPx - currentScrollPx;

  if (isOutOfSync(zoomDifferencePx)) {
    applyZoomView({ minPxPerSec: targetPxPerSec, scrollTime: syncedView.startTime });
    return;
  }
  if (isOutOfSync(scrollDifferencePx)) waveSurfer.setScroll(targetScrollPx);
};

export const useSpectrogramSync = ({
  waveSurferInstanceRef,
  isReadyAudio,
  applyZoomView,
  resetZoom,
}: UseSpectrogramSyncProps): AudioSpectrogramSyncControls => {
  const { enqueueSnackbar } = useSnackbar();
  const isSynced = useMassiviAppStore((state) => state.anchorValidationSection.isSpectrogramSyncEnabled);
  const setIsSynced = useMassiviAppStore((state) => state.anchorValidationSection.setIsSpectrogramSyncEnabled);
  const syncedView = useMassiviAppStore((state) => state.anchorValidationSection.syncedSpectrogramView);
  const setSyncedView = useMassiviAppStore((state) => state.anchorValidationSection.setSyncedSpectrogramView);
  const isSyncActive = isSynced && isReadyAudio;

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    if (!isSyncActive || !waveSurfer) return;

    let frame = 0;
    const shareVisibleView = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setSyncedView(getVisibleView(waveSurfer)));
    } 
    const unsubscribeScroll = setWaveSurferScrollCallback(waveSurfer, shareVisibleView);
    const unsubscribeZoom = setWaveSurferZoomCallback(waveSurfer, shareVisibleView);

    return () => {
      cancelAnimationFrame(frame)
      unsubscribeScroll();
      unsubscribeZoom();
    };
  }, [isSyncActive, waveSurferInstanceRef, setSyncedView]);

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    if (!isSyncActive || !waveSurfer || !syncedView) return;

    followSyncedView(waveSurfer, syncedView, applyZoomView);
  }, [isSyncActive, syncedView, waveSurferInstanceRef, applyZoomView]);

  const enableSync = () => {
    setIsSynced(true);
    resetZoom();
    const waveSurfer = waveSurferInstanceRef.current;
    if (waveSurfer) setSyncedView(getVisibleView(waveSurfer));
    enqueueSnackbar({
      variant: 'info',
      message: 'Spectrograms are synced now',
      preventDuplicate: true
    });
  };

  const disableSync = () => {
    setIsSynced(false);
      enqueueSnackbar({
      variant: 'info',
      message: 'Spectrograms are no longer synced',
      preventDuplicate: true
    });
  };

  return { isSynced, toggleSync: isSynced ? disableSync : enableSync };
};
