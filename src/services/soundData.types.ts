export interface SoundSession {
  fileData: string;
  pickingLabelData: string;
  startTime: string;
  endTime: string;
}

export interface SoundDataResponse {
  sessions: SoundSession[];
}
