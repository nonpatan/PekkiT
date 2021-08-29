const tintColorLight = '#9ccc65';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    backgroundCard:'#fff',
    backgroundItem:'#fff',
    headerBackgroundColor: tintColorLight,
    tint: tintColorLight,
    tintHeader: 'green',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    iconColor: 'green',
    textError: 'red',
    textSuccess:'green',//เอาไว้แสดงว่าทำเสร็จแระ
  },
  dark: {
    text: '#fff',
    background: '#000',
    backgroundCard: '#3f3d3d',
    backgroundItem: '#000',
    tint: tintColorDark,
    tintHeader: tintColorDark,
    headerBackgroundColor: undefined,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    iconColor: 'white',
    textError: 'red',
    textSuccess:'green',//เอาไว้แสดงว่าทำเสร็จแระ
  },
};