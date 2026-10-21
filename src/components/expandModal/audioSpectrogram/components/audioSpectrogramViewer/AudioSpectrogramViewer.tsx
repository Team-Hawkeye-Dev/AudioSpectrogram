import { HZ_PER_KHZ } from "../../consts/audioSpectrogram.consts";
import { WavePlotView, type WavePlotViewProps } from "../wavePlotView/WavePlotView";
import {
  FrequencyLabel,
  FrequencyLabelList,
  SpectrogramPlotRow,
  SpectrogramRowContainer,
  SpectrogramViewerRootContainer,
} from "./AudioSpectrogramViewer.styles";

interface SpectrogramViewerProps extends WavePlotViewProps {
  maxHz: number;
  stepHz: number;
}

export const AudioSpectrogramViewer = ({
  maxHz,
  stepHz,
  ...wavePlotViewProps
}: SpectrogramViewerProps) => {
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
              const kHz = frequencyHz / HZ_PER_KHZ;
              return (
                <FrequencyLabel key={frequencyHz}>{`${kHz}k`}</FrequencyLabel>
              );
            })}
          </FrequencyLabelList>
          <WavePlotView {...wavePlotViewProps} />
        </SpectrogramPlotRow>
      </SpectrogramRowContainer>
    </SpectrogramViewerRootContainer>
  );
};
