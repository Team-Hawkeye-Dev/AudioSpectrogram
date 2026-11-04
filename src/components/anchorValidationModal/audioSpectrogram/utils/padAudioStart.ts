import Decoder from 'wavesurfer.js/dist/decoder.js';
import { DECODE_SAMPLE_RATE_HZ, PADDED_AUDIO_MIME_TYPE } from '../consts/audioSpectrogram.consts';

const WAV_HEADER_BYTES = 44;
const RIFF_CHUNK_HEADER_BYTES = 8;
const FMT_CHUNK_BYTES = 16;
const WAV_FLOAT_FORMAT = 3;
const MONO_CHANNELS = 1;
const BYTES_PER_SAMPLE = Float32Array.BYTES_PER_ELEMENT;
const BITS_PER_BYTE = 8;

const uint16 = (value: number) => new Uint16Array([value]);
const uint32 = (value: number) => new Uint32Array([value]);

const createWavBlob = (samples: Float32Array<ArrayBuffer>, sampleRate: number): Blob =>
  new Blob([
    'RIFF', uint32(WAV_HEADER_BYTES - RIFF_CHUNK_HEADER_BYTES + samples.byteLength), 'WAVE',
    'fmt ', uint32(FMT_CHUNK_BYTES), uint16(WAV_FLOAT_FORMAT), uint16(MONO_CHANNELS),
    uint32(sampleRate), uint32(sampleRate * BYTES_PER_SAMPLE), uint16(BYTES_PER_SAMPLE), uint16(BYTES_PER_SAMPLE * BITS_PER_BYTE),
    'data', uint32(samples.byteLength),
    samples,
  ], { type: PADDED_AUDIO_MIME_TYPE });

export const padAudioStart = async (audioUrl: string, paddingSeconds: number): Promise<string> => {
  const audioData = await (await fetch(audioUrl)).arrayBuffer();
  const audio = await Decoder.decode(audioData, DECODE_SAMPLE_RATE_HZ);
  const paddingSamples = Math.round(paddingSeconds * audio.sampleRate);
  const samples = new Float32Array(paddingSamples + audio.length);
  samples.set(audio.getChannelData(0), paddingSamples);
  return URL.createObjectURL(createWavBlob(samples, audio.sampleRate));
};
