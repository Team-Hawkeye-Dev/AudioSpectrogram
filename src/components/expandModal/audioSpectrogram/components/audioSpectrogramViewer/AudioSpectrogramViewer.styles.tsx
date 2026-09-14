import { alpha, Box, styled, Typography } from "@mui/material";

export const SpectrogramViewerRootContainer = styled(Box)({
    display: 'flex',
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflow: 'hidden'
})

export const SpectrgoramRowContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1)
}))

export const SpectrogramPlotRow = styled(Box)({
    display: 'flex',
    flex: 1,
    minHeight: 0
})

export const WavePlotWrapper = styled(Box)(({theme}) => ({
    position: 'relative',
    flex: 1,
    minWidth: 0,
    marginBottom: theme.spacing(0.75),
    cursor: 'crosshair'
}))

export const SelectionHightlight = styled(Box)(({theme}) => ({
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

export const FrequencyLabelList = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: theme.spacing(0.5, 1, 0.5, 0)
}))

export const FrequencyLabel = styled(Typography)(({theme}) => ({
    fontSize: '12px',
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(1)
}))
