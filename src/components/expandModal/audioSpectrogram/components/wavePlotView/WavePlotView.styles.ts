import { alpha, Box, styled } from "@mui/material";

export const WavePlotContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden'
})

export const WavePlotWrapper = styled(Box)({
    position: 'relative',
    width: '100%',
    flex: 1,
    minHeight: 0,
    cursor: 'crosshair'
})

export const SelectionHighlight = styled(Box)(({theme}) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: alpha(theme.palette.primary.main, 0.25),
    borderLeft: `1px solid ${theme.palette.primary.main}`,
    borderRight: `1px solid ${theme.palette.primary.main}`,
    pointerEvents: 'none',
    zIndex: theme.zIndex.appBar
}))

export const ResetZoomButton = styled(Box)(({theme}) => ({
    padding: theme.spacing(1),
    "& button": {
        color: theme.palette.common.white,
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper
    }
}))
