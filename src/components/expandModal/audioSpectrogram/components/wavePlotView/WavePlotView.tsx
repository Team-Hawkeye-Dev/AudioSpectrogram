import { Button } from "@mui/material";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import type { SpectrogramType } from "../../consts/audioSpectrogram.consts";
import { useAudioSpectrogramViewer } from "../../hooks/useAudioSpectrogramViewer";
import { useZoomSelection } from "../../hooks/useZoomSelection";
import {
  ResetZoomButton,
  SelectionHighlight,
  WavePlotContainer,
  WavePlotWrapper,
} from "./WavePlotView.styles";

interface WavePlotViewProps {
  audioUrl: string;
  maxFrequencyHz: number;
  spectrogramPlotType: SpectrogramType;
}

interface Selection {
  startPx: number;
  currentPx: number;
}

const getSelectionHighlightStyle = ({ startPx, currentPx }: Selection) => ({
  left: Math.min(startPx, currentPx),
  width: Math.abs(currentPx - startPx),
});

export const WavePlotView = ({
  audioUrl,
  maxFrequencyHz,
  spectrogramPlotType,
}: WavePlotViewProps) => {
  const {
    spectrogramContainerRef,
    waveSurferInstanceRef,
    initialViewRef,
    isReadyAudio,
    applyZoomView,
  } = useAudioSpectrogramViewer(audioUrl, maxFrequencyHz, spectrogramPlotType);

  const { selection, onDragStart, onDragMove, onDragEnd, resetZoom } =
    useZoomSelection({
      spectrogramContainerRef,
      waveSurferInstanceRef,
      initialViewRef,
      spectrogramPlotType,
      isReadyAudio,
      applyZoomView,
    });

  return (
    <WavePlotContainer>
      <WavePlotWrapper
        ref={spectrogramContainerRef}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
      >
        {selection && (
          <SelectionHighlight style={getSelectionHighlightStyle(selection)} />
        )}
      </WavePlotWrapper>
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
    </WavePlotContainer>
  );
};
