import {
    JOB_LOADING_INIT,
    JOB_LOADING_SUCCESS,
    JOB_LOADING_FAIL,
    JOB_SELECTED_INIT,
    JOB_SELECTED,
    JOB_SELECTED_FAIL,
    JOB_CANCEL_INIT,
    JOB_CANCEL_SUCCESS,
    JOB_CANCEL_FAIL,
    JOB_CONFIRM_INIT,
    JOB_CONFIRM_SUCCESS,
    JOB_CONFIRM_FAIL,
} from '../types';
import _ from 'lodash';
import fireBaseConnect from '../actions/FireBaseConnect';//กลับมาใช้ firebaseConnect อีกครั้ง

/**แสดงรายการที่ลูกค้าจองไว้ */

export const jobsShowList = (jobType: number) => {
    return async (dispatch: any) => {
        //กำหนดค่าเริ่มต้น
        jobShowList_init(dispatch);

        try {
            if (jobType == 0) {
                let data: any = await fireBaseConnect.jobTechnicianShowList('serviceBooking');
                console.log('********JobAction**********');
                console.log(data);
                if (data !== 'ไม่มีข้อมูล') {
                    //ถ้ามีข้อมูล
                    let jobFillter = _.filter(data, (o) => { return (o.serviceStatus == 'รอดำเนินการ' || o.serviceStatus == 'รอยืนยัน') });//ผลลัพธ์จะเป็น Array

                    if (!Array.isArray(jobFillter) || !jobFillter.length) {
                        //ถ้า Array ว่าง
                        //ถ้าไม่มีข้อมูล
                        jobShowList_fail(dispatch, 'ไม่มีข้อมูล รอดำเนินการ หรือ รอยืนยัน');
                    }
                    else {
                        //ถ้ามีข้อมูล
                        let jobArr = await fireBaseConnect.fineStatusObject(data, jobType);

                        if (jobArr !== undefined) {
                            jobShowList_success(dispatch, jobArr);
                        }
                        else {
                            jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                        }
                    }
                }
                else {
                    //ถ้าไม่มีข้อมูล
                    jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                }
            }
            else if (jobType == 2) {
                let data: any = await fireBaseConnect.jobTechnicianShowList('serviceBooking');
                if (data !== 'ไม่มีข้อมูล') {
                    //ถ้ามีข้อมูล
                    let jobFillter = _.filter(data, (o) => { return (o.serviceStatus == 'ยกเลิก' || o.serviceStatus == 'เสร็จสิ้น') });//ผลลัพธ์จะเป็น Array

                    if (!Array.isArray(jobFillter) || !jobFillter.length) {
                        //ถ้า Array ว่าง
                        //ถ้าไม่มีข้อมูล
                        jobShowList_fail(dispatch, 'ไม่มีข้อมูล ยกเลิก หรือ เสร็จสิ้น');
                    }
                    else {
                        //ถ้ามีข้อมูล
                        let jobArr = await fireBaseConnect.fineStatusObject(data, jobType);

                        if (jobArr !== undefined) {
                            jobShowList_success(dispatch, jobArr);
                        }
                        else {
                            jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                        }
                    }
                }
                else {
                    //ถ้าไม่มีข้อมูล
                    jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                }
            }
            else if (jobType == 1) {
                //ถ้าเป็น ซ่อม
                let data: any = await fireBaseConnect.jobTechnicianShowList('repairBooking');

                if (data !== 'ไม่มีข้อมูล') {
                    //ถ้ามีข้อมูล
                    let jobFillter = _.filter(data, (o) => { return (o.repairStatus == 'รอดำเนินการ' || o.repairStatus == 'รอยืนยัน') });//ผลลัพธ์จะเป็น Array

                    if (!Array.isArray(jobFillter) || !jobFillter.length) {
                        //ถ้า Array ว่าง
                        //ถ้าไม่มีข้อมูล
                        jobShowList_fail(dispatch, 'ไม่มีข้อมูล รอดำเนินการ หรือ รอยืนยัน');
                    }
                    else {
                        //ถ้ามีข้อมูล
                        let jobArr = await fireBaseConnect.fineStatusObject(data, jobType);

                        if (jobArr !== undefined) {
                            jobShowList_success(dispatch, jobArr);
                        }
                        else {
                            jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                        }
                    }
                }
                else {
                    //ถ้าไม่มีข้อมูล
                    jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                }
            }
            else if (jobType == 3) {
                //ประวัติซ่อม
                let data: any = await fireBaseConnect.jobTechnicianShowList('repairBooking');

                if (data !== 'ไม่มีข้อมูล') {
                    //ถ้ามีข้อมูล
                    let jobFillter = _.filter(data, (o) => { return (o.repairStatus == 'ยกเลิก' || o.repairStatus == 'เสร็จสิ้น') });//ผลลัพธ์จะเป็น Array

                    if (!Array.isArray(jobFillter) || !jobFillter.length) {
                        //ถ้า Array ว่าง
                        //ถ้าไม่มีข้อมูล
                        jobShowList_fail(dispatch, 'ไม่มีข้อมูล ยกเลิก หรือ เสร็จสิ้น');
                    }
                    else {
                        //ถ้ามีข้อมูล
                        let jobArr = await fireBaseConnect.fineStatusObject(data, jobType);

                        if (jobArr !== undefined) {
                            jobShowList_success(dispatch, jobArr);
                        }
                        else {
                            jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                        }
                    }
                }
                else {
                    //ถ้าไม่มีข้อมูล
                    jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                }
            }

        }
        catch (err) {
            jobShowList_fail(dispatch, err.message);
        }
    }
}

