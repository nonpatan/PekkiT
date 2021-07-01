import { 
    EMAIL_CHANGED, 
    PASSWORD_CHANGED, 
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER, 
    } from '../types';

//State เริ่มต้น
const INITIAL_STATE = {
    name:'',
    email: '',
    password: '',
    error: '',//เพื่อจะได้เคลียร์ error message ในกรณีที่ login สำเร็จ
    loading: false,
};
//Reducer ที่ทำการ return state ใหม่ไปเลย
export default (state = INITIAL_STATE, action:any) => {
    switch (action.type) {
        case EMAIL_CHANGED:/** */
            return { ...state, email: action.payload };
        case PASSWORD_CHANGED:/** */
            return { ...state, password: action.payload };
        case LOGIN_USER_SUCCESS://ไม่ต้องโหลด และกำหนดค่าเริ่มต้นให้ว่างไว้/** */
            return {
                ...state,
                error: '',
                loading: false,
                email: '',
                password: '',
                repassword: '',
            };//เพื่อจะได้เคลียร์ error message ในกรณีที่ login สำเร็จ
        case LOGIN_USER_FAIL:/** */
            return {
                ...state,
                error: action.payload,
                password: '',
                repassword:'',
                loading: false,
            };//ส่ง error message และเคลียร์ฟิลด์ password บนหน้าจอ เพื่อเหตุผลทางความปลอดภัย
        case LOGIN_USER://user ทำการ login นะจะแสดงค่าเริ่มต้น คือให้แสดงว่าโหลดอยู่นะ และเคลียร์ error ออกไปก่อน/** */
            return { ...state, loading: true, error: '' };
        default:
            return state;
    }
};
