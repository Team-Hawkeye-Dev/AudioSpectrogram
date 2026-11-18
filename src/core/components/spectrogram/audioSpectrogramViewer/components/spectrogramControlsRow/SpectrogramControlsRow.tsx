import SyncIcon from "@mui/icons-material/Sync";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import type {
    AudioSpectrogramDetectionControls,
    AudioSpectrogramPlaybackControls,
    AudioSpectrogramSyncControls,
    AudioSpectrogramZoomControls,
} from "../../types";
import { DetectionsNavigator } from "../detectionsNavigator/DetectionsNavigator";
import { PlayPauseButton } from "../playPauseButton/PlayPauseButton";
import { ResetZoomButton, SpectrogramControlsArea, SyncButton, ViewActions } from "./SpectrogramControlsRow.styles";

interface SpectrogramControlsRowProps {
    zoom: AudioSpectrogramZoomControls;
    playback: AudioSpectrogramPlaybackControls;
    detections: AudioSpectrogramDetectionControls;
    sync: AudioSpectrogramSyncControls;
    isReadyAudio: boolean;
}

export const SpectrogramControlsRow = ({ zoom, playback, detections, sync, isReadyAudio }: SpectrogramControlsRowProps) => (
    <SpectrogramControlsArea>
        <PlayPauseButton playback={playback} isReadyAudio={isReadyAudio} />
        <ViewActions>
            <ResetZoomButton
                onClick={zoom.resetZoom}
                disabled={!isReadyAudio}
                size="small"
                startIcon={<ZoomOutMapIcon fontSize="small" />}
            >
                Reset zoom
            </ResetZoomButton>
            <SyncButton
                isSynced={sync.isSynced}
                onClick={sync.toggleSync}
                disabled={!isReadyAudio}
                size="small"
                startIcon={<SyncIcon fontSize="small" />}
                aria-pressed={sync.isSynced}
            >
                Sync
            </SyncButton>
        </ViewActions>
        <DetectionsNavigator detections={detections} isReadyAudio={isReadyAudio} />
    </SpectrogramControlsArea>
);
