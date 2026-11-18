import { alpha, IconButton, styled } from "@mui/material";

export const PlayPauseIconButton = styled(IconButton)(({ theme }) => ({
    padding: theme.spacing(1, 3),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        backgroundColor: alpha(theme.palette.background.paper, 0.7)

    },
    '& .MuiSvgIcon-root': {
        fontSize: theme.spacing(5)
    }
}))
