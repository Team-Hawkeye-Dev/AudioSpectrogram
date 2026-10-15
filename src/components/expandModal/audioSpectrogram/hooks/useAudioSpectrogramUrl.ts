import { useQuery } from '@tanstack/react-query';
import { SpectrogramType } from '../consts/audioSpectrogram.consts';
import { topService } from '../../../../services/top/topService';
import { bottomService } from '../../../../services/bottom/bottomService';

const AUDIO_MIME_TYPE = 'audio/wav';

const createAudioSpectrogramUrl = (base64Audio: string): string =>
  `data:${AUDIO_MIME_TYPE};base64,${base64Audio}`;

const fetchSoundData = (audioGuid: string, spectrogramType: SpectrogramType) =>
  spectrogramType === SpectrogramType.BOTTOM
    ? bottomService.fetchSoundData({ bottomGuid: audioGuid })
    : topService.fetchSoundData({ topGuid: audioGuid });

export const useAudioSpectrogramUrl = (
  audioGuid: string | null,
  spectrogramType: SpectrogramType,
): string | undefined => {
  const { data: url } = useQuery({
    queryKey: ['audioSpectrogramUrl', spectrogramType, audioGuid],
    queryFn: async () => {
      if (!audioGuid) return undefined;
      const soundData = await fetchSoundData(audioGuid, spectrogramType);
      const fileData = soundData.sessions[0]?.fileData;
      return fileData ? createAudioSpectrogramUrl(fileData) : undefined;
    },
    enabled: !!audioGuid,
  });

  return url;
};
