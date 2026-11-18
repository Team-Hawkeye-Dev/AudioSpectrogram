export interface SoundSession {
  fileData: string;
  pickingLabelData: string;
}

export interface SoundDataResponse {
  sessions: SoundSession[];
}
