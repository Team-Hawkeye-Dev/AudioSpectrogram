import { useCallback, useEffect, useRef } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import type { Region } from 'wavesurfer.js/dist/plugins/regions.js';
import { SPECTROGRAM_LABELS } from '../consts/audioSpectrogram.consts';
import type { UseLabelRegionsProps } from '../types/audioSpectrogram.types';
import type { AudioSpectrogramDetectionControls } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import { onWaveSurferPlay, scrollRegionIntoView } from '../utils/spectrogramActions';

// Shows the labels (detections) as regions. Moving between detections plays only that part of the audio
// on its own audio element, so the progress line stays where it is
export const useLabelRegions = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  regionsPluginRef,
  audioUrl,
  spectrogramPlotType,
  isReadyAudio,
}: UseLabelRegionsProps): AudioSpectrogramDetectionControls => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const labelAudioRef = useRef<HTMLAudioElement | null>(null);
  const labelsRef = useRef<Region[]>([]);
  const playingShadeRef = useRef<Region | null>(null);
  const detectionIndexRef = useRef<number | null>(null);

  const stopLabelAudio = useCallback(() => {
    labelAudioRef.current?.pause();
    playingShadeRef.current?.remove();
    playingShadeRef.current = null;
  }, []);

  const playLabelAudio = useCallback(async (label: Region) => {
    const waveSurfer = waveSurferInstanceRef.current;
    const regionsPlugin = regionsPluginRef.current;
    const labelAudio = labelAudioRef.current;
    if (!waveSurfer || !regionsPlugin || !labelAudio) return;

    stopLabelAudio();
    waveSurfer.pause();
    scrollRegionIntoView(waveSurfer, label, spectrogramContainerRef.current?.clientWidth ?? 0);
    labelAudio.currentTime = label.start;
    await labelAudio.play();

    const playingShade = regionsPlugin.addRegion({
      start: label.start,
      end: label.end,
      color: alpha(theme.palette.success.light, 0.45),
      drag: false,
      resize: false,
    });
    playingShadeRef.current = playingShade;

    // Reveals the shade from left to right over the label duration
    const sweep = playingShade.element?.animate(
      [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
      { duration: (label.end - label.start) * 1000, easing: 'linear' },
    );
    await sweep?.finished;

    const isStillPlayingThisLabel = playingShadeRef.current === playingShade;
    if (isStillPlayingThisLabel) stopLabelAudio();
  }, [theme, stopLabelAudio, waveSurferInstanceRef, regionsPluginRef, spectrogramContainerRef]);

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    const regionsPlugin = regionsPluginRef.current;
    if (!isReadyAudio || !waveSurfer || !regionsPlugin || !audioUrl) return;

    labelAudioRef.current = new Audio(audioUrl);
    labelsRef.current = SPECTROGRAM_LABELS[spectrogramPlotType]
      .toSorted((first, second) => first.startTime - second.startTime)
      .map(({ startTime, endTime }) =>
        regionsPlugin.addRegion({
          start: startTime,
          end: endTime,
          color: alpha(theme.palette.success.main, 0.3),
          drag: false,
          resize: false,
        }),
      );

    const unsubscribeFromPlay = onWaveSurferPlay(waveSurfer, stopLabelAudio);

    return () => {
      unsubscribeFromPlay();
      stopLabelAudio();
      regionsPlugin.clearRegions();
      labelsRef.current = [];
      labelAudioRef.current = null;
      detectionIndexRef.current = null;
    };
  }, [isReadyAudio, audioUrl, spectrogramPlotType, theme, stopLabelAudio, waveSurferInstanceRef, regionsPluginRef]);

  const goToDetection = useCallback((detectionIndex: number) => {
    const label = labelsRef.current[detectionIndex];
    if (!label) return;
    detectionIndexRef.current = detectionIndex;
    void playLabelAudio(label);
  }, [playLabelAudio]);

  const goToFirstDetection = useCallback(() => goToDetection(0), [goToDetection]);

  const goToNextDetection = useCallback(() => {
    const nextIndex = (detectionIndexRef.current ?? -1) + 1;
    const isAfterLastDetection = nextIndex >= labelsRef.current.length;
    if (isAfterLastDetection) {
      enqueueSnackbar('This is the last detection', { variant: 'info', preventDuplicate: true });
      return;
    }
    goToDetection(nextIndex);
  }, [goToDetection, enqueueSnackbar]);

  const goToPreviousDetection = useCallback(() => {
    const previousIndex = (detectionIndexRef.current ?? 0) - 1;
    const isBeforeFirstDetection = previousIndex < 0;
    if (isBeforeFirstDetection) {
      enqueueSnackbar('This is the first detection', { variant: 'info', preventDuplicate: true });
      return;
    }
    goToDetection(previousIndex);
  }, [goToDetection, enqueueSnackbar]);

  return { goToFirstDetection, goToPreviousDetection, goToNextDetection };
};
