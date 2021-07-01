//ไว้สำหรับแสดง โลโก้ โดยกำหนด flex:4 ไว้เลยพอดี
import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';



export const Logo = () => {
    return (
        <View style={styles.firstContainer}>
            <View style={styles.imgLogoContainer}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.imgLogo}
                />
            </View>
            <View>
                <Text style={styles.fontLogo}>MR.Pekki Service</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    firstContainer: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgLogo: {
        width: 100,
        height: 124,
    },
    imgLogoContainer: {
        marginBottom: 10,
    },
    fontLogo: {
        color: 'green',
        fontSize: 25,
        fontFamily: 'DancingScript-Bold',
    },
})