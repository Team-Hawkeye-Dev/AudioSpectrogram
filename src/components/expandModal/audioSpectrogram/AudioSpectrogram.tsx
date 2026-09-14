import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { AudioSpectrogramViewer } from "./components/audioSpectrogramViewer/AudioSpectrogramViewer";
import { SpectrogramType } from "./consts/audioSpectrogram.consts";
import { useAudioUrl } from "./hooks/useAudioUrl";
import { ExpandModalContainer, SpectrogramTitle } from "./AudioSpectrogram.styles";

export const AudioSpectrogram = () => {
  const topUrl = useAudioUrl();
  const bottomUrl = useAudioUrl();

  return (
    <ExpandModalContainer>
      <SpectrogramTitle>
        <GraphicEqIcon fontSize="small" />
        Spectrogram (switch icon)
      </SpectrogramTitle>
      {topUrl && (
        <AudioSpectrogramViewer
          audioUrl={topUrl}
          spectrogramPlotType={SpectrogramType.TOP}
        />
      )}
      {bottomUrl && (
        <AudioSpectrogramViewer
          audioUrl={bottomUrl}
          spectrogramPlotType={SpectrogramType.BOTTOM}
        />
      )}
    </ExpandModalContainer>
  );
};
