import React from 'react';
import { View } from 'react-native';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

export const AuthView = (props: any) => {

    const color = useColorScheme();
    let backgroundColor = '';
    if (color == 'light') {
        backgroundColor = '#9ccc65';
    }
    else {
        backgroundColor = Colors[color].background;
    }

    return <View {...props} style={[props.style, { backgroundColor }]} />;

}