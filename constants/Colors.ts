const tintColorLight = '#9ccc65';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    headerBackgroundColor: tintColorLight,
    tint: tintColorLight,
    tintHeader: 'green',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    iconColor: 'green',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tintHeader: tintColorDark,
    headerBackgroundColor: undefined,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    iconColor: 'white',
  },
};