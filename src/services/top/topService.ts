import type { SoundDataResponse } from '../soundData.types';
import { generateRandomSoundData } from '../utils/randomSoundData';
import { TOP_DEMO_PICKING_LABEL_DATA } from './topDemoLabels';

export const topService = {
  fetchSoundData: async (_request: { topGuid: string }): Promise<SoundDataResponse> => ({
    sessions: [{ fileData: generateRandomSoundData(), pickingLabelData: TOP_DEMO_PICKING_LABEL_DATA }],
  }),
};
