import { useCallback, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import type WindowedSpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram-windowed.js';
import { useTheme } from '@mui/material/styles';
import {
  DEFAULT_INITIAL_SCROLL_TIME,
  INITIAL_PLAYBACK_POSITION,
  TIME_AXIS_HEIGHT_PX,
  VISIBLE_WINDOW_SECONDS,
  type SpectrogramType,
} from '../consts/audioSpectrogram.consts';
import { createWaveSurferPlugins, DEFAULT_WAVESURFER_OPTIONS } from '../consts/audioSpectrogramPluginsSettings';
import type { AudioSpectrogramViewerProps, InitialView } from '../types/audioSpectrogram.types';
import { onSpectrogramPlayback, onSpectrogramReady, rerenderSpectrogramAtZoom } from '../utils/spectrogramActions';
import type { PlaybackPosition } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';
import { useMassiviAppStore } from '../../../../store/useStore';

export const useAudioSpectrogramViewer = (audioUrl: string | undefined, maxFrequencyHz: number, spectrogramPlotType: SpectrogramType): AudioSpectrogramViewerProps => {
  const theme = useTheme();
  const spectrogramContainerRef = useRef<HTMLDivElement | null>(null);
  const waveSurferInstanceRef = useRef<WaveSurfer | null>(null);
  const spectrogramPluginRef = useRef<WindowedSpectrogramPlugin | null>(null);
  const initialViewRef = useRef<InitialView | null>(null);

  const setSpectrogramAudioDuration = useMassiviAppStore((state) => state.anchorValidationSection.setSpectrogramAudioDuration)
  const setSpectrogramWindow = useMassiviAppStore((state) => state.anchorValidationSection.setSpectrogramWindow)

  const [isReadyAudio, setIsReadyAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState<PlaybackPosition>(INITIAL_PLAYBACK_POSITION);

  const setAudioDuration = useCallback(
    (audioDuration: number) => setSpectrogramAudioDuration(spectrogramPlotType, audioDuration),
    [setSpectrogramAudioDuration, spectrogramPlotType],
  );

  const applyZoomView = useCallback((view: InitialView, keepAutoScroll: boolean) => {
    const waveSurferInstance = waveSurferInstanceRef.current;
    const decodedAudio = waveSurferInstance?.getDecodedData()
    if (!waveSurferInstance || !decodedAudio) return;

    const { minPxPerSec, scrollTime } = view;
    const scrollOffsetPx = scrollTime * minPxPerSec
    waveSurferInstance.options.autoScroll = keepAutoScroll
    waveSurferInstance.zoom(minPxPerSec);
    waveSurferInstance.setScroll(scrollOffsetPx)
    rerenderSpectrogramAtZoom(spectrogramPluginRef.current, decodedAudio)
  }, []);

  const fitViewToShortAudio = useCallback((audioDuration: number) => {
    if (audioDuration >= VISIBLE_WINDOW_SECONDS) return;
    const containerWidth = spectrogramContainerRef.current?.clientWidth;
    if (!containerWidth) return;

    const fitView: InitialView = {
      minPxPerSec: containerWidth / audioDuration,
      scrollTime: DEFAULT_INITIAL_SCROLL_TIME,
    }
    initialViewRef.current = fitView;
    setSpectrogramWindow(spectrogramPlotType, {
      currentStartTime: DEFAULT_INITIAL_SCROLL_TIME,
      currentEndTime: audioDuration
    })
    applyZoomView(fitView, true)
  }, [spectrogramPlotType, setSpectrogramWindow, applyZoomView]);

  useEffect(() => {
    const spectrogramContainer = spectrogramContainerRef.current;
    if (!spectrogramContainer || !audioUrl) return;

    const containerWidth = spectrogramContainer.clientWidth;
    const containerHeight = spectrogramContainer.clientHeight - TIME_AXIS_HEIGHT_PX;

    const defaultView: InitialView = {
      minPxPerSec: containerWidth / VISIBLE_WINDOW_SECONDS,
      scrollTime: DEFAULT_INITIAL_SCROLL_TIME
    }
    initialViewRef.current = defaultView
    setSpectrogramWindow(spectrogramPlotType, {
      currentStartTime: DEFAULT_INITIAL_SCROLL_TIME,
      currentEndTime: VISIBLE_WINDOW_SECONDS
    })

    const { spectrogramPlugin, plugins } = createWaveSurferPlugins({
      containerHeight,
      maxFrequencyHz,
      theme
    })
    spectrogramPluginRef.current = spectrogramPlugin

    const waveSurfer = WaveSurfer.create({
      ...DEFAULT_WAVESURFER_OPTIONS,
      container: spectrogramContainer,
      url: audioUrl,
      minPxPerSec: defaultView.minPxPerSec,
      plugins,
    });

    onSpectrogramPlayback(waveSurfer, setIsPlaying, setPlaybackPosition);

    const cleanupSpectrogram = onSpectrogramReady(
      waveSurferInstanceRef,
      waveSurfer,
      setAudioDuration,
      setIsReadyAudio,
      fitViewToShortAudio
    )
    return () => {
      cleanupSpectrogram()
      spectrogramPluginRef.current = null
      setIsPlaying(false)
      setPlaybackPosition(INITIAL_PLAYBACK_POSITION)
    }
  }, [audioUrl, maxFrequencyHz, theme, spectrogramPlotType, setAudioDuration, setSpectrogramWindow, fitViewToShortAudio]);

  const togglePlay = useCallback(() => {
    void waveSurferInstanceRef.current?.playPause()
  }, []);

  return {
    spectrogramContainerRef,
    waveSurferInstanceRef,
    initialViewRef,
    spectrogramPlotType,
    isReadyAudio,
    isPlaying,
    togglePlay,
    playbackPosition,
    applyZoomView,
  };
};
