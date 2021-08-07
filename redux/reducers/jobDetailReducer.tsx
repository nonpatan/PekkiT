import {
    JOB_SELECTED,
    JOB_SELECTED_INIT,
    JOB_SELECTED_FAIL,
    JOB_CANCEL_INIT,
    JOB_CANCEL_SUCCESS,
    JOB_CANCEL_FAIL,
    JOB_CONFIRM_INIT,
    JOB_CONFIRM_SUCCESS,
    JOB_CONFIRM_FAIL,
    JOB_DETAIL_RESET_LOADING,
} from '../types';

//State เริ่มต้น
const INITIAL_STATE = {
    jobSelected: null,//ไว้กรณีเลือก job 
    jobSelected_loading: true,
    jobSelected_ErrMessage: '',
    jobCancel_loading: false,//ไว้สำหรับปุ่ม ยกเลิก
    jobCancel_Success: false,//ไว้สำหรับปุ่ม ยกเลิก
    jobCancel_ErrMessage: '',//ไว้สำหรับปุ่ม ยกเลิก
    jobConfirm_loading: false,//ไว้สำหรับปุ่ม ยืนยันรับงาน
    jobConfirm_Success: false,//ไว้สำหรับปุ่ม ยืนยันรับงาน
    jobConfirm_ErrMessage: '',//ไว้สำหรับปุ่ม ยืนยันรับงาน
    isJobConfirm_Err: false,//เอาได้ตรวจสอบข้อผิดพลาด ถ้ายืนยันรับงาน
    isJobCancel_Err: false,//เอาไว้ตรวจสอบข้อผิดพลาด ถ้ายกเลิกงาน

    jobDetailExisted: false,//เอาไว้กำหนดว่ามีข้อมูลหรือไม่
};

//Reducer ที่ทำการ return state ใหม่ไปเลย
export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case JOB_SELECTED_INIT:
            return { ...state, jobSelected_loading: true, jobSelected: null, jobDetailExisted: false };

        case JOB_SELECTED:
            return { ...state, jobSelected_loading: false, jobSelected: action.payload, jobDetailExisted: true };

        case JOB_SELECTED_FAIL:
            return { ...state, jobSelected_loading: false, jobSelected_ErrMessage: action.payload, jobDetailExisted: false };

        case JOB_CANCEL_INIT:
            return { ...state, jobCancel_loading: true, jobCancel_Success: false, isJobCancel_Err: false };

        case JOB_CANCEL_SUCCESS:
            return { ...state, jobCancel_loading: false, jobCancel_Success: true, isJobCancel_Err: false, };

        case JOB_CANCEL_FAIL:
            return { ...state, jobCancel_loading: false, jobCancel_Success: false, isJobCancel_Err: true, jobCancel_ErrMessage: action.payload };

        case JOB_CONFIRM_INIT:
            return { ...state, jobConfirm_loading: true, jobConfirm_Success: false, isJobConfirm_Err: false };

        case JOB_CONFIRM_SUCCESS:
            return { ...state, jobConfirm_loading: false, jobConfirm_Success: true, isJobConfirm_Err: false };

        case JOB_CONFIRM_FAIL:
            return { ...state, jobConfirm_loading: false, jobConfirm_Success: false, isJobConfirm_Err: true, jobConfirm_ErrMessage: action.payload, };

        case JOB_DETAIL_RESET_LOADING:
            return { ...state, jobSelected_loading: true };

        default:
            return state;
    }
}