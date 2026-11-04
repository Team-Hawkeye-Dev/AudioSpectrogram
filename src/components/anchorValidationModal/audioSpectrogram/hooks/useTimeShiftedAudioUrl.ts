import { skipToken, useQuery } from '@tanstack/react-query';
import type { SpectrogramType } from '../consts/audioSpectrogram.consts';
import { padAudioStart } from '../utils/padAudioStart';

export const useTimeShiftedAudioUrl = (
  spectrogramType: SpectrogramType,
  audioGuid: string | null,
  audioUrl: string | undefined,
  timeShift: number | undefined,
): string | undefined => {
  const { data } = useQuery({
    queryKey: ['timeShiftedAudioUrl', spectrogramType, audioGuid, timeShift],
    queryFn: audioUrl && timeShift !== undefined
      ? () => (timeShift > 0 ? padAudioStart(audioUrl, timeShift) : audioUrl)
      : skipToken,
    staleTime: Infinity,
  });
  return data;
};
