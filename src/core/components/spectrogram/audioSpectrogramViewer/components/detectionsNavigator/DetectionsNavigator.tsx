import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import type { AudioSpectrogramDetectionControls } from "../../types";
import { DetectionsButton, DetectionsNavigatorArea, DetectionStepButton } from "./DetectionsNavigator.styles";

interface DetectionsNavigatorProps {
    detections: AudioSpectrogramDetectionControls;
    isReadyAudio: boolean;
}

export const DetectionsNavigator = ({ detections: {goToPreviousDetection, goToFirstDetection, goToNextDetection }, isReadyAudio }: DetectionsNavigatorProps) => (
    <DetectionsNavigatorArea>
        <DetectionStepButton
            onClick={goToPreviousDetection}
            disabled={!isReadyAudio}
            size="small"
        >
            <NavigateBeforeIcon fontSize="small" />
        </DetectionStepButton>
        <DetectionsButton
            onClick={goToFirstDetection}
            disabled={!isReadyAudio}
            size="small"
            startIcon={<TrackChangesIcon fontSize="small" />}
        >
            Detections
        </DetectionsButton>
        <DetectionStepButton
            onClick={goToNextDetection}
            disabled={!isReadyAudio}
            size="small"
        >
            <NavigateNextIcon fontSize="small" />
        </DetectionStepButton>
    </DetectionsNavigatorArea>
);
