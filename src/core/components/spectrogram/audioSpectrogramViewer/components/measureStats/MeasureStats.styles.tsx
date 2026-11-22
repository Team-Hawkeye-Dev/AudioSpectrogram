import { alpha, Box, styled, Typography } from "@mui/material";

export const MeasureStatsContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5)
}))

export const MeasureStatsRow = styled(Box)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5)
}))

export const MeasureStatsHeading = styled(Typography)(({theme}) => ({
    minWidth: theme.spacing(5),
    fontSize: theme.typography.overline.fontSize,
    letterSpacing: theme.typography.overline.letterSpacing,
    textTransform: 'uppercase',
    color: theme.palette.text.secondary
}))

export const MeasureStatsValue = styled(Typography)(({theme}) => ({
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    fontVariantNumeric: 'tabular-nums'
}))

export const MeasureStatsDifference = styled(MeasureStatsValue)(({theme}) => ({
    marginLeft: 'auto',
    padding: theme.spacing(0.25, 0.75),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.success.main, 0.16),
    color: theme.palette.success.main,
    fontSize: theme.typography.caption.fontSize,
    whiteSpace: 'nowrap'
}))
