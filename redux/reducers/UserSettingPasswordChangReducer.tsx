import {
    USER_SETTING_PASSWORD_CHANGED,
    USER_SETTING_CONFIRM_PASSWORD_CHANGED,
    USER_SETTING_PASSWORD_CHANGED_COMPLETE,
    USER_SETTING_PASSWORD_CHANGED_FAIL,
    USER_SETTING_PASSWORD_CHANGED_INIT,
} from "../types";

//State เริ่มต้น
const INITIAL_STATE = {
    new_password: '',
    confirm_new_password: '',
    loading_new_password: false,
    error_new_password: '',
};

//Reducer ที่ทำการ return state ใหม่ไปเลย
export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case USER_SETTING_PASSWORD_CHANGED: //new password
            return { ...state, new_password: action.payload };
        case USER_SETTING_CONFIRM_PASSWORD_CHANGED://confirm new password
            return { ...state, confirm_new_password: action.payload };
        case USER_SETTING_PASSWORD_CHANGED_INIT://Init
            return { ...state, loading_new_password: true, error_new_password: '', };
        case USER_SETTING_PASSWORD_CHANGED_COMPLETE://complete
            return { ...state, loading_new_password: false, error_new_password: '', new_password: '', confirm_new_password: '' };
        case USER_SETTING_PASSWORD_CHANGED_FAIL://fail
            return { ...state, loading_new_password: false, error_new_password: action.payload,};
        default:
            return state;
    }
}