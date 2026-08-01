import { colors } from './colors';

export const theme = {
  colors,
  borderRadius: {
    card: '1rem', // 16px
    button: '0.75rem', // 12px
    input: '0.75rem',
    badge: '0.5rem',
  },
  shadows: {
    card: '0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
    hover: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
    button: '0 1px 2px 0 rgba(37, 99, 235, 0.25)',
  },
};

export default theme;