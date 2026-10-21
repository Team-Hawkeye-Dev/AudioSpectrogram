import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import type { AudioSpectrogramPlaybackControls, AudioSpectrogramZoomControls } from "../../types";
import { PlayPauseButton } from "../playPauseButton/PlayPauseButton";
import { ResetZoomButton, SpectrogramControlsArea } from "./SpectrogramControlsRow.styles";

interface SpectrogramControlsRowProps {
    zoom: AudioSpectrogramZoomControls;
    playback: AudioSpectrogramPlaybackControls;
    isReadyAudio: boolean;
}

export const SpectrogramControlsRow = ({ zoom, playback, isReadyAudio }: SpectrogramControlsRowProps) => (
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
    </SpectrogramControlsArea>
);
