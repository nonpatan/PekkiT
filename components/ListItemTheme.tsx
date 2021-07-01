import React from 'react';
import { ListItem } from 'react-native-elements'
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

export const ListItemContainer = (props: any) => {
    const color = useColorScheme();
    let backgroundColor = '';
    if (color == 'light') {
        backgroundColor = 'white';
    }
    else {
        backgroundColor = Colors[color].background;
    }

    return <ListItem {...props} containerStyle={[props.style, { backgroundColor }]} />
}