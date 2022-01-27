import {
    USER_SETTING_AVATAR_CHANGED_SUCCESS,
    USER_SETTING_PASSWORD_CHANGED,
    USER_SETTING_CONFIRM_PASSWORD_CHANGED,
    USER_SETTING_PASSWORD_CHANGED_INIT,
    USER_SETTING_PASSWORD_CHANGED_FAIL,
    USER_SETTING_PASSWORD_CHANGED_COMPLETE,
    USER_SETTING_USERPROFILE_INIT,
    USER_SETTING_USERPROFILE_FAIL,
    USER_SETTING_LOAD_USERPROFILE_SUCCESS,
    USER_SETTING_USERPROFILE_EDITPROFILE_FAIL,
    USER_SETTING_USERPROFILE_PREFIX_CHANGED,
    USER_SETTING_USERPROFILE_EDIT_INIT,
    USER_SETTING_USERPROFILE_EDITPROFILE_SUCCESS,
    USER_SETTING_USERPROFILE_NAME_CHANGED,
    USER_SETTING_USERPROFILE_SURNAME_CHANGED,
    USER_SETTING_USERPROFILE_TEL_CHANGED,
    USER_SETTING_USERPROFILE_STREET_CHANGED,
    USER_SETTING_USERPROFILE_PROVINCE_CHANGED,
    USER_SETTING_USERPROFILE_ZIPCODE_CHANGED,
    USER_SETTING_USERPROFILE_AMPHOE_CHANGED,
    USER_SETTING_USERPROFILE_ADD_INIT,
    USER_SETTING_USERPROFILE_SAVEPROFILE_SUCCESS,
    USER_SETTING_ABOUT_INIT,
    USER_SETTING_ABOUT_SUCCESS,
    USER_SETTING_ABOUT_FAIL,
    USER_SETTING_PASSWORD_CLEAR_DATA
} from '../types';

import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
//import ImageEditor from "@react-native-community/image-editor";
import * as ImageManipulator from "expo-image-manipulator";
import fireBaseConnect from '../actions/FireBaseConnect';

import * as MediaLibrary from 'expo-media-library';
import firebase from 'firebase';

export const changAvatar = () => {
    return async (dispatch: any) => {
        //บอกกับผู้ใช้ว่าจะใช้กล้อง

        const { status } = await MediaLibrary.requestPermissionsAsync();
        try {
            if (status === 'granted') {
                //ถ้าผู้ใช้อนุญาติให้ใช้กล้อง

                //console.log('choosing image granted...');
                ////////choosing image granted...////////
                //ImagePicker เข้าถึงรูปภาพและวีดีโอ หรือถ่ายรูป
                //launchImageLibraryAsync แสดงรูปภาพและวีดีโอ สำหรับ iOS ต้องมี Permissions ด้วย
                //If the user cancelled the picking, returns { cancelled: true }.
                //Otherwise, returns { cancelled: false, uri, width, height, type } where uri is a URI to the local media file
                let pickerResult = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,//จะแสดง UI เพื่อแก้ไขภาพหลังจากเลือกหรือไม่
                    aspect: [4, 3],//การระบุอัตราส่วนภาพ หากผู้ใช้ได้รับอนุญาตให้แก้ไขภาพ
                });


                if (!pickerResult.cancelled) {//ถ้าผู้ใช้ไม่ยกเลิกนะ returns { cancelled: true }.

                    const cropOption = {
                        originX: 0, originY: 0, width: pickerResult.width, height: pickerResult.height
                    };
                    let resizedUri = await ImageManipulator.manipulateAsync(pickerResult.uri,
                        [{ crop: cropOption }],
                        { compress: 1, format: ImageManipulator.SaveFormat.JPEG });

                    let uploadUrl = await fireBaseConnect.uploadImage(resizedUri.uri);//ได้ url ที่ upload ไป server

                    fireBaseConnect.updateAvatar(uploadUrl); //ทำการ update photoURL ใน User ของเราที่ firebase

                    changAvatarSuccess(dispatch, uploadUrl);
                }
            }
        } catch (err: any) {
            Alert.alert('Upload image error:', err.message);
        }
    }
}

export const newPasswordChanged = (password: String) => {
    return {
        type: USER_SETTING_PASSWORD_CHANGED,
        payload: password,
    }
}

export const confirmNewPasswordChanged = (confirmPassword: String) => {
    return {
        type: USER_SETTING_CONFIRM_PASSWORD_CHANGED,
        payload: confirmPassword,
    }
}

export const newPasswordChangeToAccount = (newPassword: String, confirmPassword: String) => {
    return async (dispatch: any) => {
        //Init
        initNewPassword(dispatch);

        //ตรวจสอบ Password
        if (newPassword === confirmPassword) {
            //ถ้ารหัสผ่านเหมือนกัน
            try {
                await fireBaseConnect.passwordChanged(newPassword);
                changNewPasswordSuccess(dispatch);
            }
            catch (error: any) {
                changeNewPasswordFail(dispatch, error.message);
            }

        }
        else {
            changeNewPasswordFail(dispatch, 'รหัสผ่านใหม่กับยืนยันรหัสผ่านไม่ตรงกัน');
        }

    }
}

