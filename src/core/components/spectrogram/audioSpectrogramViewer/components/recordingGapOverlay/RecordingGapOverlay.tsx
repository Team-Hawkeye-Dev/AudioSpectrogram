import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { GoToRecordingButton, RecordingGapArea, RecordingGapText, RecordingStartTime } from "./RecordingGapOverlay.styles";

interface RecordingGapOverlayProps {
    gapWidthPx: number;
    recordingStartClockTime: string;
    onGoToRecording?: () => void;
}

export const RecordingGapOverlay = ({ gapWidthPx, recordingStartClockTime, onGoToRecording }: RecordingGapOverlayProps) => (
    <RecordingGapArea style={{ width: gapWidthPx }} onPointerDown={(event) => event.stopPropagation()}>
        <RecordingGapText variant="caption" color="text.secondary">
            No recording until
        </RecordingGapText>
        <RecordingStartTime variant="body2">
            {recordingStartClockTime}
        </RecordingStartTime>
        {onGoToRecording && (
            <GoToRecordingButton
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={onGoToRecording}
            >
                Go to recording
            </GoToRecordingButton>
        )}
    </RecordingGapArea>
);
