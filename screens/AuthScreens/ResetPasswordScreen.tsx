import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { Text } from '../../components/Themed';
import { Logo } from '../../components/Logo';
import { Button } from 'react-native-elements';
import { AuthView } from '../../components/AuthView';
import { FontAwesomeIcon } from '../../components/Icon';
import { connect } from 'react-redux';
//import { emailResetChanged, resetPassword, initailResetPassword } from '../../redux/actions/index';
import { InputTheme } from '../../components/InputTheme';

interface Props {
    navigation: any,
    emailResetChanged: any,
    resetPassword: any,
    initailResetPassword: any,
    email_reset: any,
    email_reset_success: any,
    email_reset_err: any,
    email_reset_loading:any,
}

export default class ResetPasswordScreen extends React.Component<Props>{

    state = {
        buttonDisable: true,
    }

    onEmailChange(text: any) {

        console.log('EmailChange');
        //this.props.emailResetChanged(text);//เรียกใช้ action ได้เลยเพราะได้ใส่ไว้ใน connect แล้ว
        //this.buttonEnable();
    }

    onButtonPress() {

        console.log('ButtonPress');
        /*if (this.props.email_reset.length > 0) {
            this.props.resetPassword(this.props.email_reset);//ทำการส่ง รหัสผ่านใหม่ไปยังอีเมลส์
        }*/
    }

    //ตรวจสอบว่ามีการใส่ในแต่ละช่องหมดหรือยัง
    buttonEnable = () => {
        console.log('ButtonEnable');
        /*
        if (this.props.email_reset.length > 0) {
            this.setState({ buttonDisable: false });
        }*/
    }

    componentDidMount() {
        console.log('DidMount');
        //กำหนดค่าเริ่มต้นกันก่อน ไม่งั้นค่า success จะค้างเป็น true ตลอดเวลากดอะไรใน text box มันจะไปหน้าหลักเลย
        //this.props.initailResetPassword();
    }

    componentDidUpdate() {//ถ้าใส่ตรง DidMouth มันจะทำงานครั้งเดียวตอนโหลดครั้งแรก แต่ถ้าใส่ DidUpdate จะทำหลายครั้งถ้ามีการเปลี่ยนแปลง
        console.log('Update');
        /*if (this.props.email_reset_success) {
            this.props.navigation.goBack();
        }*/
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <AuthView style={styles.container}>
                    <Logo />

                    <AuthView style={styles.secondContainer}>
                        <AuthView style={styles.inputContainer}>
                            <InputTheme
                                placeholder='อีเมล ที่ได้ลงทะเบียนไว้'
                                leftIcon={
                                    <FontAwesomeIcon name="envelope" size={24} />
                                }
                                autoCorrect={false}
                                onChangeText={this.onEmailChange.bind(this)}
                                keyboardType='email-address'
                                value={this.props.email_reset}
                                errorStyle={styles.inputErrorStyle}
                                errorMessage={this.props.email_reset_err}
                            />
                        </AuthView>
                        <Button
                            titleStyle={styles.buttonTitleStyle}
                            buttonStyle={styles.buttonStyle}
                            title="ส่งรหัสผ่านใหม่"
                            onPress={this.onButtonPress.bind(this)}
                            loading={this.props.email_reset_loading}
                            disabled={this.state.buttonDisable}
                        />
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