import {
    JOB_LOADING_INIT,
    JOB_LOADING_SUCCESS,
    JOB_LOADING_FAIL,
    JOB_SET_SELECTED_INDEX,
} from '../types';

//State เริ่มต้น
const INITIAL_STATE = {
    jobServiceListObjArray: null,
    jobListLoading: true,
    jobListErrMessage: '',
    isJobListExist: false,
    selectedIndex: 0,//กำหนด index ของปุ่ม button group
};

//Reducer ที่ทำการ return state ใหม่ไปเลย
export default (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case JOB_LOADING_INIT:
            return { ...state, jobListLoading: true, isJobListExist: false };

        case JOB_LOADING_SUCCESS:
            return { ...state, isJobListExist: true, jobListLoading: false, jobServiceListObjArray: action.payload };

        case JOB_LOADING_FAIL:
            return { ...state, jobListLoading: false, isJobListExist: false, jobListErrMessage: action.payload };

        case JOB_SET_SELECTED_INDEX:
            return { ...state, jobListLoading: true, isJobListExist: false, selectedIndex: action.payload };

        default:
            return state;
    }
}