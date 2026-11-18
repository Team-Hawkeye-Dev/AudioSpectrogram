import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import type {
    AudioSpectrogramDetectionControls,
    AudioSpectrogramPlaybackControls,
    AudioSpectrogramZoomControls,
} from "../../types";
import { DetectionsNavigator } from "../detectionsNavigator/DetectionsNavigator";
import { PlayPauseButton } from "../playPauseButton/PlayPauseButton";
import { ResetZoomButton, SpectrogramControlsArea } from "./SpectrogramControlsRow.styles";

interface SpectrogramControlsRowProps {
    zoom: AudioSpectrogramZoomControls;
    playback: AudioSpectrogramPlaybackControls;
    detections: AudioSpectrogramDetectionControls;
    isReadyAudio: boolean;
}

export const SpectrogramControlsRow = ({ zoom, playback, detections, isReadyAudio }: SpectrogramControlsRowProps) => (
    <SpectrogramControlsArea>
        <PlayPauseButton playback={playback} isReadyAudio={isReadyAudio} />
        <ResetZoomButton
            onClick={zoom.resetZoom}
            disabled={!isReadyAudio}
            size="small"
            startIcon={<ZoomOutMapIcon fontSize="small" />}
        >
            Reset zoom
        </ResetZoomButton>
        <DetectionsNavigator detections={detections} isReadyAudio={isReadyAudio} />
    </SpectrogramControlsArea>
);
