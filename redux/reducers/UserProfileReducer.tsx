import {
    USER_SETTING_LOAD_USERPROFILE_SUCCESS,
    USER_SETTING_USERPROFILE_FAIL,
    USER_SETTING_USERPROFILE_PREFIX_CHANGED,
    USER_SETTING_USERPROFILE_NAME_CHANGED,
    USER_SETTING_USERPROFILE_SURNAME_CHANGED,
    USER_SETTING_USERPROFILE_TEL_CHANGED,
    USER_SETTING_USERPROFILE_STREET_CHANGED,
    USER_SETTING_USERPROFILE_SAVEPROFILE_SUCCESS,
    USER_SETTING_USERPROFILE_INIT,
    USER_SETTING_USERPROFILE_ADD_INIT,
    USER_SETTING_USERPROFILE_EDIT_INIT,
    USER_SETTING_USERPROFILE_EDITPROFILE_SUCCESS,
    USER_SETTING_USERPROFILE_EDITPROFILE_FAIL,
    USER_SETTING_USERPROFILE_PROVINCE_CHANGED,
    USER_SETTING_USERPROFILE_AMPHOE_CHANGED,
    USER_SETTING_USERPROFILE_ZIPCODE_CHANGED,
} from '../types';

//State เริ่มต้น
const INITIAL_STATE = {
    namePrefix: '',
    name: '',
    surName: '',
    tel: '',
    address: {
        street: '',
        province: '',
        amphoe: '',
        zipcode: '',
    },/***ต้องแก้ไข */
    userProfileExists: false,//ตรวจสอบว่ามีข้อมูลหรือไม่
    userProfileLoading: false,//สำหรับแสดง Loading  สำหรับโหลดข้อมูลทั้งหมด 
    userProfileAddLoading: false,//สำหรับแสดง Loading เมื่อมีการเพิ่มที่ปุ่ม บันทึก
    userProfileEditLoading: false,//สำหรับแสดง loading เมื่อมีการคลิกปุ่มแก้ไข
    userProfileErrMessage: '',//เอาไว้เก็บข้อผิดพลาด
    userProfileEditErrMessage: '',//เอาไว้เก็บข้อผิดพลาดในขณะแก้ไข
};

//Reducer ที่ทำการ return state ใหม่ไปเลย
export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case USER_SETTING_LOAD_USERPROFILE_SUCCESS: //โหลด user profile สำเร็จ กำหนดว่า มีข้อมูล และ ให้ เครื่องหมายโหลดหยูดลง
            return { ...state, ...action.payload, userProfileExists: true, userProfileLoading: false };//

        case USER_SETTING_USERPROFILE_PREFIX_CHANGED:
            return { ...state, namePrefix: action.payload }

        case USER_SETTING_USERPROFILE_NAME_CHANGED:
            return { ...state, name: action.payload }

        case USER_SETTING_USERPROFILE_SURNAME_CHANGED:
            return { ...state, surName: action.payload }

        case USER_SETTING_USERPROFILE_TEL_CHANGED:
            return { ...state, tel: action.payload }

        case USER_SETTING_USERPROFILE_STREET_CHANGED:/**ที่อยู่ บ้านเลขที่ */
            return { ...state, address: { ...state.address, street: action.payload } }

        case USER_SETTING_USERPROFILE_PROVINCE_CHANGED:/**ที่อยู่ จังหวัด */
            return { ...state, address: { ...state.address, province: action.payload } }

        case USER_SETTING_USERPROFILE_AMPHOE_CHANGED:/**ที่อยู่ อำเภอ */
            return { ...state, address: { ...state.address, amphoe: action.payload } }

        case USER_SETTING_USERPROFILE_ZIPCODE_CHANGED:/**ที่อยู่ รหัสไปรษณีย์ */
            return { ...state, address: { ...state.address, zipcode: action.payload } }

        case USER_SETTING_USERPROFILE_FAIL://ถ้าไม่มีข้อมูลตอนโหลด ให้กำหนดว่าไม่มีข้อมูล และ ให้เครื่องหมายโหลดหยุดทำงาน 
            return { ...state, userProfileExists: false, userProfileLoading: false, userProfileErrMessage: action.payload }

        case USER_SETTING_USERPROFILE_INIT://ให้แสดงเครื่องหมายโหลดทำงาน
            return { ...state, userProfileLoading: true }

        case USER_SETTING_USERPROFILE_SAVEPROFILE_SUCCESS://เมื่อเพิ่มเรียบร้อย
            return { ...state, userProfileExists: true, userProfileAddLoading: false }

        case USER_SETTING_USERPROFILE_ADD_INIT://กำหนดค่าเริ่มต้น เพิ่ม
            return { ...state, userProfileAddLoading: true }

        case USER_SETTING_USERPROFILE_EDIT_INIT://กำหนดค่าเริ่มต้น แก้ไข ให้แสดงเครื่องหมายกำลังแก้ไข
            return { ...state, userProfileEditLoading: true, userProfileEditErrMessage: '' }

        case USER_SETTING_USERPROFILE_EDITPROFILE_SUCCESS://แก้ไข ข้อมูลผู้ใช้ใน DB เรียบร้อย ก็ให้รวม state และ หยุดการแสดงว่ากำลังแก้ไขอยู่
            return { ...state, ...action.payload, userProfileEditLoading: false }

        case USER_SETTING_USERPROFILE_EDITPROFILE_FAIL://ถ้าการแก้ไขมีปัญหา
            return { ...state, userProfileEditLoading: false, userProfileEditErrMessage: action.payload }

        default:
            return state;
    }
}