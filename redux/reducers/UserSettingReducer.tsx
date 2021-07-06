import {
    USER_SETTING_AVATAR_CHANGED_SUCCESS,
} from '../types';

//State เริ่มต้น
const INITIAL_STATE = {
    avatarURL: null,
    error: '',//เพื่อจะได้เคลียร์ error message ในกรณีที่ login สำเร็จ
    loading: false,
};

//Reducer ที่ทำการ return state ใหม่ไปเลย
export default (state = INITIAL_STATE, action:any) => {
    switch (action.type) {
        case USER_SETTING_AVATAR_CHANGED_SUCCESS: //กำหนด URI ของภาพ
            return { ...state, avatarURL: action.payload };
        default:
            return state;
    }
}