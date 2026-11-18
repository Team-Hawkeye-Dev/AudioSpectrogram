import { useEffect } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { useSnackbar } from 'notistack';
import { SYNC_TOLERANCE_PX } from '../consts/audioSpectrogram.consts';
import { setWaveSurferScrollCallback, setWaveSurferZoomCallback } from '../utils/spectrogramActions';
import type { ZoomSelectionProps } from '../types/audioSpectrogram.types';
import type { AudioSpectrogramSyncControls } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import type { SyncedSpectrogramView } from '../../../../store/slices/anchorValidationSectionSlice';
import { useMassiviAppStore } from '../../../../store/useStore';

interface UseSpectrogramSyncProps
  extends Pick<ZoomSelectionProps, 'spectrogramContainerRef' | 'waveSurferInstanceRef' | 'isReadyAudio' | 'applyZoomView'> {
  resetZoom: () => void;
}

interface FollowSyncedViewParams extends Pick<ZoomSelectionProps, 'applyZoomView'> {
  waveSurfer: WaveSurfer;
  containerWidth: number;
  syncedView: SyncedSpectrogramView;
}

const SNACKBAR_OPTIONS = { variant: 'info', preventDuplicate: true } as const;

const isOutOfSync = (differencePx: number) => Math.abs(differencePx) >= SYNC_TOLERANCE_PX;

const getVisibleView = (waveSurfer: WaveSurfer, containerWidth: number): SyncedSpectrogramView => {
  const pxPerSec = waveSurfer.options.minPxPerSec;
  const startTime = waveSurfer.getScroll() / pxPerSec;
  const visibleSeconds = containerWidth / pxPerSec;

  return { startTime, visibleSeconds };
};

const followSyncedView = ({ waveSurfer, containerWidth, syncedView, applyZoomView }: FollowSyncedViewParams) => {
  const targetPxPerSec = containerWidth / syncedView.visibleSeconds;
  const targetScrollPx = syncedView.startTime * targetPxPerSec;
  const zoomDifferencePx = (targetPxPerSec - waveSurfer.options.minPxPerSec) * syncedView.visibleSeconds;
  const scrollDifferencePx = targetScrollPx - waveSurfer.getScroll();

  if (isOutOfSync(zoomDifferencePx)) {
    applyZoomView({ minPxPerSec: targetPxPerSec, scrollTime: syncedView.startTime });
    return;
  }
  if (isOutOfSync(scrollDifferencePx)) waveSurfer.setScroll(targetScrollPx);
};

export const useSpectrogramSync = ({
  spectrogramContainerRef,
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

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    const container = spectrogramContainerRef.current;
    if (!isSynced || !isReadyAudio || !waveSurfer || !container) return;

    const shareView = () => requestAnimationFrame(() => setSyncedView(getVisibleView(waveSurfer, container.clientWidth)));
    const unsubscribeScroll = setWaveSurferScrollCallback(waveSurfer, shareView);
    const unsubscribeZoom = setWaveSurferZoomCallback(waveSurfer, shareView);

    return () => {
      unsubscribeScroll();
      unsubscribeZoom();
    };
  }, [isSynced, isReadyAudio, spectrogramContainerRef, waveSurferInstanceRef, setSyncedView]);

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    const container = spectrogramContainerRef.current;
    if (!isSynced || !isReadyAudio || !syncedView || !waveSurfer || !container) return;

    followSyncedView({ waveSurfer, containerWidth: container.clientWidth, syncedView, applyZoomView });
  }, [isSynced, isReadyAudio, syncedView, spectrogramContainerRef, waveSurferInstanceRef, applyZoomView]);

  const resetAndShareView = () => {
    resetZoom();
    const waveSurfer = waveSurferInstanceRef.current;
    const container = spectrogramContainerRef.current;
    if (waveSurfer && container) setSyncedView(getVisibleView(waveSurfer, container.clientWidth));
  };

  const enableSync = () => {
    setIsSynced(true);
    resetAndShareView();
    enqueueSnackbar('Spectrograms are synced now', SNACKBAR_OPTIONS);
  };

  const disableSync = () => {
    setIsSynced(false);
    enqueueSnackbar('Spectrograms are no longer synced', SNACKBAR_OPTIONS);
  };

  return { isSynced, toggleSync: isSynced ? disableSync : enableSync };
};
