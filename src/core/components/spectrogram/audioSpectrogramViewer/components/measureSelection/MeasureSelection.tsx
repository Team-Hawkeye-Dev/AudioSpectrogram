import { useEffect, useRef, useState } from "react";
import type { Instance as PopperInstance } from "@popperjs/core";
import type { MeasureArea, MeasureBox } from "../../types";
import { formatMeasureDuration, formatMeasureFrequency, formatMeasureTime } from "../../utils/formatMeasureValues";
import {
  MeasureSelectionBox,
  MeasureStatsDifference,
  MeasureStatsGrid,
  MeasureStatsHeading,
  MeasureStatsValue,
  MeasureTooltip,
} from "./MeasureSelection.styles";

interface MeasureSelectionProps {
  measureArea: MeasureArea;
  measureBox: MeasureBox;
  isMeasuring: boolean;
}

const MeasureStats = ({ measureArea }: { measureArea: MeasureArea }) => {
  const durationSeconds = measureArea.endTimeSeconds - measureArea.startTimeSeconds;
  const bandwidthHz = measureArea.endFrequencyHz - measureArea.startFrequencyHz;

  return (
    <MeasureStatsGrid>
      <MeasureStatsHeading>Time</MeasureStatsHeading>
      <MeasureStatsValue>
        {formatMeasureTime(measureArea.startTimeSeconds)} → {formatMeasureTime(measureArea.endTimeSeconds)}
      </MeasureStatsValue>
      <MeasureStatsDifference>Δ {formatMeasureDuration(durationSeconds)}</MeasureStatsDifference>

      <MeasureStatsHeading>Freq</MeasureStatsHeading>
      <MeasureStatsValue>
        {formatMeasureFrequency(measureArea.startFrequencyHz)} → {formatMeasureFrequency(measureArea.endFrequencyHz)}
      </MeasureStatsValue>
      <MeasureStatsDifference>Δ {formatMeasureFrequency(bandwidthHz)}</MeasureStatsDifference>
    </MeasureStatsGrid>
  );
};

export const MeasureSelection = ({ measureArea, measureBox, isMeasuring }: MeasureSelectionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const popperRef = useRef<PopperInstance | null>(null);
  const isStatsOpen = isMeasuring || isHovered;

  useEffect(() => {
    popperRef.current?.update();
  }, [measureBox]);

  return (
    <MeasureTooltip
      title={<MeasureStats measureArea={measureArea} />}
      placement="top"
      arrow
      disableInteractive
      open={isStatsOpen}
      onOpen={() => setIsHovered(true)}
      onClose={() => setIsHovered(false)}
      slotProps={{ popper: { popperRef } }}
    >
      <MeasureSelectionBox
        style={{
          left: measureBox.left,
          top: measureBox.top,
          width: measureBox.width,
          height: measureBox.height,
        }}
      />
    </MeasureTooltip>
  );
};