/**
 * ทำการรีเซ็ทข้อมูลก่อนออกจากหน้าปัจจุบัน
 * @returns 
 */
export const clearDataChangePassword = () => {
    return {
        type: USER_SETTING_PASSWORD_CLEAR_DATA,
    }
}

/**
 * แสดงข้อมูลผู้ใช้ จาก Technician
 */
export const showUserProfile = () => {
    return async (dispatch: any) => {
        try {
            //show loading
            initLoadingProfile(dispatch);

            const user = firebase.auth().currentUser;
            if (user !== null) {
                //ทำการโหลดข้อมูลช่าง
                const database = firebase.database().ref(`technician/${user.uid}`);
                database.on('value', snapshot => {

                    if (snapshot.exists()) {
                        //ถ้ามีข้อมูล
                        loadUserProfileSuccess(dispatch, snapshot.val());
                    }
                    else {
                        //ถ้าไม่มีข้อมูล
                        loadUserProfileFail(dispatch, 'ไม่มีข้อมูล');
                    }
                });
            }
            else {
                loadUserProfileFail(dispatch, 'ไม่มี currentUser');
            }
        }
        catch (err: any) {
            loadUserProfileFail(dispatch, err.message);
        }
    }
}

export const namePrefixChanged = (prefix: any) => {
    return {
        type: USER_SETTING_USERPROFILE_PREFIX_CHANGED,
        payload: prefix,
    }
}

/**แก้ไขข้อมูลผู้ใช้ ยกเว้น ที่อยู่ */
export const editUserProfile = (key: any, value: String) => {
    return async (dispatch: any) => {
        try {
            //ตรวจสอบข้อมูลเบื้องต้นก่อน
            if (key !== '' && value !== '') {
                //กำหนดค่าเริ่มต้นก่อน
                inintEditProfile(dispatch);

                let result = await fireBaseConnect.editTechnicianProfile(key, value);

                if (result === 'complete') {
                    editUserProfileSucess(dispatch, key, value);
                }
            }
            else {
                editUserProfileFail(dispatch, 'กรุณาป้อนข้อมูลให้ครบถ้วน');
            }
        }
        catch (err: any) {
            editUserProfileFail(dispatch, err.message);
        }
    }
}

export const nameChanged = (name: String) => {
    return {
        type: USER_SETTING_USERPROFILE_NAME_CHANGED,
        payload: name,
    }
}

export const surNameChanged = (surname: String) => {
    return {
        type: USER_SETTING_USERPROFILE_SURNAME_CHANGED,
        payload: surname,
    }
}

export const telChanged = (tel: String) => {
    return {
        type: USER_SETTING_USERPROFILE_TEL_CHANGED,
        payload: tel,
    }
}

/**เปลี่ยน ที่อยู่ บ้านเลขที่ */
export const streetChanged = (street: String) => {
    return {
        type: USER_SETTING_USERPROFILE_STREET_CHANGED,
        payload: street,
    }
}

/**เปลียน ที่อยู่ จังหวัด */
export const provinceChanged = (province: String) => {
    return {
        type: USER_SETTING_USERPROFILE_PROVINCE_CHANGED,
        payload: province,
    }
}

/**แก้ไขที่อยู่ */
export const editAddressUserProfile = (street: String, province: String, amphoe: String, zipcode: String) => {

    return async (dispatch: any) => {
        try {
            //ตรวจสอบเบื้องต้น
            if (street !== '' && province !== '' && amphoe !== '' && zipcode !== '') {
                //กำหนดค่าเริ่มต้นก่อน
                inintEditProfile(dispatch);

                let result = await fireBaseConnect.editAddressTechnicianProfile(street, province, amphoe, zipcode);

                if (result === 'complete') {
                    //เมื่อ update เรียบร้อย
                    let value = {
                        street,
                        province,
                        amphoe,
                        zipcode,
                    };
                    editUserProfileSucess(dispatch, 'address', value);
                }
            }
            else {
                Alert.alert('มีข้อผิดพลาด', 'กรุณาป้อนข้อมูลให้ครบถ้วน');
            }
        }
        catch (err: any) {
            Alert.alert('ข้อผิดพลาด', err.message);
        }
    }
}

export const zipcodeChanged = (zipcode: String) => {
    return {
        type: USER_SETTING_USERPROFILE_ZIPCODE_CHANGED,
        payload: zipcode,
    }
}

export const amphoeChanged = (amphoe: String) => {
    return {
        type: USER_SETTING_USERPROFILE_AMPHOE_CHANGED,
        payload: amphoe,
    }
}
/**
 * บันทึกข้อมูลช่าง
 * @param namePrefix 
 * @param name 
 * @param surName 
 * @param tel 
 * @param address 
 * @param expoPushToken สามารถว่างได้นะ 
 * @returns 
 */
