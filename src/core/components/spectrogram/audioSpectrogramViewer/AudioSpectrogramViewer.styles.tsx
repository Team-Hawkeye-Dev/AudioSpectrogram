import { Box, styled } from "@mui/material";

export const SpectrogramViewerRootContainer = styled(Box)({
    display: 'flex',
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflow: 'hidden'
})

export const SpectrogramRowContainer = styled(Box)(({theme}) => ({
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
    minHeight: 0,
})
