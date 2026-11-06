import { styled, Typography } from "@mui/material";

export const SpectrogramHeaderTitle = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(0.5, 1, 1),
    marginBottom: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontWeight: theme.typography.fontWeightMedium,
    letterSpacing: theme.typography.overline.letterSpacing,
    textTransform: 'uppercase',
    color: theme.palette.text.primary
}))
