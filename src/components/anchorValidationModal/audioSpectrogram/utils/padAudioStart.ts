import Decoder from 'wavesurfer.js/dist/decoder.js';
import { DECODE_SAMPLE_RATE_HZ } from '../consts/audioSpectrogram.consts';
import { encodeWav } from './encodeWav';

export const padAudioStart = async (audioUrl: string, paddingSeconds: number): Promise<string> => {
  const audioData = await (await fetch(audioUrl)).arrayBuffer();
  const audio = await Decoder.decode(audioData, DECODE_SAMPLE_RATE_HZ);

  const paddingSamples = Math.round(paddingSeconds * audio.sampleRate);
  const paddedAudio = new AudioBuffer({ length: paddingSamples + audio.length, sampleRate: audio.sampleRate });
  paddedAudio.copyToChannel(audio.getChannelData(0), 0, paddingSamples);

  return URL.createObjectURL(encodeWav(paddedAudio));
};
