import { styled, Typography } from "@mui/material";

export const SpectrogramHeaderTitle = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(0.5, 1, 1),
    fontWeight: theme.typography.fontWeightMedium,
    letterSpacing: theme.typography.overline.letterSpacing,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: theme.palette.text.primary
}))
