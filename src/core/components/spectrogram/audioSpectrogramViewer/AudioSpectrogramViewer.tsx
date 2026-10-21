import { FrequencyLabels } from "./components/frequencyLabels/FrequencyLabels";
import { ResetZoomButtonRow } from "./components/resetZoomButtonRow/ResetZoomButtonRow";
import { WavePlotView } from "./components/wavePlotView/WavePlotView";
import {
  SpectrogramPlotRow,
  SpectrogramRowContainer,
  SpectrogramViewerRootContainer,
} from "./AudioSpectrogramViewer.styles";
import type { AudioSpectrogramViewerProps } from "./types";

export const AudioSpectrogramViewer = ({
  maxHz,
  stepHz,
  spectrogramContainerRef,
  zoom,
  isReadyAudio,
}: AudioSpectrogramViewerProps) => (
  <SpectrogramViewerRootContainer>
    <SpectrogramRowContainer>
      <SpectrogramPlotRow>
        <FrequencyLabels maxHz={maxHz} stepHz={stepHz} />
        <WavePlotView spectrogramContainerRef={spectrogramContainerRef} zoom={zoom} />
      </SpectrogramPlotRow>
      <ResetZoomButtonRow zoom={zoom} isReadyAudio={isReadyAudio} />
    </SpectrogramRowContainer>
  </SpectrogramViewerRootContainer>
);
