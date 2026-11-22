import type { MeasureArea, MeasureBox } from "../../types";
import { formatMeasureFrequency, formatMeasureTime } from "../../utils/formatMeasureValues";
import {
  MeasureSelectionBox,
  MeasureStatsGrid,
  MeasureStatsHeading,
  MeasureStatsValue,
  MeasureTooltip,
} from "./MeasureSelection.styles";

interface MeasureSelectionProps {
  measureArea: MeasureArea;
  measureBox: MeasureBox;
}

const MeasureStats = ({ measureArea }: { measureArea: MeasureArea }) => (
  <MeasureStatsGrid>
    <span />
    <MeasureStatsHeading>Start</MeasureStatsHeading>
    <MeasureStatsHeading>End</MeasureStatsHeading>

    <MeasureStatsHeading>Time</MeasureStatsHeading>
    <MeasureStatsValue>{formatMeasureTime(measureArea.startTimeSeconds)}</MeasureStatsValue>
    <MeasureStatsValue>{formatMeasureTime(measureArea.endTimeSeconds)}</MeasureStatsValue>

    <MeasureStatsHeading>Freq</MeasureStatsHeading>
    <MeasureStatsValue>{formatMeasureFrequency(measureArea.startFrequencyHz)}</MeasureStatsValue>
    <MeasureStatsValue>{formatMeasureFrequency(measureArea.endFrequencyHz)}</MeasureStatsValue>
  </MeasureStatsGrid>
);

export const MeasureSelection = ({ measureArea, measureBox }: MeasureSelectionProps) => (
  <MeasureTooltip title={<MeasureStats measureArea={measureArea} />} placement="top" arrow>
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
