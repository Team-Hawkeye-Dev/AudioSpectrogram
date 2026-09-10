import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
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
} from '../consts/spectrogram.consts';
import { formatXAxisTimestamp } from '../utils/formatXaxisTimestamp';

export interface InitialView {
  minPxPerSec: number;
  scrollTime: number;
}

interface UseSpectrogramViewerProps {
  containerRef: RefObject<HTMLDivElement | null>;
  waveSurferRef: RefObject<WaveSurfer | null>;
  initialViewRef: RefObject<InitialView | null>;
  audioDuration: number;
  isReadyAudio: boolean;
  applyZoomView: (view: InitialView, keepAutoScroll: boolean) => void;
}

export const useSpectrogramViewer = (audioUrl: string, maxFrequencyHz: number): UseSpectrogramViewerProps => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const initialViewRef = useRef<InitialView | null>(null);

  const [audioDuration, setAudioDuration] = useState(0);
  const [isReadyAudio, setIsReadyAudio] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
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
      container: containerRef.current,
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

    waveSurferRef.current = waveSurfer;
    waveSurfer.on('ready', (readyAudioDuration) => {
      setAudioDuration(readyAudioDuration);
      setIsReadyAudio(true);
    });

    return () => {
      waveSurfer.destroy();
      waveSurferRef.current = null;
      setIsReadyAudio(false);
      setAudioDuration(0);
    };
  }, [audioUrl, maxFrequencyHz, theme]);

  const applyZoomView = useCallback((view: InitialView, keepAutoScroll: boolean) => {
    const waveSurfer = waveSurferRef.current;
    if (!waveSurfer) {
      return;
    }

    const { minPxPerSec, scrollTime } = view;
    waveSurfer.setOptions({ autoScroll: keepAutoScroll });
    waveSurfer.zoom(minPxPerSec);
    waveSurfer.setScrollTime(scrollTime);
  }, []);

  return {
    containerRef,
    waveSurferRef,
    initialViewRef,
    audioDuration,
    isReadyAudio,
    applyZoomView,
  };
};
