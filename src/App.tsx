import { useEffect } from "react";
import { AnchorValidationModal } from "./components/anchorValidationModal/AnchorValidationModal";
import { SpectrogramType } from "./components/anchorValidationModal/audioSpectrogram/consts/audioSpectrogram.consts";
import { useMassiviAppStore } from "./store/useStore";

function App() {
  const setIsAnchorValidationModalOpen = useMassiviAppStore(
    (state) => state.anchorValidationSection.setIsAnchorValidationModalOpen,
  );
  const setSpectrogramAudioGuid = useMassiviAppStore(
    (state) => state.anchorValidationSection.setSpectrogramAudioGuid,
  );

  useEffect(() => {
    setSpectrogramAudioGuid(SpectrogramType.TOP, crypto.randomUUID());
    setSpectrogramAudioGuid(SpectrogramType.BOTTOM, crypto.randomUUID());
    setIsAnchorValidationModalOpen(true);
  }, [setSpectrogramAudioGuid, setIsAnchorValidationModalOpen]);

  return <AnchorValidationModal />;
}

export default App;
