import React from 'react';
import {
    View, Keyboard, TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import { InputTheme } from '../../components/InputTheme';
import { ButtonTheme } from '../../components/ButtonTheme';
import { FontAwesomeIcon } from '../../components/Icon';
import { Text } from '../../components/Themed';
import { connect } from 'react-redux';
import { newPasswordChanged, confirmNewPasswordChanged, newPasswordChangeToAccount, clearDataChangePassword } from '../../redux/actions/index';
import Colors from '../../constants/Colors';

interface Props {
    navigation: any,
    newPasswordChanged: any,
    confirmNewPasswordChanged: any,
    newPasswordChangeToAccount: any,
    new_password: any,
    confirm_new_password: any,
    error_new_password: any,
    loading_new_password: any,
    clearDataChangePassword: any,
    isChangePasswordSuccess: any,
    isError: any,
}

class UserSettingPasswordChangedScreen extends React.Component<Props>{
    state = {
        buttonDisable: true,
    }

    onNewPasswordChanged = (text: String) => {
        this.props.newPasswordChanged(text);
        this.buttonEnable();
    }

    onConfirmPasswordChanged = (text: String) => {
        this.props.confirmNewPasswordChanged(text);
        this.buttonEnable();
    }

    onButtonPress = () => {
        this.props.newPasswordChangeToAccount(this.props.new_password, this.props.confirm_new_password);
    }

    //ตรวจสอบว่ามีการใส่ในแต่ละช่องหมดหรือยัง
    buttonEnable = () => {
        if ((this.props.new_password.length > 0) && (this.props.confirm_new_password.length > 0)) {
            this.setState({ buttonDisable: false, });
        }
    }

    componentWillUnmount() {
        //ทำการเคลียร์ค่าก่อนออก
        this.props.clearDataChangePassword();
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>

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
                        />
                        <ButtonTheme
                            title="เปลี่ยนรหัสผ่าน"
                            disabled={this.state.buttonDisable}
                            onPress={this.onButtonPress.bind(this)}
                            loading={this.props.loading_new_password}
                        />
                        {
                            //ทำการตรวจสอบว่าเปลี่ยนรหัสผ่านสำเร็จหรือไม่
                            this.props.isChangePasswordSuccess ? (
                                <View style={styles.viewShowMessage}>
                                    <Text style={styles.textMessage}>เปลี่ยนรหัสผ่านเรียบร้อย</Text>
                                </View>
                            ) : (
                                <View></View>
                            )
                        }
                        {
                            //ทำการตรวจสอบว่ามีข้อผิดพลาดหรือไม่
                            this.props.isError ? (
                                <View style={styles.viewShowMessage}>
                                    <Text style={styles.testError}>{this.props.error_new_password}</Text>
                                </View>
                            ) : (
                                <View></View>
                            )
                        }
                    </View>

                </View>
            </TouchableWithoutFeedback>

        );
    }
}

//รับ state ปัจจุบัน แล้ว return เป็น object 
//จากเดิม state เป็น ({auth}) เพราะใช้หลักการ Destructuring
const mapStateToProps = (state: any) => {
    const { new_password, confirm_new_password, loading_new_password, error_new_password, isChangePasswordSuccess, isError } = state.userSettingPasswordChange;//state ที่ต้องการใช้เอามาบางส่วนได้
    //ถ้า return {email:email} จะเขียนได้เป็น {email} ได้สำหรับ object
    return { new_password, confirm_new_password, loading_new_password, error_new_password, isChangePasswordSuccess, isError };
};
//connect ให้ทั้ง state และ action เป็น props ของ LoginForm 
//As the second argument passed in to connect, mapDispatchToProps is used for dispatching actions to the store.
export default connect(mapStateToProps, {
    newPasswordChanged,
    confirmNewPasswordChanged,
    newPasswordChangeToAccount,
    clearDataChangePassword,
})(UserSettingPasswordChangedScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    secondContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    textMessage: {
        fontFamily: 'Kanit-Regular',
        fontSize: 16,
        color: Colors.light.textSuccess,
    },
    testError: {
        fontFamily: 'Kanit-Regular',
        fontSize: 14,
        color: Colors.light.textError,
    },
    viewShowMessage: {
        alignItems: 'center',
        marginTop: 5,
    }
});
