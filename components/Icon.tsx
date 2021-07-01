import React from 'react';
import { FontAwesome,Ionicons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

export const FontAwesomeIcon = (props: any) => {
    const systemColor = useColorScheme();
    let color = Colors[systemColor].iconColor

    return <FontAwesome {...props} style={[props.style, { color }]} />
}

export const IoniconsIcon = (props:any)=>{
    const systemColor = useColorScheme();
    let color = Colors[systemColor].iconColor

    return <Ionicons {...props} style={[props.style, { color }]} />
}