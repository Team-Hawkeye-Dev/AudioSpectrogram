import type { RefObject } from 'react';
import type WaveSurfer from 'wavesurfer.js';
import { VISIBLE_WINDOW_SECONDS } from '../consts/audioSpectrogram.consts';
import type { AudioSpectrogramTimelineControls } from '../../../../core/components/spectrogram/audioSpectrogramViewer/types';

export const createTimelineControls = (
  waveSurferInstanceRef: RefObject<WaveSurfer | null>,
  timelineStartMs: number | undefined,
  timeShift: number,
): AudioSpectrogramTimelineControls | undefined => {
  if (timelineStartMs === undefined) return undefined;

  const isRecordingStartOutOfView = timeShift > VISIBLE_WINDOW_SECONDS;
  return {
    timelineStartMs,
    recordingStartOffsetSeconds: timeShift,
    goToRecordingStart: isRecordingStartOutOfView ? () => waveSurferInstanceRef.current?.setTime(timeShift) : undefined,
  };
};
