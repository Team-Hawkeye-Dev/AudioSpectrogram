import { Box, styled, Typography } from "@mui/material";

export const ExpandModalContainer = styled(Box)(({ theme }) => ({
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
  fontsize: theme.typography.fontSize
}));
