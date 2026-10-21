import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import type { AudioSpectrogramPlaybackControls } from "../../types";
import { PlayPauseIconButton } from "./PlayPauseButton.styles";

interface PlayPauseButtonProps {
    playback: AudioSpectrogramPlaybackControls;
    isReadyAudio: boolean;
}

export const PlayPauseButton = ({ playback, isReadyAudio }: PlayPauseButtonProps) => (
    <PlayPauseIconButton
        onClick={playback.togglePlay}
        disabled={!isReadyAudio}
        size="small"
        aria-label={playback.isPlaying ? "Pause" : "Play"}
    >
        {playback.isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
    </PlayPauseIconButton>
);
