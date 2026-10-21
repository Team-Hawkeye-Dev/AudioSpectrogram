import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import type { AudioSpectrogramZoomControls } from "../../types";
import { ResetZoomButton, ResetZoomButtonArea } from "./ResetZoomButtonRow.styles";

interface ResetZoomButtonRowProps {
    zoom: AudioSpectrogramZoomControls;
    isReadyAudio: boolean;
}

export const ResetZoomButtonRow = ({ zoom, isReadyAudio }: ResetZoomButtonRowProps) => (
    <ResetZoomButtonArea>
        <ResetZoomButton
            onClick={zoom.resetZoom}
            disabled={!isReadyAudio}
            size="small"
            startIcon={<ZoomOutMapIcon fontSize="small" />}
        >
            Reset zoom
        </ResetZoomButton>
    </ResetZoomButtonArea>
);
