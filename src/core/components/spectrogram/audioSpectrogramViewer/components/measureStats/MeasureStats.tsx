import type { MeasureArea } from "../../types";
import { formatMeasureDuration, formatMeasureFrequency, formatMeasureTime } from "../../utils/formatMeasureValues";
import {
  MeasureStatsContainer,
  MeasureStatsDifference,
  MeasureStatsHeading,
  MeasureStatsRow,
  MeasureStatsValue,
} from "./MeasureStats.styles";

interface MeasureStatsProps {
  measureArea: MeasureArea;
}

export const MeasureStats = ({ measureArea }: MeasureStatsProps) => {
  const durationSeconds = measureArea.endTimeSeconds - measureArea.startTimeSeconds;
  const bandwidthHz = measureArea.endFrequencyHz - measureArea.startFrequencyHz;

  return (
    <MeasureStatsContainer>
      <MeasureStatsRow>
        <MeasureStatsHeading>Time</MeasureStatsHeading>
        <MeasureStatsValue>
          {formatMeasureTime(measureArea.startTimeSeconds)} → {formatMeasureTime(measureArea.endTimeSeconds)}
        </MeasureStatsValue>
        <MeasureStatsDifference>Δ {formatMeasureDuration(durationSeconds)}</MeasureStatsDifference>
      </MeasureStatsRow>
      <MeasureStatsRow>
        <MeasureStatsHeading>Freq</MeasureStatsHeading>
        <MeasureStatsValue>
          {formatMeasureFrequency(measureArea.startFrequencyHz)} → {formatMeasureFrequency(measureArea.endFrequencyHz)}
        </MeasureStatsValue>
        <MeasureStatsDifference>Δ {formatMeasureFrequency(bandwidthHz)}</MeasureStatsDifference>
      </MeasureStatsRow>
    </MeasureStatsContainer>
  );
};
