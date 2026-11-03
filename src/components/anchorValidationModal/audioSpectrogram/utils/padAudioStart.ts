import { DECODE_SAMPLE_RATE_HZ, PADDED_AUDIO_MIME_TYPE } from '../consts/audioSpectrogram.consts';

const WAV_HEADER_BYTES = 44;
const WAV_FLOAT_FORMAT = 3;
const MONO_CHANNELS = 1;
const BYTES_PER_SAMPLE = Float32Array.BYTES_PER_ELEMENT;

const createWavHeader = (sampleCount: number, sampleRate: number): DataView<ArrayBuffer> => {
  const header = new DataView(new ArrayBuffer(WAV_HEADER_BYTES));
  const dataBytes = sampleCount * BYTES_PER_SAMPLE;
  const writeText = (offset: number, text: string) =>
    [...text].forEach((char, index) => header.setUint8(offset + index, char.charCodeAt(0)));

  writeText(0, 'RIFF');
  header.setUint32(4, WAV_HEADER_BYTES - 8 + dataBytes, true);
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  header.setUint32(16, 16, true);
  header.setUint16(20, WAV_FLOAT_FORMAT, true);
  header.setUint16(22, MONO_CHANNELS, true);
  header.setUint32(24, sampleRate, true);
  header.setUint32(28, sampleRate * BYTES_PER_SAMPLE, true);
  header.setUint16(32, BYTES_PER_SAMPLE, true);
  header.setUint16(34, BYTES_PER_SAMPLE * 8, true);
  writeText(36, 'data');
  header.setUint32(40, dataBytes, true);
  return header;
};

export const padAudioStart = async (audioUrl: string, paddingSeconds: number): Promise<string> => {
  const audioData = await (await fetch(audioUrl)).arrayBuffer();
  const audio = await new OfflineAudioContext(MONO_CHANNELS, 1, DECODE_SAMPLE_RATE_HZ).decodeAudioData(audioData);
  const paddingSamples = Math.round(paddingSeconds * audio.sampleRate);
  const samples = new Float32Array(paddingSamples + audio.length);
  samples.set(audio.getChannelData(0), paddingSamples);

  const wav = new Blob([createWavHeader(samples.length, audio.sampleRate), samples], { type: PADDED_AUDIO_MIME_TYPE });
  return URL.createObjectURL(wav);
};
