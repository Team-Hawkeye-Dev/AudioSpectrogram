import { useEffect } from "react";
import { ExpandModal } from "./components/expandModal/ExpandModal";
import { VISIBLE_WINDOW_SECONDS } from "./components/expandModal/audioSpectrogram/consts/audioSpectrogram.consts";
import { useMassiviAppStore } from "./store/useStore";

function App() {
  const setIsExpandModalOpen = useMassiviAppStore(
    (state) => state.expandSection.setIsExpandModalOpen,
  );
  const setTopMetadata = useMassiviAppStore(
    (state) => state.expandSection.setTopMetadata,
  );
  const setBottomMetadata = useMassiviAppStore(
    (state) => state.expandSection.setBottomMetadata,
  );

  useEffect(() => {
    setTopMetadata({
      topGuid: crypto.randomUUID(),
      startSliceTime: 0,
      endSliceTime: VISIBLE_WINDOW_SECONDS,
    });
    setBottomMetadata({
      bottomGuid: crypto.randomUUID(),
      startSliceTime: 0,
      endSliceTime: VISIBLE_WINDOW_SECONDS,
    });
    setIsExpandModalOpen(true);
  }, [setTopMetadata, setBottomMetadata, setIsExpandModalOpen]);

  return <ExpandModal />;
}

export default App;
