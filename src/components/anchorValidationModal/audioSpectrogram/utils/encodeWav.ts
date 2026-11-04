const WAV_MIME_TYPE = 'audio/wav';
const FMT_CHUNK_BYTES = 16;
const WAV_FLOAT_FORMAT = 3;
const MONO_CHANNELS = 1;
const BYTES_PER_SAMPLE = Float32Array.BYTES_PER_ELEMENT;
const BITS_PER_SAMPLE = BYTES_PER_SAMPLE * 8;

const uint16 = (value: number) => new Uint16Array([value]);
const uint32 = (value: number) => new Uint32Array([value]);

export const encodeWav = (audio: AudioBuffer): Blob => {
  const samples = audio.getChannelData(0);
  const wavContent = new Blob([
    'WAVE',
    'fmt ', uint32(FMT_CHUNK_BYTES), uint16(WAV_FLOAT_FORMAT), uint16(MONO_CHANNELS),
    uint32(audio.sampleRate), uint32(audio.sampleRate * BYTES_PER_SAMPLE), uint16(BYTES_PER_SAMPLE), uint16(BITS_PER_SAMPLE),
    'data', uint32(samples.byteLength), samples,
  ]);

  return new Blob(['RIFF', uint32(wavContent.size), wavContent], { type: WAV_MIME_TYPE });
};
