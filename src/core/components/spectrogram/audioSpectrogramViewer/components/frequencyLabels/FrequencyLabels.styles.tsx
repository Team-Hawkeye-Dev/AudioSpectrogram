import { Box, styled, Typography } from "@mui/material";
import { TIME_AXIS_HEIGHT_PX } from "../../consts";

export const FrequencyLabelList = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '33vh',
    padding: theme.spacing(0.5, 1, 0.5, 0),
    paddingBottom: TIME_AXIS_HEIGHT_PX
}))

export const FrequencyLabel = styled(Typography)(({theme}) => ({
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(1)
}))
