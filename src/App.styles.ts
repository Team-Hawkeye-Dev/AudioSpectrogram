import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const AppRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  maxWidth: 480,
  margin: '0 auto',
  padding: theme.spacing(6, 3),
}));

export const AppTitle = styled(Typography)({
  fontWeight: 600,
});

export const AppSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const ActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));
