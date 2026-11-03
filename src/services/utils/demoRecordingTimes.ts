import { DURATION_SECONDS } from './randomSoundData';

const DEMO_RECORDING_START_HOUR = 10;
const DEMO_RECORDING_START_MINUTE = 15;
const MS_PER_SECOND = 1000;

export const createDemoRecordingTimes = (startDelaySeconds: number) => {
  const startTime = new Date();
  startTime.setHours(DEMO_RECORDING_START_HOUR, DEMO_RECORDING_START_MINUTE, startDelaySeconds, 0);
  const endTime = new Date(startTime.getTime() + DURATION_SECONDS * MS_PER_SECOND);
  return { startTime: startTime.toISOString(), endTime: endTime.toISOString() };
};
