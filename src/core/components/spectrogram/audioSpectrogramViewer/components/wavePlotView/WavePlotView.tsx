import type { RefObject } from "react";
import type {
  AudioSpectrogramMeasureControls,
  AudioSpectrogramPlaybackControls,
  AudioSpectrogramZoomControls,
} from "../../types";
import { timeFormat } from "../../utils/formatPlaybackTime";
import { getZoomSelection } from "../../utils/selectionHighlight";
import { MeasureSelection } from "../measureSelection/MeasureSelection";
import {
  ProgressTimeTooltip,
  WavePlotContainer,
  WavePlotWrapper,
  ZoomSelectionHighlight,
} from "./WavePlotView.styles";

interface WavePlotViewProps {
  spectrogramContainerRef: RefObject<HTMLDivElement | null>;
  zoom: AudioSpectrogramZoomControls;
  measure: AudioSpectrogramMeasureControls;
  playback: AudioSpectrogramPlaybackControls;
}

export const WavePlotView = ({
  spectrogramContainerRef,
  zoom,
  measure,
  playback,
}: WavePlotViewProps) => {
  const { selection, onDragStart, onDragMove, onDragEnd } = zoom;
  const { measureArea, measureBox, isMeasuring, onMeasureStart, onMeasureMove, onMeasureEnd } = measure;
  const zoomSelection = selection ? getZoomSelection(selection) : null;
  const { playbackPosition } = playback;

  return (
    <WavePlotContainer>
      <WavePlotWrapper
        ref={spectrogramContainerRef}
        onPointerDown={(event) => {
          if (event.ctrlKey) {
            onMeasureStart(event);
            return;
          }
          onDragStart(event);
        }}
        onPointerMove={(event) => {
          onDragMove(event);
          onMeasureMove(event);
        }}
        onPointerUp={(event) => {
          onDragEnd(event);
          onMeasureEnd();
        }}
      >
        {zoomSelection && (
          <ZoomSelectionHighlight
            style={{
              left: zoomSelection.startSelection,
              width: zoomSelection.selectionWidth,
            }}
          />
        )}
        {measureArea && measureBox && (
          <MeasureSelection measureArea={measureArea} measureBox={measureBox} isMeasuring={isMeasuring} />
        )}
        <ProgressTimeTooltip style={{ left: playbackPosition.progressLinePx }}>
          {timeFormat(playbackPosition.currentTime)}
        </ProgressTimeTooltip>
      </WavePlotWrapper>
    </WavePlotContainer>
  );
};
