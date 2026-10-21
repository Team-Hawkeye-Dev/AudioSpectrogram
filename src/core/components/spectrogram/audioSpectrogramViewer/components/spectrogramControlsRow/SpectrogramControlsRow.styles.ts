import { Box, Button, styled } from "@mui/material";

export const SpectrogramControlsArea = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexShrink: 0,
    boxSizing: 'border-box',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1)
}))

export const ResetZoomButton = styled(Button)(({ theme }) => ({
    gridColumn: 1,
    gridRow: 1,
    justifySelf: 'start',
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
}))
