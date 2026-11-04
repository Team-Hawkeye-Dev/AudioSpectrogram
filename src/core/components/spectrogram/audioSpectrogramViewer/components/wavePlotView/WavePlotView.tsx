import type { RefObject } from "react";
import type { AudioSpectrogramPlaybackControls, AudioSpectrogramTimelineControls, AudioSpectrogramZoomControls } from "../../types";
import { formatClockTime } from "../../utils/formatPlaybackTime";
import { getZoomSelection } from "../../utils/selectionHighlight";
import { RecordingGapOverlay } from "../recordingGapOverlay/RecordingGapOverlay";
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
  timeline: AudioSpectrogramTimelineControls;
}

export const WavePlotView = ({
  spectrogramContainerRef,
  zoom,
  playback,
  timeline: { timelineStartMs, recordingStartOffsetSeconds, goToRecordingStart },
}: WavePlotViewProps) => {
  const { selection, onDragStart, onDragMove, onDragEnd } = zoom;
  const zoomSelection = selection ? getZoomSelection(selection) : null;
  const { playbackPosition } = playback;
  const isProgressInGap = playbackPosition.currentTime < recordingStartOffsetSeconds;

  return (
    <WavePlotContainer>
      <WavePlotWrapper
        ref={spectrogramContainerRef}
        hideProgressLine={isProgressInGap}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
      >
        {playbackPosition.recordingStartPx > 0 && (
          <RecordingGapOverlay
            gapWidthPx={playbackPosition.recordingStartPx}
            recordingStartClockTime={formatClockTime(timelineStartMs, recordingStartOffsetSeconds)}
            onGoToRecording={goToRecordingStart}
          />
        )}
        {zoomSelection && (
          <ZoomSelectionHighlight
            style={{
              left: zoomSelection.startSelection,
              width: zoomSelection.selectionWidth,
            }}
          />
        )}
        {!isProgressInGap && (
          <ProgressTimeTooltip style={{ left: playbackPosition.progressLinePx }}>
            {formatClockTime(timelineStartMs, playbackPosition.currentTime)}
          </ProgressTimeTooltip>
        )}
      </WavePlotWrapper>
    </WavePlotContainer>
  );
};
