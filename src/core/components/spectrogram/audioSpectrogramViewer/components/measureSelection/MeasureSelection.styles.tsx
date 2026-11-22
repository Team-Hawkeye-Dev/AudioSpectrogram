import { alpha, Box, styled, Tooltip, tooltipClasses, Typography, type TooltipProps } from "@mui/material";

export const MeasureSelectionBox = styled(Box)(({theme}) => ({
    position: 'absolute',
    border: `2px solid ${alpha(theme.palette.common.white, 0.9)}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.08),
    boxShadow: `0 0 0 1px ${alpha(theme.palette.common.black, 0.5)}`,
    zIndex: theme.zIndex.appBar,
    transition: theme.transitions.create('background-color', {
        duration: theme.transitions.duration.shortest
    }),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.18)
    }
}))

export const MeasureTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 'none',
        padding: theme.spacing(1, 1.5),
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: 'blur(6px)',
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[8]
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: alpha(theme.palette.background.paper, 0.7),
        '&::before': {
            border: `1px solid ${theme.palette.divider}`
        }
    }
}))

export const MeasureStatsGrid = styled(Box)(({theme}) => ({
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    columnGap: theme.spacing(1.5),
    rowGap: theme.spacing(0.5),
    alignItems: 'baseline'
}))

export const MeasureStatsHeading = styled(Typography)(({theme}) => ({
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
