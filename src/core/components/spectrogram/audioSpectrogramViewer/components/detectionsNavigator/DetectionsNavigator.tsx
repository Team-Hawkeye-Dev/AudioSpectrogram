import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import type { AudioSpectrogramDetectionControls } from "../../types";
import { DetectionsButton, DetectionsNavigatorArea, DetectionStepButton } from "./DetectionsNavigator.styles";

interface DetectionsNavigatorProps {
    detections: AudioSpectrogramDetectionControls;
    isReadyAudio: boolean;
}

export const DetectionsNavigator = ({ detections, isReadyAudio }: DetectionsNavigatorProps) => (
    <DetectionsNavigatorArea>
        <DetectionStepButton
            onClick={detections.goToPreviousDetection}
            disabled={!isReadyAudio}
            size="small"
            aria-label="Previous detection"
        >
            <NavigateBeforeIcon fontSize="small" />
        </DetectionStepButton>
        <DetectionsButton
            onClick={detections.goToFirstDetection}
            disabled={!isReadyAudio}
            size="small"
            startIcon={<TrackChangesIcon fontSize="small" />}
        >
            Detections
        </DetectionsButton>
        <DetectionStepButton
            onClick={detections.goToNextDetection}
            disabled={!isReadyAudio}
            size="small"
            aria-label="Next detection"
        >
            <NavigateNextIcon fontSize="small" />
        </DetectionStepButton>
    </DetectionsNavigatorArea>
);
