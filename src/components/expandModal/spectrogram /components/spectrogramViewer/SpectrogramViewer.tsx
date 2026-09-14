import { Button } from "@mui/material";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import {
  FREQUENCY_STEP,
  SPECTROGRAM_FREQUENCY_CONFIG,
  type SpectrogramType,
} from "../../consts/spectrogram.consts";
import { useAudioSpectrogramViewer } from "../../hooks/useAudioSpectrogramViewer";
import { useZoomSelection } from "../../hooks/useZoomSelection";
import {
  FrequencyLabel,
  FrequencyLabelList,
  ResetZoomButton,
  SpectrgoramRowContainer,
  SpectrogramPlotRow,
  SpectrogramViewerRootContainer,
  SelectionHightlight,
  WavePlotWrapper,
} from "./SpectrogramViewer.styles";

interface SpectrogramViewerProps {
  audioUrl: string;
  spectrogramPlotType: SpectrogramType;
}

export const SpectrogramViewer = ({
  audioUrl,
  spectrogramPlotType,
}: SpectrogramViewerProps) => {
  const { maxHz, stepHz } = SPECTROGRAM_FREQUENCY_CONFIG[spectrogramPlotType];

  const {
    spectrogramContainerRef,
    waveSurferInstanceRef,
    initialViewRef,
    audioDuration,
    isReadyAudio,
    applyZoomView,
  } = useAudioSpectrogramViewer(audioUrl, maxHz);

  const { selection, onDragStart, onDragMove, onDragEnd, resetZoom } =
    useZoomSelection({
      spectrogramContainerRef,
      waveSurferInstanceRef,
      initialViewRef,
      audioDuration,
      isReadyAudio,
      applyZoomView,
    });

  const frequencyLabelsHz = Array.from(
    { length: maxHz / stepHz + 1 },
    (_, index) => maxHz - index * stepHz,
  );

  return (
    <SpectrogramViewerRootContainer>
      <SpectrgoramRowContainer>
        <SpectrogramPlotRow>
          <FrequencyLabelList>
            {frequencyLabelsHz.map((frequencyHz) => {
              const kHz = frequencyHz / FREQUENCY_STEP;
              return (
                <FrequencyLabel key={frequencyHz}>{`${kHz}k`}</FrequencyLabel>
              );
            })}
          </FrequencyLabelList>
          <WavePlotWrapper
            ref={spectrogramContainerRef}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
          >
            {selection && (
              <SelectionHightlight
                style={{
                  left: Math.min(selection.startPx, selection.currentPx),
                  width: Math.abs(selection.currentPx - selection.startPx),
                }}
              />
            )}
          </WavePlotWrapper>
        </SpectrogramPlotRow>
        <ResetZoomButton>
          <Button
            onClick={resetZoom}
            disabled={!isReadyAudio}
            size="small"
            startIcon={<ZoomOutMapIcon fontSize="small" />}
          >
            Reset zoom
          </Button>
        </ResetZoomButton>
      </SpectrgoramRowContainer>
    </SpectrogramViewerRootContainer>
  );
};
