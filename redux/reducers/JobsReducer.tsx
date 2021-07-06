import {
    JOB_LOADING_INIT,
    JOB_LOADING_SUCCESS,
    JOB_LOADING_FAIL,
} from '../types';

//State เริ่มต้น
const INITIAL_STATE = {
    jobServiceListObjArray: null,
    jobListLoading: true,
    jobListErrMessage: '',
    isJobListExist: false,
};

//Reducer ที่ทำการ return state ใหม่ไปเลย
export default (state = INITIAL_STATE, action:any) => {
    switch (action.type) {
        case JOB_LOADING_INIT:
            return { ...state, jobListLoading: true, isJobListExist: false };

        case JOB_LOADING_SUCCESS:
            return { ...state, isJobListExist: true, jobListLoading: false, jobServiceListObjArray: action.payload };

        case JOB_LOADING_FAIL:
            return { ...state, jobListLoading: false, isJobListExist: false, jobListErrMessage: action.payload };

        default:
            return state;
    }
}