import { Box, styled, Typography } from "@mui/material";

export const SpectrogramViewerRootContainer = styled(Box)({
    display: 'flex',
    flexDirection: "column",
    flex: 1,
    overflow: 'hidden'
})

export const SpectrogramRowContainer = styled(Box)(({theme}) => ({
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1)
}))

export const SpectrogramPlotRow = styled(Box)({
    display: 'flex',
    flex: 1,
})

export const FrequencyLabelList = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '33vh',
    padding: theme.spacing(0.5, 1, 0.5, 0)
}))

export const FrequencyLabel = styled(Typography)(({theme}) => ({
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(1)
}))
