import CloseIcon from "@mui/icons-material/Close";
import {
  CloseButtonWrapper,
  SpectrogramContainer,
  StyledModal,
  StyledModalContentContainer,
} from "./ExpandModal.styles";
import { Spectrogram } from "./spectrogram /Spectrogram";

export const ExpandModal = () => {
  return (
    <StyledModal open={true}>
      <StyledModalContentContainer>
        <CloseButtonWrapper>
          <CloseIcon fontSize="medium" />
        </CloseButtonWrapper>
        <SpectrogramContainer>
          <Spectrogram />
        </SpectrogramContainer>
      </StyledModalContentContainer>
    </StyledModal>
  );
};
