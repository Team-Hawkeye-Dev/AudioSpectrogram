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

export const MeasureStats = ({
  measureArea: { startTimeSeconds, endTimeSeconds, startFrequencyHz, endFrequencyHz },
}: MeasureStatsProps) => {
  const durationSeconds = endTimeSeconds - startTimeSeconds;
  const bandwidthHz = endFrequencyHz - startFrequencyHz;

  return (
    <MeasureStatsContainer>
      <MeasureStatsRow>
        <MeasureStatsHeading>Time</MeasureStatsHeading>
        <MeasureStatsValue>
          {formatMeasureTime(startTimeSeconds)} → {formatMeasureTime(endTimeSeconds)}
        </MeasureStatsValue>
        <MeasureStatsDifference>Δ {formatMeasureDuration(durationSeconds)}</MeasureStatsDifference>
      </MeasureStatsRow>
      <MeasureStatsRow>
        <MeasureStatsHeading>Freq</MeasureStatsHeading>
        <MeasureStatsValue>
          {formatMeasureFrequency(startFrequencyHz)} → {formatMeasureFrequency(endFrequencyHz)}
        </MeasureStatsValue>
        <MeasureStatsDifference>Δ {formatMeasureFrequency(bandwidthHz)}</MeasureStatsDifference>
      </MeasureStatsRow>
    </MeasureStatsContainer>
  );
};
