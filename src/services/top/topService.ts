import type { SoundDataResponse } from '../soundData.types';
import { generateRandomSoundData } from '../utils/randomSoundData';

export const topService = {
  fetchSoundData: async (_request: { topGuid: string }): Promise<SoundDataResponse> => ({
    sessions: [{ fileData: generateRandomSoundData() }],
  }),
};
