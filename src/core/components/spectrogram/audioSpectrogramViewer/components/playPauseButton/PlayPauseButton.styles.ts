import { IconButton, styled } from "@mui/material";

export const PlayPauseIconButton = styled(IconButton)(({ theme }) => ({
    gridColumn: 2,
    gridRow: 1,
    minWidth: theme.spacing(12),
    height: theme.spacing(7),
    padding: theme.spacing(1, 3),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark
    },
    '& .MuiSvgIcon-root': {
        fontSize: theme.spacing(5)
    }
}))
