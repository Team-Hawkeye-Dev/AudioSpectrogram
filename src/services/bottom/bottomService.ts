import type { SoundDataResponse } from '../soundData.types';
import { generateRandomSoundData } from '../utils/randomSoundData';
import { BOTTOM_DEMO_PICKING_LABEL_DATA } from './bottomDemoLabels';

export const bottomService = {
  fetchSoundData: async (_request: { bottomGuid: string }): Promise<SoundDataResponse> => ({
    sessions: [{ fileData: generateRandomSoundData(), pickingLabelData: BOTTOM_DEMO_PICKING_LABEL_DATA }],
  }),
};
