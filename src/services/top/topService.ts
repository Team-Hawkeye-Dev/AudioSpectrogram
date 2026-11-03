import type { SoundDataResponse } from '../soundData.types';
import { createDemoRecordingTimes } from '../utils/demoRecordingTimes';
import { generateRandomSoundData } from '../utils/randomSoundData';
import { TOP_DEMO_PICKING_LABEL_DATA } from './topDemoLabels';

const TOP_DEMO_START_DELAY_SECONDS = 0;

export const topService = {
  fetchSoundData: async (_request: { topGuid: string }): Promise<SoundDataResponse> => ({
    sessions: [{
      fileData: generateRandomSoundData(),
      pickingLabelData: TOP_DEMO_PICKING_LABEL_DATA,
      ...createDemoRecordingTimes(TOP_DEMO_START_DELAY_SECONDS),
    }],
  }),
};
