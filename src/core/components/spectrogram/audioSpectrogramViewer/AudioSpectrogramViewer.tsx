import { FrequencyLabels } from "./components/frequencyLabels/FrequencyLabels";
import { SpectrogramControlsRow } from "./components/spectrogramControlsRow/SpectrogramControlsRow";
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
  playback,
  isReadyAudio,
}: AudioSpectrogramViewerProps) => (
  <SpectrogramViewerRootContainer>
    <SpectrogramRowContainer>
      <SpectrogramPlotRow>
        <FrequencyLabels maxHz={maxHz} stepHz={stepHz} />
        <WavePlotView spectrogramContainerRef={spectrogramContainerRef} zoom={zoom} playback={playback} />
      </SpectrogramPlotRow>
      <SpectrogramControlsRow zoom={zoom} playback={playback} isReadyAudio={isReadyAudio} />
    </SpectrogramRowContainer>
  </SpectrogramViewerRootContainer>
);
