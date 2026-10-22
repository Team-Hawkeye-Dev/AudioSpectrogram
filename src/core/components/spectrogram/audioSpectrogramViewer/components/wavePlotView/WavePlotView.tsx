import type { RefObject } from "react";
import type { AudioSpectrogramPlaybackControls, AudioSpectrogramZoomControls } from "../../types";
import { timeFormat } from "../../utils/formatPlaybackTime";
import { getZoomSelection } from "../../utils/selectionHighlight";
import {
  ProgressTimeTooltip,
  WavePlotContainer,
  WavePlotWrapper,
  ZoomSelectionHighlight,
} from "./WavePlotView.styles";

interface WavePlotViewProps {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  zoom: AudioSpectrogramZoomControls;
  playback: AudioSpectrogramPlaybackControls;
}

export const WavePlotView = ({
  spectrogramContainerRef,
  zoom,
  playback,
}: WavePlotViewProps) => {
  const { selection, onDragStart, onDragMove, onDragEnd } = zoom;
  const zoomSelection = selection ? getZoomSelection(selection) : null;
  const { isPlaying, playbackPosition } = playback;

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
        {isPlaying && (
          <ProgressTimeTooltip style={{ left: playbackPosition.progressLinePx }}>
            {timeFormat(playbackPosition.currentTime)}
          </ProgressTimeTooltip>
        )}
      </WavePlotWrapper>
    </WavePlotContainer>
  );
};
