import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import {
  AnchorValidationModalContainer,
  AnchorValidationOverlay,
  CloseButtonWrapper,
  SpectrogramContainer,
} from "./AnchorValidationModal.styles";
import { AudioSpectrogramModal } from "./audioSpectrogram/AudioSpectrogram";
import { useHandleEscape } from "../../shared/components/userInputWithIcon/hooks/useHandleEscape";
import { useMassiviAppStore } from "../../store/useStore";

export const AnchorValidationModal = () => {
  const isAnchorValidationModalOpen = useMassiviAppStore(
    (state) => state.anchorValidationSection.isAnchorValidationModalOpen,
  );
  const setIsAnchorValidationModalOpen = useMassiviAppStore(
    (state) => state.anchorValidationSection.setIsAnchorValidationModalOpen,
  );

  useHandleEscape(isAnchorValidationModalOpen, () =>
    setIsAnchorValidationModalOpen(false));

  return createPortal(
    <AnchorValidationOverlay open={isAnchorValidationModalOpen}>
      <AnchorValidationModalContainer>
        <SpectrogramContainer>
          <AudioSpectrogramModal/>
        </SpectrogramContainer>
        <CloseButtonWrapper onClick={() => setIsAnchorValidationModalOpen(false)}>
          <CloseIcon fontSize="medium" />
        </CloseButtonWrapper>
      </AnchorValidationModalContainer>
    </AnchorValidationOverlay>,
    document.body
  );
};
