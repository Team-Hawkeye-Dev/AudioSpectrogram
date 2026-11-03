import { Box, styled, Typography } from "@mui/material";

export const AnchorValidationModalContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  flex: 1,
}));

export const SpectrogramTitle = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontSize: theme.typography.fontSize
}));

export const SpectrogramPlotArea = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  flex: 1, 
  minHeight: 0
}));

export const SpectrogramLoadingOverlay = styled(Box)(() => ({
  position: 'absolute',
  inset: 0, 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1
}));

export const SpectrogramPlotGroup = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'ready',
})<{ready: boolean}>(({ theme, ready }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  opacity: ready ? 1 : 0,
  pointerEvents: ready ? 'auto' : 'none',
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.short
  })
}));

