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

export const ViewActions = styled(Box)(({ theme }) => ({
    position: 'absolute',
    left: 0,
    display: 'flex',
    gap: theme.spacing(1)
}))

export const ResetZoomButton = styled(Button)(({ theme }) => ({
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
}))

export const SyncButton = styled(ResetZoomButton, {
    shouldForwardProp: (prop) => prop !== 'isSynced',
})<{ isSynced: boolean }>(({ theme, isSynced }) => ({
    paddingInline: theme.spacing(1.5),
    backgroundColor: isSynced ? theme.palette.primary.main : theme.palette.background.paper,
    transition: theme.transitions.create('background-color', {
        duration: theme.transitions.duration.shorter
    }),
    '&:hover': {
        backgroundColor: isSynced ? theme.palette.primary.dark : theme.palette.action.hover
    }
}))
