import React from 'react';
import {
    View, Keyboard, TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import {InputTheme} from '../../components/InputTheme';
import {ButtonTheme} from '../../components/ButtonTheme';
import {FontAwesomeIcon} from '../../components/Icon';
import { connect } from 'react-redux';
import { newPasswordChanged, confirmNewPasswordChanged, newPasswordChangeToAccount } from '../../redux/actions/UserSettingAction';

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

//รับ state ปัจจุบัน แล้ว return เป็น object 
//จากเดิม state เป็น ({auth}) เพราะใช้หลักการ Destructuring
const mapStateToProps = (state:any) => {
    const { new_password, confirm_new_password, loading_new_password, error_new_password, } = state.userSettingPasswordChange;//state ที่ต้องการใช้เอามาบางส่วนได้
    //ถ้า return {email:email} จะเขียนได้เป็น {email} ได้สำหรับ object
    return { new_password, confirm_new_password, loading_new_password, error_new_password, };
};
//connect ให้ทั้ง state และ action เป็น props ของ LoginForm 
//As the second argument passed in to connect, mapDispatchToProps is used for dispatching actions to the store.
export default connect(mapStateToProps, {
    newPasswordChanged,
    confirmNewPasswordChanged,
    newPasswordChangeToAccount,
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
    
    
});
