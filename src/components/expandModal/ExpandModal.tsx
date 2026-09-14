import CloseIcon from "@mui/icons-material/Close";
import {
  CloseButtonWrapper,
  SpectrogramContainer,
  StyledModal,
  StyledModalContentContainer,
} from "./ExpandModal.styles";
import { AudioSpectrogram } from "./audioSpectrogram/AudioSpectrogram";

export const ExpandModal = () => {
  return (
    <StyledModal open={true}>
      <StyledModalContentContainer>
        <CloseButtonWrapper>
          <CloseIcon fontSize="medium" />
        </CloseButtonWrapper>
        <SpectrogramContainer>
          <AudioSpectrogram />
        </SpectrogramContainer>
      </StyledModalContentContainer>
    </StyledModal>
  );
};
