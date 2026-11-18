const SAMPLE_RATE_HZ = 16000;
const DURATION_SECONDS = 120;
const TONE_DURATION_SECONDS = 0.5;
const MIN_TONE_HZ = 300;
const MAX_TONE_HZ = 3500;
const TONE_AMPLITUDE = 0.6;
const NOISE_AMPLITUDE = 0.05;

const BYTES_PER_SAMPLE = 2;
const WAV_HEADER_SIZE = 44;
const MAX_INT16 = 32767;
const BASE64_CHUNK_SIZE = 0x8000;

const writeWavHeader = (view: DataView, dataSize: number) => {
  const writeString = (offset: number, text: string) =>
    [...text].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));

  writeString(0, 'RIFF');
  view.setUint32(4, WAV_HEADER_SIZE - 8 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE_HZ, true);
  view.setUint32(28, SAMPLE_RATE_HZ * BYTES_PER_SAMPLE, true);
  view.setUint16(32, BYTES_PER_SAMPLE, true);
  view.setUint16(34, BYTES_PER_SAMPLE * 8, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
};

const toBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += BASE64_CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + BASE64_CHUNK_SIZE));
  }
  return btoa(binary);
};

// Random tones with a little background noise, returned as a base64 WAV file
export const generateRandomSoundData = (): string => {
  const sampleCount = SAMPLE_RATE_HZ * DURATION_SECONDS;
  const samplesPerTone = SAMPLE_RATE_HZ * TONE_DURATION_SECONDS;
  const dataSize = sampleCount * BYTES_PER_SAMPLE;
  const view = new DataView(new ArrayBuffer(WAV_HEADER_SIZE + dataSize));
  writeWavHeader(view, dataSize);

  let toneHz = MIN_TONE_HZ;
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    if (sampleIndex % samplesPerTone === 0) {
      toneHz = MIN_TONE_HZ + Math.random() * (MAX_TONE_HZ - MIN_TONE_HZ);
    }
    const tone = TONE_AMPLITUDE * Math.sin((2 * Math.PI * toneHz * sampleIndex) / SAMPLE_RATE_HZ);
    const noise = NOISE_AMPLITUDE * (Math.random() * 2 - 1);
    view.setInt16(WAV_HEADER_SIZE + sampleIndex * BYTES_PER_SAMPLE, (tone + noise) * MAX_INT16, true);
  }

  return toBase64(new Uint8Array(view.buffer));
};
