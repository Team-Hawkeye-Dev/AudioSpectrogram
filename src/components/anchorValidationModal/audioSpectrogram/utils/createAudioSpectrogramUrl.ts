const AUDIO_MIME_TYPE = 'audio/mpeg';

export const createAudioSpectrogramUrl = (base64Audio: string): string =>
  `data:${AUDIO_MIME_TYPE};base64,${base64Audio}`;