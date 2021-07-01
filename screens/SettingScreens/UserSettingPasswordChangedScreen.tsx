import React from 'react';
import {
    View, Keyboard, TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import {InputTheme} from '../../components/InputTheme';
import {ButtonTheme} from '../../components/ButtonTheme';
import {FontAwesomeIcon} from '../../components/Icon';
//import { connect } from 'react-redux';
//import { newPasswordChanged, confirmNewPasswordChanged, newPasswordChangeToAccount } from '../../redux/actions/UserSettingAction';

interface Props {
    navigation: any,
    newPasswordChanged: any,
    confirmNewPasswordChanged: any,
    newPasswordChangeToAccount: any,
    new_password:any,
    confirm_new_password:any,
    error_new_password:any,
    loading_new_password:any,
}

export default class UserSettingPasswordChangedScreen extends React.Component<Props>{
    state = {
        buttonDisable: true,
    }

    onNewPasswordChanged = (text: String) => {
        console.log('newPasswordChanged');
        /*this.props.newPasswordChanged(text);
        this.buttonEnable();*/
    }

    onConfirmPasswordChanged = (text: String) => {
        console.log('confirmPasswordCahgned');
        /*this.props.confirmNewPasswordChanged(text);
        this.buttonEnable();*/
    }

    onButtonPress = () => {
        console.log('buttonPress');
        //this.props.newPasswordChangeToAccount(this.props.new_password, this.props.confirm_new_password);
    }

    //ตรวจสอบว่ามีการใส่ในแต่ละช่องหมดหรือยัง
    buttonEnable = () => {
        console.log('buttonEnable');
        /*if ((this.props.new_password.length > 0) && (this.props.confirm_new_password.length > 0)) {
            this.setState({ buttonDisable: false, });
        }*/
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={styles.secondContainer}>
                            <InputTheme
                                placeholder='รหัสผ่านใหม่'
                                leftIcon={
                                    <FontAwesomeIcon name="unlock-alt" size={16} />
                                }
                                autoCorrect={false}
                                secureTextEntry={true}
                                value={this.props.new_password}
                                onChangeText={this.onNewPasswordChanged.bind(this)}
                            />
                            <InputTheme
                                placeholder='ยืนยันรหัสผ่านใหม่'
                                leftIcon={
                                    <FontAwesomeIcon name="unlock-alt" size={16} />
                                }
                                autoCorrect={false}
                                secureTextEntry={true}
                                value={this.props.confirm_new_password}
                                onChangeText={this.onConfirmPasswordChanged.bind(this)}
                                errorMessage={this.props.error_new_password}
                            />
                            <ButtonTheme
                                title="เปลี่ยนรหัสผ่าน"
                                disabled={this.state.buttonDisable}
                                onPress={this.onButtonPress.bind(this)}
                                loading={this.props.loading_new_password}
                            />
                        </View>
                </TouchableWithoutFeedback>
            </View>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    secondContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    
    
});
