import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { AudioSpectrogramTimelineControls } from "../../types";
import { formatClockTime } from "../../utils/formatPlaybackTime";
import { GoToRecordingButton, RecordingGapArea, RecordingGapText, RecordingStartTime } from "./RecordingGapOverlay.styles";

interface RecordingGapOverlayProps {
    timeline: AudioSpectrogramTimelineControls;
    recordingStartPx: number;
}

export const RecordingGapOverlay = ({ timeline, recordingStartPx }: RecordingGapOverlayProps) => (
    <RecordingGapArea style={{ width: recordingStartPx }}>
        <RecordingGapText variant="caption" color="text.secondary">
            No recording until
        </RecordingGapText>
        <RecordingStartTime variant="body2">
            {formatClockTime(timeline.timelineStartMs, timeline.recordingStartTime)}
        </RecordingStartTime>
        {timeline.goToRecordingStart && (
            <GoToRecordingButton
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={timeline.goToRecordingStart}
            >
                Go to recording
            </GoToRecordingButton>
        )}
    </RecordingGapArea>
);
