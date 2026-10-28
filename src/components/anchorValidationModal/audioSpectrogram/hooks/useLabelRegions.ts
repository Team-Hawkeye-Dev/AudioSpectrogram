import { useCallback, useEffect, useRef, useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import type { Region } from 'wavesurfer.js/dist/plugins/regions.js';
import { PICKING_LABEL_FIELD_SEPARATOR, PICKING_LABEL_LINE_SEPARATOR } from '../consts/audioSpectrogram.consts';
import type { SoundLabel, UseLabelRegionsProps } from '../types/audioSpectrogram.types';
import type { AudioSpectrogramDetectionControls } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import { setWaveSurferPlayCallback, scrollRegionIntoView } from '../utils/spectrogramActions';
import type WaveSurfer from 'wavesurfer.js';

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
  const [currentDetectionIndex, setCurrentDetectionIndex] = useState<number>(-1);
  const savedAutoScrollRef = useRef<boolean | null>(null);

  const restoreAutoScroll = useCallback((waveSurfer: WaveSurfer) => {
    if (savedAutoScrollRef.current === null) return;
    waveSurfer.options.autoScroll = savedAutoScrollRef.current;
    savedAutoScrollRef.current = null;
  }, [waveSurferInstanceRef]);

  const stopLabelAudio = () => {
    labelAudioRef.current?.pause();
    playingShadeRef.current?.remove();
    playingShadeRef.current = null;
  };

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
    const unsubscribeFromPlay = setWaveSurferPlayCallback(waveSurfer, () => {
      stopLabelAudio();
      restoreAutoScroll(waveSurfer);
    });

    return () => {
      unsubscribeFromPlay();
      stopLabelAudio();
      restoreAutoScroll(waveSurfer)
      regionsPlugin.clearRegions();
      labelsRef.current = [];
      setCurrentDetectionIndex(-1);
    };
  }, [isReadyAudio, audioUrl, pickingLabelData, theme, stopLabelAudio, waveSurferInstanceRef, regionsPluginRef]);

  const playLabel = async (label: Region) => {
    const waveSurfer = waveSurferInstanceRef.current;
    const regionsPlugin = regionsPluginRef.current;
    const labelAudio = labelAudioRef.current;
    if (!waveSurfer || !regionsPlugin || !labelAudio) return;

    stopLabelAudio();
    waveSurfer.pause();
    restoreAutoScroll(waveSurfer)
    savedAutoScrollRef.current = waveSurfer.options.autoScroll;
    waveSurfer.options.autoScroll = false;
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

    if (playingShadeRef.current === playingShade) {
      stopLabelAudio();
      restoreAutoScroll(waveSurfer)
    }
  };

  const goToDetection = (detectionIndex: number) => {
    if (!labelsRef.current.length) {
      enqueueSnackbar('There are no detections', { variant: 'info', preventDuplicate: true });
      return;
    }
    if (detectionIndex < 0) {
      enqueueSnackbar('This is the first detection', { variant: 'info', preventDuplicate: true });
      return;
    }
    if (detectionIndex >= labelsRef.current.length) {
      enqueueSnackbar('This is the last detection', { variant: 'info', preventDuplicate: true });
      return;
    }
    setCurrentDetectionIndex(detectionIndex);
    void playLabel(labelsRef.current[detectionIndex]);
  };

  const goToFirstDetection = () => {
    const firstDetection = labelsRef.current[0]
    waveSurferInstanceRef.current?.setScrollTime(firstDetection.start);
    goToDetection(0);
  };

  return {
    goToFirstDetection,
    goToPreviousDetection: () => goToDetection(currentDetectionIndex - 1),
    goToNextDetection: () => goToDetection(currentDetectionIndex + 1),
  };
};
