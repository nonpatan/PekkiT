import React from 'react';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { ButtonGroup } from 'react-native-elements';
import { StyleSheet } from 'react-native';

export const ButtonGroupTheme = (props: any) => {
    let backgroundColor;
    const color = useColorScheme();
    backgroundColor = Colors[color].background;

    return <ButtonGroup {...props} containerStyle={[styles.containerStyle,{backgroundColor}]} selectedButtonStyle={styles.buttonGroupButtonStyle} 
    selectedTextStyle={styles.buttonGroupSelectedTextStyle} textStyle={styles.buttonGroupTextStyle} />
}

const styles = StyleSheet.create({
    titleStyle: {
        fontFamily: 'Kanit-Medium',
        fontSize: 14,
    },
    containerStyle: {
        flex:1,
        height: 60,
    },
    buttonGroupButtonStyle: {
        backgroundColor: 'green',
    },
    buttonGroupSelectedTextStyle: {
        fontFamily: 'Kanit-Medium',
        fontSize: 14,
    },
    buttonGroupTextStyle: {
        fontFamily: 'Kanit-Medium',
        fontSize: 14,
        color: 'green',
    },
});