export const saveUserProfile = (namePrefix: String, name: String, surName: String, tel: String, address: any, expoPushToken: any) => {/**ต้องแก้ไข */
    return async (dispatch: any) => {
        try {
            //ตรวจสอบข้อมูลเบื้องต้น
            if (namePrefix !== '' && name !== '' && surName !== '' && tel !== '' && address.street !== '' && address.province !== '' && address.amphoe !== '' && address.zipcode !== '') {
                initSaveProfile(dispatch);//กำหนดค่าเริ่มต้นก่อน

                let result = await fireBaseConnect.saveTechnicianProfile(namePrefix, name, surName, tel, address, expoPushToken);
                if (result === 'complete') {
                    Alert.alert('การบันทึกข้อมูล', 'บันทึกข้อมูลของท่านเรียบร้อย');
                    saveUserProfileSuccess(dispatch);
                }
            }
            else {
                Alert.alert('มีข้อผิดพลาด', 'กรุณาป้อนข้อมูลให้ครบถ้วน');
            }
        }
        catch (err: any) {
            Alert.alert('มีข้อผิดพลาด', err.message);
        }
    }
}

export const getAbout = () => {
    return async (dispatch: any) => {
        try {
            //show loading
            initGetAbout(dispatch);

            //let snapshot = await fireBaseConnect.getAbout();

            const rootRef = firebase.database().ref();
            const aboutRef = rootRef.child(`about`);
            aboutRef.on('value', snapshot => {
                if (snapshot.exists()) {
                    //ถ้ามีข้อมูล
                    loadAboutSuccess(dispatch, snapshot.val());
                }
                else {
                    //ถ้าไม่มีข้อมูล
                    loadAboutFail(dispatch, 'ไม่มีข้อมูล');
                }
            })
        }
        catch (err: any) {
            loadAboutFail(dispatch, err.message);
        }
    }
}
//////////////////////////////////// Action Creator///////////////////////////////////////////
const changAvatarSuccess = (dispatch: any, uri: String) => {
    dispatch({
        type: USER_SETTING_AVATAR_CHANGED_SUCCESS,
        payload: uri,
    });
};

const initNewPassword = (dispatch: any) => {
    dispatch({
        type: USER_SETTING_PASSWORD_CHANGED_INIT,
    });
};

const changeNewPasswordFail = (dispatch: any, message: String) => {
    dispatch({
        type: USER_SETTING_PASSWORD_CHANGED_FAIL,
        payload: message,
    });
};

const changNewPasswordSuccess = (dispatch: any) => {
    Alert.alert('ข้อความแจ้ง', 'เปลี่ยนรหัสผ่านเรียบร้อย');
    dispatch({
        type: USER_SETTING_PASSWORD_CHANGED_COMPLETE,
    });
};

const initLoadingProfile = (dispatch: any) => {
    dispatch({
        type: USER_SETTING_USERPROFILE_INIT,
    })
};

const loadUserProfileFail = (dispatch: any, value: String) => {//ถ้าไม่มีข้อมูลในตอนโหลด
    dispatch({
        type: USER_SETTING_USERPROFILE_FAIL,
        payload: value,
    })
}

const loadUserProfileSuccess = (dispatch: any, value: any) => {//ถ้ามีข้อมูลโปรไฟล์
    dispatch({
        type: USER_SETTING_LOAD_USERPROFILE_SUCCESS,
        payload: value,
    })
}

//กำหนดค่าเริ่มต้นสำหรับแก้ไข คือกำหนดให้มีเครื่องหมายว่ากำลังแก้ไข
const inintEditProfile = (dispatch: any) => {
    dispatch({
        type: USER_SETTING_USERPROFILE_EDIT_INIT,
    })
}

//เมื่อแก้ไขข้อมูลผู้ใช้ใน DB เรียบร้อย
const editUserProfileSucess = (dispatch: any, key: any, value: Object) => {
    dispatch({
        type: USER_SETTING_USERPROFILE_EDITPROFILE_SUCCESS,
        payload: { [key]: value }
    })
}

const editUserProfileFail = (dispatch: any, value: String) => {
    dispatch({
        type: USER_SETTING_USERPROFILE_EDITPROFILE_FAIL,
        payload: value,
    })
}

const initSaveProfile = (dispatch: any) => {
    dispatch({
        type: USER_SETTING_USERPROFILE_ADD_INIT,
    })
}

//เมื่อเพิ่มข้อมูลผู้ใช้เรียบร้อย
const saveUserProfileSuccess = (dispatch: any) => {
    dispatch({
        type: USER_SETTING_USERPROFILE_SAVEPROFILE_SUCCESS,
    })
}

const initGetAbout = (dispatch: any) => {
    dispatch({
        type: USER_SETTING_ABOUT_INIT,
    })
}

const loadAboutFail = (dispatch: any, value: String) => {
    dispatch({
        type: USER_SETTING_ABOUT_FAIL,
        payload: value,
    })
}

const loadAboutSuccess = (dispatch: any, value: String) => {
    dispatch({
        type: USER_SETTING_ABOUT_SUCCESS,
        payload: value,
    })
}