/**ทำการ query ลูกค้า ตาม ID เพื่อจะได้แสดงผลแบบ realtime เลย */
export const jobShowDetailById = (jobID: any, selectedIndex: number) => {
    return async (dispatch: any) => {
        //เริ่มต้น
        jobShowDetail_init(dispatch);
        try {
            if ((selectedIndex == 0) || (selectedIndex == 2)) {
                //ถ้าเป็นบริการ

                //ทำการ Query Job by ID
                let jobDetail: any = await fireBaseConnect.getJobByID(jobID, 'serviceBooking');
                if (jobDetail !== 'ไม่มีข้อมูล') {
                    //ถ้ามีข้อมูลงาน

                    //ทำการ Query Customer by ID
                    let customerData = await fireBaseConnect.getCustomerProfileByID(jobID.userID);
                    if (customerData !== 'ไม่มีข้อมูล') {
                        //ทำการใส่ข้อมูลลูกค้าดังกล่าวไปในงานเลยแต่ไม่เพิ่มในฐานข้อมูลนะ
                        jobDetail = { ...jobDetail, "customerSelected": customerData };
                        jobShowDetailSuccess(dispatch, jobDetail);
                    }
                    else {
                        jobShowDetailErr(dispatch, 'ไม่มีลูกค้าในฐานข้อมูล');
                    }

                } else {
                    //ถ้าไม่มีข้อมูลงาน
                    jobShowDetailErr(dispatch, 'ไม่มีรายการบริการนี้');
                }

            }
            else {
                //ถ้าเป็นซ่อม

                let jobDetail: any = await fireBaseConnect.getJobByID(jobID, 'repairBooking');
                if (jobDetail !== 'ไม่มีข้อมูล') {
                    //ถ้ามีงาน

                    //ทำการ Query Customer by ID
                    let customerData = await fireBaseConnect.getCustomerProfileByID(jobID.userID);
                    if (customerData !== 'ไม่มีข้อมูล') {
                        //ทำการใส่ข้อมูลลูกค้าดังกล่าวไปในงานเลยแต่ไม่เพิ่มในฐานข้อมูลนะ
                        jobDetail = { ...jobDetail, "customerSelected": customerData };
                        jobShowDetailSuccess(dispatch, jobDetail);
                    }
                    else {
                        jobShowDetailErr(dispatch, 'ไม่มีลูกค้าในฐานข้อมูล');
                    }
                } else {
                    //ถ้าไม่มีข้อมูลงาน
                    jobShowDetailErr(dispatch, 'ไม่มีรายการบริการนี้');
                }
            }
        }
        catch (err) {
            //Alert.alert('มีข้อผิดพลาด', err.message);
            jobShowDetailErr(dispatch, err.message);
        }
    }
}

