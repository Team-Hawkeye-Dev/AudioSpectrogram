import CloseIcon from "@mui/icons-material/Close";
import {
  CloseButtonWrapper,
  SpectrogramContainer,
  StyledModal,
  StyledModalContentContainer,
} from "./ExpandModal.styles";
import { AudioSpectrogram } from "./audioSpectrogram/AudioSpectrogram";
import { useMassiviAppStore } from "../../store/useStore";

export const ExpandModal = () => {
  const isExpandPolygonModalOpen = useMassiviAppStore(
    (state) => state.anchorValidationSection.isAnchorValidationModalOpen,
  );
  const setIsExpandModalOpen = useMassiviAppStore(
    (state) => state.anchorValidationSection.setIsAnchorValidationModalOpen,
  );

  return (
    <StyledModal open={isExpandPolygonModalOpen} onClose={() => setIsExpandModalOpen(false)}>
      <StyledModalContentContainer>
        <CloseButtonWrapper onClick={() => setIsExpandModalOpen(false)}>
          <CloseIcon fontSize="medium" />
        </CloseButtonWrapper>
        <SpectrogramContainer>
          <AudioSpectrogram />
        </SpectrogramContainer>
      </StyledModalContentContainer>
    </StyledModal>
  );
};
