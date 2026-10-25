import { useEffect, useRef } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import type { Region } from 'wavesurfer.js/dist/plugins/regions.js';
import { MIDDLE_MOUSE_BUTTON, SPECTROGRAM_LABELS } from '../consts/audioSpectrogram.consts';
import type { UseLabelRegionsProps } from '../types/audioSpectrogram.types';


export const useLabelRegions = ({
  waveSurferInstanceRef,
  regionsPluginRef,
  audioUrl,
  spectrogramPlotType,
  isReadyAudio,
}: UseLabelRegionsProps) => {
  const theme = useTheme();
  const playingShadeRef = useRef<Region | null>(null);
  const animationFrameRef = useRef(0);

  useEffect(() => {
    const waveSurfer = waveSurferInstanceRef.current;
    const regionsPlugin = regionsPluginRef.current;
    if (!isReadyAudio || !waveSurfer || !regionsPlugin || !audioUrl) return;

    const labelAudio = new Audio(audioUrl);
    const labelColor = alpha(theme.palette.success.main, 0.3);
    const playingShadeColor = alpha(theme.palette.success.light, 0.45);

    const stopLabelAudio = () => {
      cancelAnimationFrame(animationFrameRef.current);
      labelAudio.pause();
      playingShadeRef.current?.remove();
      playingShadeRef.current = null;
    };

    const growPlayingShade = (label: Region) => {
      if (labelAudio.currentTime >= label.end) {
        stopLabelAudio();
        return;
      }
      playingShadeRef.current?.setOptions({ end: labelAudio.currentTime, color: playingShadeColor });
      animationFrameRef.current = requestAnimationFrame(() => growPlayingShade(label));
    };

    const playLabelAudio = async (label: Region) => {
      stopLabelAudio();
      waveSurfer.pause();
      labelAudio.currentTime = label.start;
      await labelAudio.play();
      playingShadeRef.current = regionsPlugin.addRegion({
        start: label.start,
        end: label.start,
        color: playingShadeColor,
        drag: false,
        resize: false,
      });
      growPlayingShade(label);
    };

    SPECTROGRAM_LABELS[spectrogramPlotType].forEach(({ startTime, endTime }) => {
      const label = regionsPlugin.addRegion({
        start: startTime,
        end: endTime,
        color: labelColor,
        drag: false,
        resize: false,
      });
      label.element?.addEventListener('mousedown', (event) => {
        if (event.button !== MIDDLE_MOUSE_BUTTON) return;
        event.preventDefault();
        void playLabelAudio(label);
      });
    });

    const unsubscribeFromPlay = waveSurfer.on('play', stopLabelAudio);

    return () => {
      unsubscribeFromPlay();
      stopLabelAudio();
      regionsPlugin.clearRegions();
    };
  }, [isReadyAudio, audioUrl, spectrogramPlotType, theme, waveSurferInstanceRef, regionsPluginRef]);
};
