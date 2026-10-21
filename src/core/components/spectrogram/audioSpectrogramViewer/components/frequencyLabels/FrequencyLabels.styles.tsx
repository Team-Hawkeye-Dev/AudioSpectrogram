import { Box, styled, Typography } from "@mui/material";
import { TIME_AXIS_HEIGHT_PX } from "../../consts";

export const FrequencyLabelList = styled(Box)(({theme}) => ({
    position: 'relative',
    flexShrink: 0,
    width: theme.spacing(5),
    height: '33vh',
    marginRight: theme.spacing(1)
}))

export const FrequencyLabelTrack = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: TIME_AXIS_HEIGHT_PX
})

export const FrequencyLabel = styled(Typography)(({theme}) => ({
    position: 'absolute',
    right: 0,
    transform: 'translateY(-50%)',
    lineHeight: 1,
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.text.secondary
}))
