import { Box, Button, styled } from "@mui/material";

export const SpectrogramControlsArea = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1)
}))

export const ResetZoomButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    left: 0,
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
}))
