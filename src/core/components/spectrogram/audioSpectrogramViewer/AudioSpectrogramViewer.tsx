import { FrequencyLabels } from "./components/frequencyLabels/FrequencyLabels";
import { SpectrogramHeader } from "./components/spectrogramHeader/SpectrogramHeader";
import { SpectrogramControlsRow } from "./components/spectrogramControlsRow/SpectrogramControlsRow";
import { WavePlotView } from "./components/wavePlotView/WavePlotView";
import {
  SpectrogramPlotRow,
  SpectrogramRowContainer,
  SpectrogramViewerRootContainer,
} from "./AudioSpectrogramViewer.styles";
import type { AudioSpectrogramViewerProps } from "./types";

export const AudioSpectrogramViewer = ({
  title,
  maxHz,
  stepHz,
  spectrogramContainerRef,
  zoom,
  playback,
  detections,
  isReadyAudio,
}: AudioSpectrogramViewerProps) => (
  <SpectrogramViewerRootContainer>
    <SpectrogramRowContainer>
      <SpectrogramHeader title={title} />
      <SpectrogramPlotRow>
        <FrequencyLabels maxHz={maxHz} stepHz={stepHz} />
        <WavePlotView spectrogramContainerRef={spectrogramContainerRef} zoom={zoom} playback={playback} />
      </SpectrogramPlotRow>
      <SpectrogramControlsRow zoom={zoom} playback={playback} detections={detections} isReadyAudio={isReadyAudio} />
    </SpectrogramRowContainer>
  </SpectrogramViewerRootContainer>
);
