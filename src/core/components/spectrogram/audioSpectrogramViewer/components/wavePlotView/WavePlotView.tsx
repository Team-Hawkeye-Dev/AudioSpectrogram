import type { RefObject } from "react";
import type { AudioSpectrogramZoomControls } from "../../types";
import { getZoomSelection } from "../../utils/selectionHighlight";
import {
  WavePlotContainer,
  WavePlotWrapper,
  ZoomSelectionHighlight,
} from "./WavePlotView.styles";

interface WavePlotViewProps {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  zoom: AudioSpectrogramZoomControls;
}

export const WavePlotView = ({
  spectrogramContainerRef,
  zoom,
}: WavePlotViewProps) => {
  const { selection, onDragStart, onDragMove, onDragEnd } = zoom;
  const zoomSelection = selection ? getZoomSelection(selection) : null;

  return (
    <WavePlotContainer>
      <WavePlotWrapper
        ref={spectrogramContainerRef}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
      >
        {zoomSelection && (
          <ZoomSelectionHighlight
            style={{
              left: zoomSelection.startSelection,
              width: zoomSelection.selectionWidth,
            }}
          />
        )}
      </WavePlotWrapper>
    </WavePlotContainer>
  );
};
