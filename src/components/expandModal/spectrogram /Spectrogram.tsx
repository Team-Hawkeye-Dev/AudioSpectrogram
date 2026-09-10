import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { SpectrogramViewer } from "./components/spectrogramViewer/SpectrogramViewer";
import { SpectrogramType } from "./consts/spectrogram.consts";
import { useAudioUrl } from "./hooks/useAudioUrl";
import { ExpandModalContainer, SpectrogramTitle } from "./Spectrogram.styles";

export const Spectrogram = () => {
  const topUrl = useAudioUrl();
  const bottomUrl = useAudioUrl();

  return (
    <ExpandModalContainer>
      <SpectrogramTitle>
        <GraphicEqIcon fontSize="small" />
        Spectrogram (switch icon)
      </SpectrogramTitle>
      {topUrl && (
        <SpectrogramViewer
          audioUrl={topUrl}
          spectrogramPlotType={SpectrogramType.TOP}
        />
      )}
      {bottomUrl && (
        <SpectrogramViewer
          audioUrl={bottomUrl}
          spectrogramPlotType={SpectrogramType.BOTTOM}
        />
      )}
    </ExpandModalContainer>
  );
};
