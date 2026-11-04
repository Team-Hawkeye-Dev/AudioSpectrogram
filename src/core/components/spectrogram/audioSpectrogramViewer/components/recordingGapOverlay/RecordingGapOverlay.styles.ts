import { alpha, Box, Button, styled, Typography } from "@mui/material";
import { TIME_AXIS_HEIGHT_PX } from "../../consts";

export const RecordingGapArea = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: TIME_AXIS_HEIGHT_PX,
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(0.5),
    containerType: 'inline-size',
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
    backgroundImage: `repeating-linear-gradient(-45deg, ${alpha(theme.palette.text.primary, 0.05)} 0 ${theme.spacing(1)}, transparent ${theme.spacing(1)} ${theme.spacing(2)})`,
    borderRight: `${theme.spacing(0.25)} dashed ${theme.palette.text.secondary}`,
    cursor: 'default',
    zIndex: theme.zIndex.mobileStepper
}))

export const RecordingGapText = styled(Typography)(({ theme }) => ({
    [`@container (max-width: ${theme.spacing(12)})`]: {
        display: 'none'
    }
}))

export const RecordingStartTime = styled(RecordingGapText)(({ theme }) => ({
    fontWeight: theme.typography.fontWeightBold
}))

export const GoToRecordingButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    [`@container (max-width: ${theme.spacing(22)})`]: {
        display: 'none'
    }
}))
