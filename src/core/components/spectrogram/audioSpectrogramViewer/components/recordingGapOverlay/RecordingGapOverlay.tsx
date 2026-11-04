import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { AudioSpectrogramTimelineControls } from "../../types";
import { formatClockTime } from "../../utils/formatPlaybackTime";
import { GoToRecordingButton, RecordingGapArea, RecordingGapText, RecordingStartTime } from "./RecordingGapOverlay.styles";

interface RecordingGapOverlayProps {
    timeline: AudioSpectrogramTimelineControls;
    recordingStartPx: number;
}

export const RecordingGapOverlay = ({ timeline, recordingStartPx }: RecordingGapOverlayProps) => (
    <RecordingGapArea style={{ width: recordingStartPx }} onPointerDown={(event) => event.stopPropagation()}>
        <RecordingGapText variant="caption" color="text.secondary">
            No recording until
        </RecordingGapText>
        <RecordingStartTime variant="body2">
            {formatClockTime(timeline.timelineStartMs, timeline.timeShift)}
        </RecordingStartTime>
        {timeline.goToRecordingStart && (
            <GoToRecordingButton
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={timeline.goToRecordingStart}
            >
                Go to recording
            </GoToRecordingButton>
        )}
    </RecordingGapArea>
);