/**ทำการยกเลิกงาน โดยกำหนดค่าสถานะ ยกเลิก ที่ฐานข้อมูลของงานนั้นๆ */
export const jobCancel = (jobID: any, selectedIndex: number) => {
    return async (dispatch: any) => {
        //ทำการยกเลิกการจอง
        jobCancel_init(dispatch);
        try {
            if ((selectedIndex == 0) || (selectedIndex == 2)) {
                /////////////////ส่วนบริการ//////////////////
                let jobCancelStatus = await fireBaseConnect.setStatusJob(jobID, 'serviceBooking', 'serviceStatus', 'ไม่สามารถรับงานได้');
                if (jobCancelStatus == 'เสร็จสิ้น') {
                    jobCancelSuccess(dispatch);
                }
            }
            else {
                /////////////////ส่วนซ่อม//////////////////
                let jobCancelStatus = await fireBaseConnect.setStatusJob(jobID, 'repairBooking', 'repairStatus', 'ไม่สามารถรับงานได้');
                if (jobCancelStatus == 'เสร็จสิ้น') {
                    jobCancelSuccess(dispatch);
                }
            }
        }
        catch (err) {
            jobCancelFail(dispatch, err.message);
        }
    }
}

/**รับงาน โดยกำหนดสถานะยืนยัน */
export const jobConfirm = (jobID: any, selectedIndex: number,) => {
    return async (dispatch: any) => {
        //ทำการปิดงาน
        jobConfirm_init(dispatch);

        try {
            if ((selectedIndex == 0) || (selectedIndex == 2)) {
                /////////////////ส่วนบริการ//////////////////
                let jobCancelStatus = await fireBaseConnect.setStatusJob(jobID, 'serviceBooking', 'serviceStatus', 'ยืนยันรับงาน');
                if (jobCancelStatus == 'เสร็จสิ้น') {
                    jobConfirm_Success(dispatch);
                }
            }
            else {
                /////////////////ส่วนซ่อม//////////////////
                let jobCancelStatus = await fireBaseConnect.setStatusJob(jobID, 'repairBooking', 'repairStatus', 'ยืนยันรับงาน');
                if (jobCancelStatus == 'เสร็จสิ้น') {
                    jobConfirm_Success(dispatch);
                }
            }
        }
        catch (err) {
            jobConfirm_Fail(dispatch, err.message);
        }
    }
}

//////////////////////////////////// Action Creator///////////////////////////////////////////
const jobShowList_init = (dispatch: any) => {
    dispatch({
        type: JOB_LOADING_INIT,
    })
}

const jobShowList_fail = (dispatch: any, value: any) => {
    dispatch({
        type: JOB_LOADING_FAIL,
        payload: value,
    })
}

const jobShowList_success = (dispatch: any, value: any) => {
    dispatch({
        type: JOB_LOADING_SUCCESS,
        payload: value,
    })
}

const jobShowDetail_init = (dispatch: any) => {
    dispatch({
        type: JOB_SELECTED_INIT,
    })
}

const jobShowDetailSuccess = (dispatch: any, value: any) => {
    dispatch({
        type: JOB_SELECTED,
        payload: value,
    })
}

const jobShowDetailErr = (dispatch: any, value: any) => {
    dispatch({
        type: JOB_SELECTED_FAIL,
        payload: value,
    })
}

const jobCancel_init = (dispatch: any) => {
    dispatch({
        type: JOB_CANCEL_INIT,
    })
}

const jobCancelSuccess = (dispatch: any) => {
    dispatch({
        type: JOB_CANCEL_SUCCESS,
    })
}

const jobCancelFail = (dispatch: any, value: any) => {
    dispatch({
        type: JOB_CANCEL_FAIL,
        payload: value,
    })
}

const jobConfirm_init = (dispatch: any) => {
    dispatch({
        type: JOB_CONFIRM_INIT,
    })
}

const jobConfirm_Success = (dispatch: any) => {
    dispatch({
        type: JOB_CONFIRM_SUCCESS,
    })
}

const jobConfirm_Fail = (dispatch: any, value: any) => {
    dispatch({
        type: JOB_CONFIRM_FAIL,
        payload: value,
    })
}