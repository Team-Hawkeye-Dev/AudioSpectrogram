import { alpha, Box, styled } from "@mui/material";

export const AnchorValidationOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{open: boolean}>(({ theme, open }) => ({
  position: 'fixed',
  inset: 0,
  display: open ? 'flex' : 'none',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.common.black, 0.2),
  backdropFilter: `blur(${theme.spacing(0.1)})`,
  zIndex: theme.zIndex.modal
}));

export const AnchorValidationModalContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100vw",
  height: "92vh",
  gap: theme.spacing(2)
}));

export const SpectrogramContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 3,
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
}));

export const ReportColumn = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1
}));

export const CloseButtonWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "fixed",
  cursor: "pointer",
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  padding: theme.spacing(0.5),
}));
