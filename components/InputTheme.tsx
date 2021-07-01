import React from 'react';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { Input } from 'react-native-elements';
import { StyleSheet } from 'react-native';

export const InputTheme = (props: any) => {
    const systemColor = useColorScheme();
    let color = Colors[systemColor].text

    return <Input {...props} inputStyle={[props.style, { color }, styles.inputStyle]} errorStyle={[props.style, styles.inputErrorStyle]} />
}

const styles = StyleSheet.create({
    inputStyle: {
        marginLeft: 5,
        fontFamily: 'Kanit-Light',
        fontSize: 16,
    },
    inputErrorStyle: {
        color: 'red',
        textAlign: 'center',
        fontFamily: 'Kanit-Regular',
    },

});