import React from 'react';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { Button } from 'react-native-elements';
import { StyleSheet } from 'react-native';

export const ButtonTheme = (props: any) => {
    return <Button {...props} titleStyle={[props.style, styles.titleStyle]} buttonStyle={[props.style, styles.buttonStyle]} />
}

const styles = StyleSheet.create({
    titleStyle: {
        fontFamily: 'Kanit-Medium',
        fontSize: 16,
    },
    buttonStyle: {
        marginTop: 10,
        borderRadius: 20,
        width: 250,
        backgroundColor: 'green',
    },

});