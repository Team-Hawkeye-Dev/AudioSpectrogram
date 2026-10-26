import { useCallback, useEffect, useRef } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import type { Region } from 'wavesurfer.js/dist/plugins/regions.js';
import { PICKING_LABEL_FIELD_SEPARATOR, PICKING_LABEL_LINE_SEPARATOR } from '../consts/audioSpectrogram.consts';
import type { SoundLabel, UseLabelRegionsProps } from '../types/audioSpectrogram.types';
import type { AudioSpectrogramDetectionControls } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import { onWaveSurferPlay, scrollRegionIntoView } from '../utils/spectrogramActions';

export const useLabelRegions = ({
  spectrogramContainerRef,
  waveSurferInstanceRef,
  regionsPluginRef,
  audioUrl,
  pickingLabelData,
  isReadyAudio,
}: UseLabelRegionsProps): AudioSpectrogramDetectionControls => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const labelAudioRef = useRef<HTMLAudioElement | null>(null);
  const labelsRef = useRef<Region[]>([]);
  const playingShadeRef = useRef<Region | null>(null);
  const detectionIndexRef = useRef(-1);

  const stopLabelAudio = useCallback(() => {
    labelAudioRef.current?.pause();
    playingShadeRef.current?.remove();
    playingShadeRef.current = null;
  }, []);

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    const regionsPlugin = regionsPluginRef.current;
    if (!isReadyAudio || !waveSurfer || !regionsPlugin || !audioUrl || !pickingLabelData) return;

    labelAudioRef.current = new Audio(audioUrl);
    labelsRef.current = pickingLabelData
      .trim()
      .split(PICKING_LABEL_LINE_SEPARATOR)
      .map((line): SoundLabel => {
        const [startTime, endTime] = line.split(PICKING_LABEL_FIELD_SEPARATOR).map(Number);
        return { startTime, endTime };
      })
      .sort((firstLabel, secondLabel) => firstLabel.startTime - secondLabel.startTime)
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
      detectionIndexRef.current = -1;
    };
  }, [isReadyAudio, audioUrl, pickingLabelData, theme, stopLabelAudio, waveSurferInstanceRef, regionsPluginRef]);

  const playLabel = async (label: Region) => {
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

    await playingShade.element?.animate(
      [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0)' }],
      { duration: (label.end - label.start) * 1000 },
    ).finished;

    if (playingShadeRef.current === playingShade) stopLabelAudio();
  };

  const goToDetection = (detectionIndex: number) => {
    if (detectionIndex < 0) {
      enqueueSnackbar('This is the first detection', { variant: 'info', preventDuplicate: true });
      return;
    }
    if (detectionIndex >= labelsRef.current.length) {
      enqueueSnackbar('This is the last detection', { variant: 'info', preventDuplicate: true });
      return;
    }
    detectionIndexRef.current = detectionIndex;
    void playLabel(labelsRef.current[detectionIndex]);
  };

  const goToFirstDetection = () => {
    waveSurferInstanceRef.current?.setScrollTime(0);
    goToDetection(0);
  };

  return {
    goToFirstDetection,
    goToPreviousDetection: () => goToDetection(detectionIndexRef.current - 1),
    goToNextDetection: () => goToDetection(detectionIndexRef.current + 1),
  };
};
