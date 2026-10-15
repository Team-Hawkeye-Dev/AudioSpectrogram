import type { SoundDataResponse } from '../soundData.types';
import { generateRandomSoundData } from '../utils/randomSoundData';

export const bottomService = {
  fetchSoundData: async (_request: { bottomGuid: string }): Promise<SoundDataResponse> => ({
    sessions: [{ fileData: generateRandomSoundData() }],
  }),
};
