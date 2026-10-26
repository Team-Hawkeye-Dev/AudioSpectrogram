import { Box, Button, IconButton, styled } from "@mui/material";

export const DetectionsNavigatorArea = styled(Box)(({ theme }) => ({
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'stretch',
    overflow: 'hidden',
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
}))

export const DetectionsButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    padding: theme.spacing(1, 2),
    color: theme.palette.text.primary,
    borderLeft: `1px solid ${theme.palette.divider}`,
    borderRight: `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create('background-color', {
        duration: theme.transitions.duration.shorter
    }),
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    },
    '& .MuiButton-startIcon': {
        color: theme.palette.success.light
    }
}))

export const DetectionStepButton = styled(IconButton)(({ theme }) => ({
    borderRadius: 0,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    transition: theme.transitions.create(['background-color', 'color'], {
        duration: theme.transitions.duration.shorter
    }),
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.text.primary
    }
}))
