export interface SoundSession {
  fileData: string;
}

export interface SoundDataResponse {
  sessions: SoundSession[];
}

export interface SoundLabel {
  startTime: number;
  endTime: number;
}
