import { useQuery } from '@tanstack/react-query';
import { SpectrogramType } from '../consts/audioSpectrogram.consts';
import { topService } from '../../../../services/top/topService';
import { bottomService } from '../../../../services/bottom/bottomService';
import { createAudioSpectrogramUrl } from '../utils/createAudioSpectrogramUrl';
import type { AudioSPectrogramUrlData } from '../types/audioSpectrogram.types';

export type AudioSpectrogramUrlStatus = {
  audioUrl: string | undefined;
  pickingLabelData: string | undefined;
  recordingStartTimeMs: number | undefined;
  isFetching: boolean,
  isLoading: boolean,
  error: Error | null
}

const fetchSoundData = (audioGuid: string, spectrogramType: SpectrogramType) =>
  spectrogramType === SpectrogramType.BOTTOM
    ? bottomService.fetchSoundData({ bottomGuid: audioGuid })
    : topService.fetchSoundData({ topGuid: audioGuid });

export const useAudioSpectrogramUrl = (
  audioGuid: string | null,
  spectrogramType: SpectrogramType,
): AudioSpectrogramUrlStatus => {
  const { data, isFetching, isLoading, error } = useQuery({
    queryKey: ['audioSpectrogramUrl', spectrogramType, audioGuid],
    queryFn: async (): Promise<AudioSPectrogramUrlData | undefined> => {
      if (!audioGuid) return undefined;
      const soundData = await fetchSoundData(audioGuid, spectrogramType);
      const session = soundData.sessions[0];
      if (!session) return undefined;
      return {
        audioUrl: createAudioSpectrogramUrl(session.fileData),
        pickingLabelData: session.pickingLabelData,
        recordingStartTimeMs: Date.parse(session.startTime),
      };
    },
    enabled: !!audioGuid,
  });

  return {
    audioUrl: data?.audioUrl,
    pickingLabelData: data?.pickingLabelData,
    recordingStartTimeMs: data?.recordingStartTimeMs,
    isFetching,
    isLoading,
    error,
  };
};
