// Generates a synthetic 10 minute mono WAV file so the app has something to
// display without needing a real recording. Layers a handful of sine
// oscillators that glide between random frequencies every few seconds, plus
// a light noise floor, so the spectrogram has visible texture to scroll and
// zoom through. Run with: npm run generate:sample-audio
//
// Keep SAMPLE_RATE_HZ in sync with DECODE_SAMPLE_RATE_HZ in
// src/constants/spectrogramConfig.ts (must stay >= 2x FREQUENCY_MAX_HZ).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SAMPLE_RATE_HZ = 16000;
const DURATION_SECONDS = 10 * 60;
const SEGMENT_SECONDS = 20;
const OSCILLATOR_COUNT = 4;
const MIN_TONE_HZ = 300;
const MAX_TONE_HZ = 7200;
const NOISE_AMPLITUDE = 0.05;
const OUTPUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sample-audio', 'generated-10-minute.wav');

function randomFrequency() {
  return MIN_TONE_HZ + Math.random() * (MAX_TONE_HZ - MIN_TONE_HZ);
}

function buildSamples() {
  const totalSamples = SAMPLE_RATE_HZ * DURATION_SECONDS;
  const segmentCount = Math.ceil(DURATION_SECONDS / SEGMENT_SECONDS) + 1;

  // Random frequency "waypoints" per oscillator; each segment glides linearly between them.
  const waypointsByOscillator = Array.from({ length: OSCILLATOR_COUNT }, () =>
    Array.from({ length: segmentCount }, randomFrequency),
  );
  const phaseByOscillator = Array.from({ length: OSCILLATOR_COUNT }, () => 0);

  const samples = new Float32Array(totalSamples);

  for (let sampleIndex = 0; sampleIndex < totalSamples; sampleIndex++) {
    const timeSeconds = sampleIndex / SAMPLE_RATE_HZ;
    const segmentIndex = Math.floor(timeSeconds / SEGMENT_SECONDS);
    const segmentProgress = (timeSeconds % SEGMENT_SECONDS) / SEGMENT_SECONDS;

    let mixedSample = 0;
    for (let oscillator = 0; oscillator < OSCILLATOR_COUNT; oscillator++) {
      const startFrequency = waypointsByOscillator[oscillator][segmentIndex];
      const endFrequency = waypointsByOscillator[oscillator][segmentIndex + 1];
      const frequency = startFrequency + (endFrequency - startFrequency) * segmentProgress;

      phaseByOscillator[oscillator] += (2 * Math.PI * frequency) / SAMPLE_RATE_HZ;
      mixedSample += Math.sin(phaseByOscillator[oscillator]);
    }
    mixedSample /= OSCILLATOR_COUNT;

    const noise = (Math.random() * 2 - 1) * NOISE_AMPLITUDE;
    samples[sampleIndex] = mixedSample * 0.6 + noise;
  }

  return samples;
}

function encodeWav(samples, sampleRate) {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // PCM fmt chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28); // byte rate
  buffer.writeUInt16LE(bytesPerSample, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * bytesPerSample);
  }

  return buffer;
}

const samples = buildSamples();
const wavBuffer = encodeWav(samples, SAMPLE_RATE_HZ);

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, wavBuffer);

console.log(`Wrote ${(wavBuffer.length / (1024 * 1024)).toFixed(1)} MB to ${OUTPUT_PATH}`);
