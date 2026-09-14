import { alpha, Box, Modal, styled } from "@mui/material";

export const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiBackdrop-root": {
    backgroundColor: alpha(theme.palette.common.black, 0.2),
  },
}));

export const StyledModalContentContainer = styled(Box)({
  display: "flex",
  width: "100vw",
  height: "92vh",
});

export const SpectrogramContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 3,
  marginRight: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
}));

export const CloseButtonWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "fixed",
  cursor: "pointer",
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  padding: theme.spacing(0.5),
}));
