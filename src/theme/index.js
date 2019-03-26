import * as colors from './colors';

const theme = {
  borderRadius: '3px',
  colors: { ...colors },
  fontSizeSm: '12px',
  fontSize: '14px',
  fontSizeLg: '1rem',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Fira Sans",Oxygen-Sans,Ubuntu,"Helvetica Neue",sans-serif',
  pageGradient: 'linear-gradient(180deg, #1335B6 0%, #040C40 100%)',
  listitemHighlightGradient:
    'linear-gradient(90deg, rgba(210,38,242,0.5) 30%, rgba(8,24,127,0.5) 100%)',
  zIndex: {
    overlay: 20,
    above: 10,
    bump: 1,
    below: -1,
  },
};

export { colors };

export default theme;
