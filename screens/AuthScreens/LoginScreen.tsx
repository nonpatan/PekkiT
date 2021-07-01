import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { Text } from '../../components/Themed';
import { Logo } from '../../components/Logo';
import { Button } from 'react-native-elements';
import { AuthView } from '../../components/AuthView';
import { FontAwesomeIcon } from '../../components/Icon';
import { connect } from 'react-redux';
//import { emailChanged, passwordChanged, loginUser } from '../../redux/actions/index';
import { InputTheme } from '../../components/InputTheme';

interface Props {
    navigation: any,
    emailChanged: any,
    passwordChanged: any,
    loginUser: any,
    email: any,
    password: any,
    error: any,
    loading: any,
}

export default class LoginScreen extends React.Component<Props>{

    onEmailChange(text: String) {
        console.log('EmailChange');
        //this.props.emailChanged(text);//เรียกใช้ action ได้เลยเพราะได้ใส่ไว้ใน connect แล้ว
    }

    onPasswordChange(text: String) {
        console.log('PasswordChange');
        //this.props.passwordChanged(text);
    }

    onButtonPress() {
        console.log("ButtonPress");
        //const { email, password } = this.props;//เรียกใช้ state ได้เลยเพราะใส่ไว้ใน connect แล้ว
        //this.props.loginUser(email, password);
    }

    onResetPassword() {
        console.log('Reset');
        //this.props.navigation.navigate('ResetPassword');
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <AuthView style={styles.container}>
                    <Logo />

                    <AuthView style={styles.secondContainer}>
                        <AuthView style={styles.inputContainer}>
                            <InputTheme
                                placeholder='email@host.com'
                                leftIcon={
                                    <FontAwesomeIcon name="envelope" size={24} />
                                }
                                autoCorrect={false}
                                onChangeText={this.onEmailChange.bind(this)}
                                keyboardType='email-address'
                                value={this.props.email}
                            />
                        </AuthView>
                        <AuthView style={styles.inputContainer}>
                            <InputTheme
                                placeholder='password'
                                leftIcon={
                                    <FontAwesomeIcon name="unlock-alt" size={24} />
                                }
                                autoCorrect={false}
                                secureTextEntry={true}
                                onChangeText={this.onPasswordChange.bind(this)}
                                errorStyle={styles.inputErrorStyle}
                                errorMessage={this.props.error}
                                value={this.props.password}
                            />
                        </AuthView>
                        <Button
                            titleStyle={styles.buttonTitleStyle}
                            buttonStyle={styles.buttonStyle}
                            title="เข้าสู่ระบบ"
                            onPress={this.onButtonPress.bind(this)}
                            loading={this.props.loading}
                        />
                        <AuthView style={styles.signInForgetPassContainer}>
                            <TouchableOpacity onPress={this.onResetPassword.bind(this)}>
                                <Text style={styles.textSinInFogetStyle}>ลืมรหัสผ่าน</Text>
                            </TouchableOpacity>
                        </AuthView>
                    </AuthView>
                </AuthView>
            </TouchableWithoutFeedback>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    secondContainer: {
        flex: 6,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    inputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 20,
        marginBottom: 10,
        width: 250,
    },
    inputErrorStyle: {
        color: 'red',
        textAlign: 'center',
        fontFamily: 'Kanit-Regular',
    },
    buttonTitleStyle: {
        fontFamily: 'Kanit-Medium',
        color: '#cfff95',
        fontSize: 18
    },
    buttonStyle: {
        borderRadius: 20,
        marginBottom: 10,
        width: 250,
    },
    signInForgetPassContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        width: 250,
    },
    textSinInFogetStyle: {
        fontSize: 16,
        fontFamily: 'Kanit-Regular',
    }
})