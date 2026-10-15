import {
  FREQUENCY_STEP,
  SPECTROGRAM_FREQUENCY_CONFIG,
  type SpectrogramType,
} from "../../consts/audioSpectrogram.consts";
import { WavePlotView } from "../wavePlotView/WavePlotView";
import {
  FrequencyLabel,
  FrequencyLabelList,
  SpectrogramPlotRow,
  SpectrogramRowContainer,
  SpectrogramViewerRootContainer,
} from "./AudioSpectrogramViewer.styles";

interface SpectrogramViewerProps {
  audioUrl: string;
  spectrogramPlotType: SpectrogramType;
}

export const AudioSpectrogramViewer = ({
  audioUrl,
  spectrogramPlotType,
}: SpectrogramViewerProps) => {
  const { maxHz, stepHz } = SPECTROGRAM_FREQUENCY_CONFIG[spectrogramPlotType];

  const frequencyLabelsHz = Array.from(
    { length: maxHz / stepHz + 1 },
    (_, index) => maxHz - index * stepHz,
  );

  return (
    <SpectrogramViewerRootContainer>
      <SpectrogramRowContainer>
        <SpectrogramPlotRow>
          <FrequencyLabelList>
            {frequencyLabelsHz.map((frequencyHz) => {
              const kHz = frequencyHz / FREQUENCY_STEP;
              return (
                <FrequencyLabel key={frequencyHz}>{`${kHz}k`}</FrequencyLabel>
              );
            })}
          </FrequencyLabelList>
          <WavePlotView
            audioUrl={audioUrl}
            maxFrequencyHz={maxHz}
            spectrogramPlotType={spectrogramPlotType}
          />
        </SpectrogramPlotRow>
      </SpectrogramRowContainer>
    </SpectrogramViewerRootContainer>
  );
};
