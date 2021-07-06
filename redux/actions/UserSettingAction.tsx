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
} from '../types';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
//import ImageEditor from "@react-native-community/image-editor";
import * as ImageManipulator from "expo-image-manipulator";
import fireBaseConnect from '../actions/FireBaseConnect';

import * as MediaLibrary from 'expo-media-library';

export const changAvatar = () => {
    return async (dispatch: any) => {
        //บอกกับผู้ใช้ว่าจะใช้กล้อง
        /*const { status: cameraRollPerm } = await Permissions.askAsync(
            Permissions.CAMERA_ROLL);*/
        const {status} = await MediaLibrary.requestPermissionsAsync();
        try {
            // only if user allows permission to camera roll
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

                /*console.log(
                  'ready to upload... pickerResult json:' + JSON.stringify(pickerResult)
                );*/
                if (!pickerResult.cancelled) {//ถ้าผู้ใช้ไม่ยกเลิกนะ returns { cancelled: true }.
                    /**ของเก่าไม่ต้องใช้แระ ใช้ไม่ได้มีปัญหาเลยไปใช้ของ expo แทน ง่ายด้วย
                     * ไปใช้ ImageManipulator แทนแล้ว
                      var wantedMaxSize = 150;//กำหนดขนาดภาพสูงสุด
                      var rawheight = pickerResult.height;//ความสูงของรูป
                      var rawwidth = pickerResult.width;//ความกว้างของรูป
                      //อัตราส่วนภาพ x:y aspect ratio กว้าง:สูง
                      var ratio = rawwidth / rawheight;
                      var wantedwidth = wantedMaxSize;//ความกว้างที่ต้องการ
                      //คำนวนหาความสูง
                      var wantedheight = wantedMaxSize / ratio;
                      // check vertical or horizontal
                      if (rawheight > rawwidth) {//ถ้าเป็นแนวตั้ง ค่า default มันแนวนอนอยู่แล้ว
                        wantedwidth = wantedMaxSize * ratio;//คำนวนความกว้างใหม่
                        wantedheight = wantedMaxSize;//ลดความสูงเท่ากับ 150
                      }
          
                    let resizedUri = await new Promise((resolve, reject) => {
                      //static cropImage(uri, cropData, success, failure)
                      console.log(`PicerURI:${pickerResult.uri}`);
                      ImageEditor.cropImage(pickerResult.uri,
                        {
                          offset: { x: 0, y: 0 },
                          size: { width: pickerResult.width, height: pickerResult.height },
                          displaySize: { width: wantedwidth, height: wantedheight },
                          resizeMode: 'contain',
                        },
                        (uri) => resolve(uri),//the resultant cropped image will be stored in the ImageStore, and the URI returned in the success callback 
                        () => reject('cannot be loaded/downloaded image'),//If the image cannot be loaded/downloaded, the failure callback will be called.
                      );
                    });****/

                    const cropOption = {
                        originX: 0, originY: 0, width: pickerResult.width, height: pickerResult.height
                    };
                    let resizedUri = await ImageManipulator.manipulateAsync(pickerResult.uri,
                        [{ crop: cropOption }],
                        { compress: 1, format: ImageManipulator.SaveFormat.JPEG });

                    let uploadUrl = await fireBaseConnect.uploadImage(resizedUri.uri);//ได้ url ที่ upload ไป server
                    //let uploadUrl = await firebaseSvc.uploadImageAsync(resizedUri);

                    fireBaseConnect.updateAvatar(uploadUrl); //might failed
                    changAvatarSuccess(dispatch, uploadUrl);
                }

            }
        } catch (err) {
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
            /*fireBaseConnect.passwordChanged(newPassword) 
            .then(()=>changNewPasswordSuccess(dispatch))
            .catch((error)=>changeNewPasswordFail(dispatch,error.message));*/
            try {
                await fireBaseConnect.passwordChanged(newPassword);
                changNewPasswordSuccess(dispatch);
            }
            catch (error) {
                changeNewPasswordFail(dispatch, error.message);
            }

        }
        else {
            changeNewPasswordFail(dispatch, 'รหัสผ่านใหม่กับยืนยันรหัสผ่านไม่ตรงกัน');
        }

    }
}

export const showUserProfile = () => {
    return async (dispatch: any) => {
        try {
            //show loading
            initLoadingProfile(dispatch);

            let snapshot = await fireBaseConnect.loadTechnicianProfile();
            if (snapshot === 'ไม่มีข้อมูล') {
                //ถ้าไม่มีข้อมูล
                loadUserProfileFail(dispatch, 'ไม่มีข้อมูล');
            }
            else {
                //ถ้ามีข้อมูล
                loadUserProfileSuccess(dispatch, snapshot);
            }
        }
        catch (err) {
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

                let result = await fireBaseConnect.editUserProfile(key, value);

                if (result === 'complete') {
                    editUserProfileSucess(dispatch, key, value);
                }
            }
            else {
                editUserProfileFail(dispatch, 'กรุณาป้อนข้อมูลให้ครบถ้วน');
            }
        }
        catch (err) {
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

                let result = await fireBaseConnect.editAddressUserProfile(street, province, amphoe, zipcode);

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
        catch (err) {
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

export const saveUserProfile = (namePrefix: String, name: String, surName: String, tel: String, address: any) => {/**ต้องแก้ไข */
    return async (dispatch: any) => {
        try {
            //ตรวจสอบข้อมูลเบื้องต้น
            if (namePrefix !== '' && name !== '' && surName !== '' && tel !== '' && address.street !== '' && address.province !== '' && address.amphoe !== '' && address.zipcode !== '') {
                initSaveProfile(dispatch);//กำหนดค่าเริ่มต้นก่อน

                let result = await fireBaseConnect.saveTechnicianProfile(namePrefix, name, surName, tel, address); 
                if (result === 'complete') {
                    Alert.alert('การบันทึกข้อมูล', 'บันทึกข้อมูลของท่านเรียบร้อย');
                    saveUserProfileSuccess(dispatch);
                }
            }
            else {
                Alert.alert('มีข้อผิดพลาด', 'กรุณาป้อนข้อมูลให้ครบถ้วน');
            }
        }
        catch (err) {
            Alert.alert('มีข้อผิดพลาด', err.message);
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