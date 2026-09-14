import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import WindowedSpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram-windowed.js';
import {
  DECODE_SAMPLE_RATE_HZ,
  FREQUENCY_MIN_HZ,
  SPECTROGRAM_FFT_SAMPLES,
  SPECTROGRAM_HEIGHT_PX,
  TIME_AXIS_HEIGHT_PX,
  TIME_AXIS_INTERVAL_SECONDS,
  VISIBLE_WINDOW_SECONDS,
} from '../consts/audioSpectrogram.consts';
import { formatXAxisTimestamp } from '../utils/formatXaxisTimestamp';
import type { AudioSpectrogramViewerProps, InitialView } from '../types/audioSpectrogram.types';
import { onSpectrogramReady } from '../utils/spectrogramActions';

export const useAudioSpectrogramViewer = (audioUrl: string, maxFrequencyHz: number): AudioSpectrogramViewerProps => {
  const theme = useTheme();
  const spectrogramContainerRef = useRef<HTMLDivElement | null>(null);
  const waveSurferInstanceRef = useRef<WaveSurfer | null>(null);
  const initialViewRef = useRef<InitialView | null>(null);

  const [audioDuration, setAudioDuration] = useState(0);
  const [isReadyAudio, setIsReadyAudio] = useState(false);

  useEffect(() => {
     const container = spectrogramContainerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const initialPxPerSec = containerWidth / VISIBLE_WINDOW_SECONDS;
    initialViewRef.current = { minPxPerSec: initialPxPerSec, scrollTime: 0 };

    const spectrogramPlugin = WindowedSpectrogramPlugin.create({
      height: SPECTROGRAM_HEIGHT_PX,
      frequencyMin: FREQUENCY_MIN_HZ,
      frequencyMax: maxFrequencyHz,
      fftSamples: SPECTROGRAM_FFT_SAMPLES,
      colorMap: 'roseus',
      scale: 'linear',
      progressiveLoading: false,
      labels: false,
    });

    const timeLinePlugin = TimelinePlugin.create({
      height: TIME_AXIS_HEIGHT_PX,
      timeInterval: TIME_AXIS_INTERVAL_SECONDS,
      primaryLabelInterval: TIME_AXIS_INTERVAL_SECONDS,
      formatTimeCallback: (seconds) => formatXAxisTimestamp(seconds),
      style: {
        fontSize: '12px',
        background: theme.palette.background.default,
        color: theme.palette.text.secondary,
      },
    });

    const waveSurfer = WaveSurfer.create({
      container: container,
      url: audioUrl,
      sampleRate: DECODE_SAMPLE_RATE_HZ,
      height: 0,
      minPxPerSec: initialPxPerSec,
      interact: false,
      dragToSeek: false,
      autoScroll: true,
      autoCenter: false,
      hideScrollbar: true,
      plugins: [spectrogramPlugin, timeLinePlugin],
    });

    return onSpectrogramReady(waveSurferInstanceRef, waveSurfer, setAudioDuration, setIsReadyAudio);
  }, [audioUrl, maxFrequencyHz, theme]);

  const applyZoomView = useCallback((view: InitialView, keepAutoScroll: boolean) => {
    const waveSurfer = waveSurferInstanceRef.current;
    if (!waveSurfer) {
      return;
    }

    const { minPxPerSec, scrollTime } = view;
    waveSurfer.setOptions({ autoScroll: keepAutoScroll });
    waveSurfer.zoom(minPxPerSec);
    waveSurfer.setScrollTime(scrollTime);
  }, []);

  return {
    spectrogramContainerRef,
    waveSurferInstanceRef,
    initialViewRef,
    audioDuration,
    isReadyAudio,
    applyZoomView,
  };
};
