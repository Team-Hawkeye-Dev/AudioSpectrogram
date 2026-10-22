import { alpha, Box, styled } from "@mui/material";

export const WavePlotContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden'
})

export const WavePlotWrapper = styled(Box)({
    position: 'relative',
    width: '100%',
    flex: 1,
    minHeight: 0,
    cursor: 'crosshair'
})

export const ZoomSelectionHighlight = styled(Box)(({theme}) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: alpha(theme.palette.primary.main, 0.25),
    borderLeft: `1px solid ${theme.palette.primary.main}`,
    borderRight: `1px solid ${theme.palette.primary.main}`,
    pointerEvents: 'none',
    zIndex: theme.zIndex.appBar
}))

export const ProgressTimeTooltip = styled(Box)(({theme}) => ({
    position: 'absolute',
    top: theme.spacing(0.5),
    padding: theme.spacing(0.25, 0.75),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.75),
    color: theme.palette.common.white,
    fontSize: theme.typography.caption.fontSize,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: theme.zIndex.tooltip
}))
