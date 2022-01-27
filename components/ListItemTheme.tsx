import React from 'react';
import { ListItem } from 'react-native-elements'
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

export const ListItemTheme = (props: any) => {
    const color = useColorScheme();
    let backgroundColor = '';
    backgroundColor = Colors[color].backgroundItem;

    return <ListItem {...props} containerStyle={[props.style, { backgroundColor }]} />
}

export const ListItemContent = (props: any) => {
    return <ListItem.Content {...props} />
}

export const ListItemSubtitle = (props: any) => {
    const color = useColorScheme();
    let colorTitle = '';
    colorTitle = Colors[color].text;

    return <ListItem.Subtitle {...props} style={[props.style, { color: colorTitle, fontFamily: 'Kanit-Light', }]} />
}

export const ListItemChevron = (props: any) => {
    return <ListItem.Chevron {...props} />
}

export const ListItemTitle = (props: any) => {
    const color = useColorScheme();
    let colorTitle = '';
    colorTitle = Colors[color].text;

    return <ListItem.Title {...props} style={[{ color: colorTitle, fontFamily: 'Kanit-Light', },props.style,]} />
}