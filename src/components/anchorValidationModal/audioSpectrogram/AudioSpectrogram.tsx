import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { CircularProgress } from "@mui/material";
import { AudioSpectrogramSourcePlot } from "./components/audioSpectrogramSourcePlot/AudioSpectrogramSourcePlot";
import {
  BOTTOM_SPECTROGRAM_STEP_HZ,
  MAX_HZ_BOTTOM_SPECTROGRAM,
  MAX_HZ_TOP_SPECTROGRAM,
  SpectrogramType,
  TOP_SPECTROGRAM_STEP_HZ,
} from "./consts/audioSpectrogram.consts";
import {
  AnchorValidationModalContainer,
  SpectrogramLoadingOverlay,
  SpectrogramPlotArea,
  SpectrogramPlotGroup,
  SpectrogramTitle,
} from "./AudioSpectrogram.styles";
import { useMassiviAppStore } from "../../../store/useStore";
import { useAreAllSpectrogramsReady } from "./hooks/useAreAllSpectrogramsReady";
import type { AudioSpectrogramSource } from "./types/audioSpectrogram.types";

export const AudioSpectrogramModal = () => {
  const spectrogramAudioGuid = useMassiviAppStore((state) => state.anchorValidationSection.spectrogramAudioGuid)
  const areAllSpectrogramReady = useAreAllSpectrogramsReady()

  const audioSpectrogramSources: AudioSpectrogramSource[] = [
    {
      audioGuid: spectrogramAudioGuid[SpectrogramType.TOP],
      spectrogramType: SpectrogramType.TOP,
      maxHz: MAX_HZ_TOP_SPECTROGRAM,
      stepHz: TOP_SPECTROGRAM_STEP_HZ
    },
    {
      audioGuid: spectrogramAudioGuid[SpectrogramType.BOTTOM],
      spectrogramType: SpectrogramType.BOTTOM,
      maxHz: MAX_HZ_BOTTOM_SPECTROGRAM,
      stepHz: BOTTOM_SPECTROGRAM_STEP_HZ
    }
  ]

  return (
    <AnchorValidationModalContainer>
      <SpectrogramTitle>
        <GraphicEqIcon fontSize="small" />
        Spectrogram (switch icon)
      </SpectrogramTitle>
      <SpectrogramPlotArea>
        {!areAllSpectrogramReady && (
          <SpectrogramLoadingOverlay>
            <CircularProgress/>
          </SpectrogramLoadingOverlay>
        )}
        <SpectrogramPlotGroup ready={areAllSpectrogramReady}>
          {audioSpectrogramSources.map((source) => (
            <AudioSpectrogramSourcePlot
              key={source.spectrogramType}
              {...source}
            />
          ))}
        </SpectrogramPlotGroup>
      </SpectrogramPlotArea>
    </AnchorValidationModalContainer>
  );
};
