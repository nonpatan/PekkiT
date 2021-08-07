import React from 'react';
import { Card } from 'react-native-elements';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

export const CardTheme = (props: any) => {
    const color = useColorScheme();
    let backgroundColor = Colors[color].backgroundCard;

    return <Card {...props} containerStyle={[props.style, { backgroundColor }, { borderRadius: 20 }]} />
}

export const CardTitle = (props: any) => {
    const color = useColorScheme();
    let textColor = Colors[color].text;

    return <Card.Title {...props} style={[props.style, { color: textColor }, { fontFamily: 'Kanit-Regular'}]} />
}

export const CardDivider = (props:any)=>{
    return <Card.Divider {...props} />
}