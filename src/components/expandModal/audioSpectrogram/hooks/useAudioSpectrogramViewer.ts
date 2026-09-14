import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import WindowedSpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram-windowed.js';
import {
  DECODE_SAMPLE_RATE_HZ,
  FREQUENCY_MIN_HZ,
  SECONDS_PER_MINUTE,
  SPECTROGRAM_FFT_SAMPLES,
  TIME_AXIS_HEIGHT_PX,
  TIME_AXIS_INTERVAL_SECONDS,
  TIMESTAMP_SECONDS_PAD_CHAR,
  TIMESTAMP_SECONDS_PAD_LENGTH,
  VISIBLE_WINDOW_SECONDS,
  ZOOM_DEBOUNCE_MS,
} from '../consts/audioSpectrogram.consts';
import type { AudioSpectrogramViewerProps, InitialView } from '../types/audioSpectrogram.types';
import { onSpectrogramReady } from '../utils/spectrogramActions';

export const useAudioSpectrogramViewer = (audioUrl: string, maxFrequencyHz: number): AudioSpectrogramViewerProps => {
  const theme = useTheme();
  const spectrogramContainerRef = useRef<HTMLDivElement | null>(null);
  const waveSurferInstanceRef = useRef<WaveSurfer | null>(null);
  const initialViewRef = useRef<InitialView | null>(null);

  const [audioDuration, setAudioDuration] = useState(0);
  const [isReadyAudio, setIsReadyAudio] = useState(false);

  const zoomDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
     const container = spectrogramContainerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const initialPxPerSec = containerWidth / VISIBLE_WINDOW_SECONDS;
    initialViewRef.current = { minPxPerSec: initialPxPerSec, scrollTime: 0 };

    const spectrogramPlugin = WindowedSpectrogramPlugin.create({
      height: containerHeight,
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
      formatTimeCallback: (seconds) => {
        const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
        const secs = Math.floor(seconds % SECONDS_PER_MINUTE);
        return `${mins}:${secs.toString().padStart(TIMESTAMP_SECONDS_PAD_LENGTH, TIMESTAMP_SECONDS_PAD_CHAR)}`;
      },
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

    const cleanupSpectrogram = onSpectrogramReady(waveSurferInstanceRef, waveSurfer, setAudioDuration, setIsReadyAudio);
    return () => {
      if (zoomDebounceTimeoutRef.current) {
        clearTimeout(zoomDebounceTimeoutRef.current);
      }
      cleanupSpectrogram();
    };
  }, [audioUrl, maxFrequencyHz, theme]);

  const applyZoomView = useCallback((view: InitialView, keepAutoScroll: boolean) => {
    if (zoomDebounceTimeoutRef.current) clearTimeout(zoomDebounceTimeoutRef.current);
    zoomDebounceTimeoutRef.current = setTimeout(() => {
      const waveSurfer = waveSurferInstanceRef.current;
      if (!waveSurfer) {
        return;
      }

      const { minPxPerSec, scrollTime } = view;
      waveSurfer.setOptions({ autoScroll: keepAutoScroll });
      waveSurfer.zoom(minPxPerSec);
      waveSurfer.setScrollTime(scrollTime);
    }, ZOOM_DEBOUNCE_MS);
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
