import { MAX_ALIGNMENT_GAP_SECONDS } from '../consts/audioSpectrogram.consts';
import type { SpectrogramTimeline } from '../types/audioSpectrogram.types';
import { MS_PER_SECOND } from '../../../../core/components/spectrogram/audioSpectrogramViewer/consts';

export const createSpectrogramTimeline = (
  recordingStartTimeMs: number | undefined,
  earliestStartTimeMs: number | undefined,
): SpectrogramTimeline | undefined => {
  if (recordingStartTimeMs === undefined || earliestStartTimeMs === undefined) return undefined;

  const gapSeconds = (recordingStartTimeMs - earliestStartTimeMs) / MS_PER_SECOND;
  const recordingStartTime = gapSeconds <= MAX_ALIGNMENT_GAP_SECONDS ? gapSeconds : 0;
  return {
    timelineStartMs: recordingStartTimeMs - recordingStartTime * MS_PER_SECOND,
    recordingStartTime,
  };
};
