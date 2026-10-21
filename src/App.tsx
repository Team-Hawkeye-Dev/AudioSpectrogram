import { useEffect } from "react";
import { ExpandModal } from "./components/expandModal/ExpandModal";
import { SpectrogramType } from "./components/expandModal/audioSpectrogram/consts/audioSpectrogram.consts";
import { useMassiviAppStore } from "./store/useStore";

function App() {
  const setIsExpandModalOpen = useMassiviAppStore(
    (state) => state.anchorValidationSection.setIsAnchorValidationModalOpen,
  );
  const setSpectrogramAudioGuid = useMassiviAppStore(
    (state) => state.anchorValidationSection.setSpectrogramAudioGuid,
  );

  useEffect(() => {
    setSpectrogramAudioGuid(SpectrogramType.TOP, crypto.randomUUID());
    setSpectrogramAudioGuid(SpectrogramType.BOTTOM, crypto.randomUUID());
    setIsExpandModalOpen(true);
  }, [setSpectrogramAudioGuid, setIsExpandModalOpen]);

  return <ExpandModal />;
}

export default App;
