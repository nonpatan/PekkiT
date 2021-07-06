import { 
    EMAIL_RESET_CHANGED,
    EMAIL_RESET_ERR,
    EMAIL_RESET_SUCCESS,
    EMAIL_RESET_START,
    EMAIL_RESET_INIT,
    } from '../types';

//State เริ่มต้น
const INITIAL_STATE = {
    email_reset: '',
    email_reset_err:'',
    email_reset_loading:false,
    email_reset_success:false,
};

export default (state = INITIAL_STATE, action:any) => {
    switch (action.type) {
        case EMAIL_RESET_INIT:
            return{
                ...state,
                email_reset_success:false,email_reset:'',email_reset_err:'',email_reset_loading:false,
            }
        case EMAIL_RESET_START:
            return{
                ...state,
                email_reset_loading:true,
                email_reset_success:false,
            }
        case EMAIL_RESET_CHANGED:
            return{
                ...state,
                email_reset:action.payload,
            } 
        case EMAIL_RESET_ERR:
            return{
                ...state,
                email_reset:'',
                email_reset_err:action.payload,
                email_reset_loading:false,
                email_reset_success:false,
            }
        case EMAIL_RESET_SUCCESS:
            return{
                ...state,
                email_reset:'',
                email_reset_err:'',
                email_reset_loading:false,
                email_reset_success:true,
            }
        default:
            return state;
    }
}