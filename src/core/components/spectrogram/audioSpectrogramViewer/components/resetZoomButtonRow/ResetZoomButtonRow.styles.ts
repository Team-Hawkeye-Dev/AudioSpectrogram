import { Box, Button, styled } from "@mui/material";

export const ResetZoomButtonArea = styled(Box)(({ theme }) => ({
    flexShrink: 0,
    boxSizing: 'border-box',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1)
}))

export const ResetZoomButton = styled(Button)(({ theme }) => ({
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
}))
