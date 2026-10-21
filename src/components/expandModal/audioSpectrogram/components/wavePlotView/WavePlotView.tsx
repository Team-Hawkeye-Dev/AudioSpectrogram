import type { PointerEvent, RefObject } from "react";
import { Button } from "@mui/material";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import {
  ResetZoomButton,
  SelectionHighlight,
  WavePlotContainer,
  WavePlotWrapper,
} from "./WavePlotView.styles";

interface Selection {
  startPx: number;
  currentPx: number;
}

export interface WavePlotViewProps {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  isReadyAudio: boolean;
  selection: Selection | null;
  onDragStart: (event: PointerEvent<HTMLDivElement>) => void;
  onDragMove: (event: PointerEvent<HTMLDivElement>) => void;
  onDragEnd: (event: PointerEvent<HTMLDivElement>) => void;
  resetZoom: () => void;
}

const getSelectionHighlightStyle = ({ startPx, currentPx }: Selection) => ({
  left: Math.min(startPx, currentPx),
  width: Math.abs(currentPx - startPx),
});

export const WavePlotView = ({
  spectrogramContainerRef,
  isReadyAudio,
  selection,
  onDragStart,
  onDragMove,
  onDragEnd,
  resetZoom,
}: WavePlotViewProps) => (
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
