import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { AudioSpectrogramViewer } from "./components/audioSpectrogramViewer/AudioSpectrogramViewer";
import { SpectrogramType } from "./consts/audioSpectrogram.consts";
import { useAudioSpectrogramUrl } from "./hooks/useAudioSpectrogramUrl";
import { useMassiviAppStore } from "../../../store/useStore";
import { ExpandModalContainer, SpectrogramTitle } from "./AudioSpectrogram.styles";

export const AudioSpectrogram = () => {
  const topGuid = useMassiviAppStore((state) => state.expandSection.topMetadata?.topGuid ?? null);
  const bottomGuid = useMassiviAppStore((state) => state.expandSection.bottomMetadata?.bottomGuid ?? null);

  const topUrl = useAudioSpectrogramUrl(topGuid, SpectrogramType.TOP);
  const bottomUrl = useAudioSpectrogramUrl(bottomGuid, SpectrogramType.BOTTOM);

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
