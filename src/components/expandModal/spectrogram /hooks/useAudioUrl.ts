import topAudioUrl from "/home/c885423@CASA.NET/Downloads/file_example_WAV_1MG.wav?url";
import bottomAudioUrl from "/home/c885423@CASA.NET/Downloads/file_example_WAV_10MG.wav?url";
import { SpectrogramType } from "../consts/spectrogram.consts";

const audioUrls = {
  [SpectrogramType.TOP]: topAudioUrl,
  [SpectrogramType.BOTTOM]: bottomAudioUrl,
};

export const useAudioUrl = (
  spectrogramType: SpectrogramType = SpectrogramType.TOP,
): string => audioUrls[spectrogramType];
