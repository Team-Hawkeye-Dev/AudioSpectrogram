import type { SoundDataResponse } from '../soundData.types';
import { createDemoRecordingTimes } from '../utils/demoRecordingTimes';
import { generateRandomSoundData } from '../utils/randomSoundData';
import { BOTTOM_DEMO_PICKING_LABEL_DATA } from './bottomDemoLabels';

const BOTTOM_DEMO_START_DELAY_SECONDS = 10;

export const bottomService = {
  fetchSoundData: async (_request: { bottomGuid: string }): Promise<SoundDataResponse> => ({
    sessions: [{
      fileData: generateRandomSoundData(),
      pickingLabelData: BOTTOM_DEMO_PICKING_LABEL_DATA,
      ...createDemoRecordingTimes(BOTTOM_DEMO_START_DELAY_SECONDS),
    }],
  }),
};
