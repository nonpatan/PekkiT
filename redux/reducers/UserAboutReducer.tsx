import {
    USER_SETTING_ABOUT_INIT,
    USER_SETTING_ABOUT_SUCCESS,
    USER_SETTING_ABOUT_FAIL,
} from './../types';

//State เริ่มต้น
const INITIAL_STATE = {
    user_aboutObj: null,
    user_about_err: '',
    user_about_loading: true,
    user_about_success: false,
};

export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case USER_SETTING_ABOUT_INIT:
            return {
                ...state,
                user_about_loading: true,
            }
        case USER_SETTING_ABOUT_SUCCESS:
            return {
                ...state,
                user_aboutObj: action.payload,
                user_about_err: '',
                user_about_loading: false,
                user_about_success: true,
            }
        case USER_SETTING_ABOUT_FAIL:
            return {
                ...state,
                user_aboutObj: null,
                user_about_err: action.payload,
                user_about_loading: false,
                user_about_success: false,
            }
        default:
            return state;
    }
}