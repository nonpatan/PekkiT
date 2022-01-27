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
    JOB_DETAIL_RESET_LOADING,
    JOB_SET_SELECTED_INDEX,
} from '../types';
import _ from 'lodash';
import fireBaseConnect from '../actions/FireBaseConnect';
import firebase from 'firebase';

/**แสดงรายการที่ลูกค้าจองไว้ */

export const jobsShowList = (jobType: number) => {
    return async (dispatch: any) => {

        //กำหนดค่าเริ่มต้น
        jobShowList_init(dispatch);

        console.log(`jobsShowList ${jobType}`);

        try {
            const user = firebase.auth().currentUser;
            if (user !== null) {
                if (jobType == 0) {
                    //บริการ
                    /////////////////////////////////////////////////////////////////////////////
                    let data: any;

                    const rootRef = firebase.database().ref();
                    const serviceRef = rootRef.child('serviceBooking');
                    const query = serviceRef.orderByChild('technicianID').equalTo(user.uid);
                    query.on('value', async snapshot => {

                        jobShowList_Set_SelectedIndex(dispatch, jobType);

                        console.log(`บริการ ${jobType}`);

                        if (snapshot.exists()) {
                            data = snapshot.val();
                            if ((data !== 'ไม่มีข้อมูล') && (data !== undefined)) {
                                //ถ้ามีข้อมูล
                                let jobFillter = _.filter(data, (o) => { return (o.serviceStatus == 'รอดำเนินการ' || o.serviceStatus == 'รอยืนยัน') });//ผลลัพธ์จะเป็น Array

                                if (!Array.isArray(jobFillter) || !jobFillter.length) {
                                    //ถ้า Array ว่าง
                                    //ถ้าไม่มีข้อมูล
                                    jobShowList_fail(dispatch, 'ไม่มีข้อมูล รอดำเนินการ หรือ รอยืนยัน');
                                }
                                else {
                                    //ถ้ามีข้อมูล
                                    ////////////////////////////////////////////////////////////////////
                                    let jobArr = await fireBaseConnect.fineStatusObject(data, jobType);
                                    ///////////////////////////////////////////////////////////////////
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
                        else {
                            //ถ้าไม่มีข้อมูล
                            jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                        }
                    })
                }
                else if (jobType == 2) {
                    //ประวัติบริการ
                    //////////////////////////////////////////////////////////////////////////////
                    let data: any;

                    const rootRef = firebase.database().ref();
                    const serviceRef = rootRef.child('serviceBooking');
                    const query = serviceRef.orderByChild('technicianID').equalTo(user.uid);
                    query.on('value', async snapshot => {

                        jobShowList_Set_SelectedIndex(dispatch, jobType);

                        console.log(`ประวัติบริการ ${jobType}`);

                        if (snapshot.exists()) {
                            data = snapshot.val();
                            if ((data !== 'ไม่มีข้อมูล') && (data !== undefined)) {
                                //ถ้ามีข้อมูล
                                let jobFillter = _.filter(data, (o) => { return (o.serviceStatus == 'ยกเลิก' || o.serviceStatus == 'เสร็จสิ้น' || o.serviceStatus == 'ไม่สามารถรับงานได้') });//ผลลัพธ์จะเป็น Array

                                if (!Array.isArray(jobFillter) || !jobFillter.length) {
                                    //ถ้า Array ว่าง
                                    //ถ้าไม่มีข้อมูล
                                    jobShowList_fail(dispatch, 'ไม่มีข้อมูล ยกเลิก หรือ เสร็จสิ้น');
                                }
                                else {
                                    //ถ้ามีข้อมูล
                                    ///////////////////////////////////////////////////////////////////
                                    let jobArr = await fireBaseConnect.fineStatusObject(data, jobType);
                                    ///////////////////////////////////////////////////////////////////
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
                        else {
                            jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                        }
                    })
                }
                else if (jobType == 1) {
                    //ถ้าเป็น ซ่อม
                    /////////////////////////////////////////////////////////////////////////////
                    let data: any;

                    const rootRef = firebase.database().ref();
                    const serviceRef = rootRef.child('repairBooking');
                    const query = serviceRef.orderByChild('technicianID').equalTo(user.uid);
                    query.on('value', async snapshot => {

                        jobShowList_Set_SelectedIndex(dispatch, jobType);

                        console.log(`ซ่อม ${jobType}`);

                        if (snapshot.exists()) {
                            data = snapshot.val();
                            if ((data !== 'ไม่มีข้อมูล') && (data !== undefined)) {
                                //ถ้ามีข้อมูล
                                let jobFillter = _.filter(data, (o) => { return (o.repairStatus == 'รอดำเนินการ' || o.repairStatus == 'รอยืนยัน') });//ผลลัพธ์จะเป็น Array

                                if (!Array.isArray(jobFillter) || !jobFillter.length) {
                                    //ถ้า Array ว่าง
                                    //ถ้าไม่มีข้อมูล
                                    jobShowList_fail(dispatch, 'ไม่มีข้อมูล รอดำเนินการ หรือ รอยืนยัน');
                                }
                                else {
                                    //ถ้ามีข้อมูล
                                    ////////////////////////////////////////////////////////////////////
                                    let jobArr = await fireBaseConnect.fineStatusObject(data, jobType);
                                    ////////////////////////////////////////////////////////////////////
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
                        else {
                            //ถ้าไม่มีข้อมูล
                            jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                        }
                    })
                }
                else if (jobType == 3) {
                    //ประวัติซ่อม
                    /////////////////////////////////////////////////////////////////////////////
                    let data: any;

                    const rootRef = firebase.database().ref();
                    const serviceRef = rootRef.child('repairBooking');
                    const query = serviceRef.orderByChild('technicianID').equalTo(user.uid);
                    query.on('value', async snapshot => {

                        jobShowList_Set_SelectedIndex(dispatch, jobType);

                        console.log(`ประวัติซ่อม ${jobType}`);

                        if (snapshot.exists()) {
                            data = snapshot.val();
                            if ((data !== 'ไม่มีข้อมูล') && (data !== undefined)) {
                                //ถ้ามีข้อมูล
                                let jobFillter = _.filter(data, (o) => { return (o.repairStatus == 'ยกเลิก' || o.repairStatus == 'เสร็จสิ้น' || o.repairStatus == 'ไม่สามารถรับงานได้') });//ผลลัพธ์จะเป็น Array

                                if (!Array.isArray(jobFillter) || !jobFillter.length) {
                                    //ถ้า Array ว่าง
                                    //ถ้าไม่มีข้อมูล
                                    jobShowList_fail(dispatch, 'ไม่มีข้อมูล ยกเลิก หรือ เสร็จสิ้น');
                                }
                                else {
                                    //ถ้ามีข้อมูล
                                    ////////////////////////////////////////////////////////////////////
                                    let jobArr = await fireBaseConnect.fineStatusObject(data, jobType);
                                    ////////////////////////////////////////////////////////////////////
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
                        else {
                            //ถ้าไม่มีข้อมูล
                            jobShowList_fail(dispatch, 'ไม่มีข้อมูล');
                        }
                    })
                }
            }
            else {
                jobShowList_fail(dispatch, 'ไม่มี currentUser');
            }
        }
        catch (err: any) {
            jobShowList_fail(dispatch, err.message);
        }
    }
}

/**
 * ทำการ query รายการที่จองไว้ และรายละเอียดลูกค้าที่จอง
 * @param jobID รหัสงานที่จอง
 * @param selectedIndex ประเภทงานที่จอง
 * @returns Obj งานที่จอง และ รายละเอียดลูกค้า
 */
export const jobShowDetailById = (jobID: any, selectedIndex: number) => {
    return async (dispatch: any) => {

        //เริ่มต้น
        jobShowDetail_init(dispatch);

        try {
            if ((selectedIndex == 0) || (selectedIndex == 2)) {
                //ถ้าเป็นบริการ
                //ทำการ Query Job by ID
                ///////////////////////////////////////////////////////////////////////////////
                let jobDetail: any;
                const rootRef = firebase.database().ref();
                const jobRef = rootRef.child(`serviceBooking/${jobID}`);
                jobRef.on('value', async snapshot => {
                    if (snapshot.exists()) {
                        //ถ้ามีข้อมูล
                        jobDetail = snapshot.val();

                        //หาข้อมูลลูกค้าจากตาราง user
                        const userRef = firebase.database().ref(`users/${jobDetail.userID}`);
                        userRef.on('value', snapshot => {
                            if (snapshot.exists()) {

                                //ถ้ามีข้อมูล
                                let customerData = snapshot.val();
                                jobDetail = { ...jobDetail, "customerSelected": customerData };

                                jobShowDetailSuccess(dispatch, jobDetail);
                            }
                            else {
                                //ถ้าไม่มีข้อมูลลูกค้า
                                jobShowDetailErr(dispatch, 'ไม่มีลูกค้าในฐานข้อมูล');
                            }
                        });
                    }
                    else {
                        //ถ้าไม่มีข้อมูล
                        jobShowDetailErr(dispatch, 'ไม่มีรายการบริการนี้');

                    }
                });

            }
            else {

                //ถ้าเป็นซ่อม
                //////////////////////////////////////////////////////////////////////////////
                let jobDetail: any;
                const rootRef = firebase.database().ref();
                const jobRef = rootRef.child(`repairBooking/${jobID}`);
                jobRef.on('value', async snapshot => {
                    if (snapshot.exists()) {
                        //ถ้ามีข้อมูล
                        jobDetail = snapshot.val();

                        //ทำการ Query Customer by ID
                        const userRef = firebase.database().ref(`users/${jobDetail.userID}`);
                        userRef.on('value', snapshot => {
                            if (snapshot.exists()) {
                                //ถ้ามีข้อมูล
                                let customerData = snapshot.val();
                                jobDetail = { ...jobDetail, "customerSelected": customerData };
                                jobShowDetailSuccess(dispatch, jobDetail);
                            }
                            else {
                                //ถ้าไม่มีข้อมูล
                                jobShowDetailErr(dispatch, 'ไม่มีลูกค้าในฐานข้อมูล');
                            }
                        });
                    }
                    else {
                        //ถ้าไม่มีข้อมูล
                        jobShowDetailErr(dispatch, 'ไม่มีรายการบริการนี้');

                    }
                });
                //////////////////////////////////////////////////////////////////////////////
            }
        }
        catch (err: any) {
            //Alert.alert('มีข้อผิดพลาด', err.message);
            jobShowDetailErr(dispatch, err.message);
        }
    }
}

/**ทำการยกเลิกงาน โดยกำหนดค่าสถานะ ยกเลิก ที่ฐานข้อมูลของงานนั้นๆ */
export const jobCancel = (jobID: any, selectedIndex: number, customerSelected: any, jobName: String) => {
    return async (dispatch: any) => {
        //ทำการยกเลิกการจอง
        jobCancel_init(dispatch);
        try {
            //ทำการดึงข้อมูล user
            const user = firebase.auth().currentUser;
            if ((selectedIndex == 0) || (selectedIndex == 2)) {
                /////////////////ส่วนบริการ//////////////////
                let jobCancelStatus = await fireBaseConnect.setStatusJob(jobID, 'serviceBooking', 'serviceStatus', 'ไม่สามารถรับงานได้');
                if (jobCancelStatus == 'เสร็จสิ้น') {
                    fireBaseConnect.sendPushNotification(customerSelected.expoPushToken, `งานบริการ : ${jobName}`, `รหัสการจอง : ${jobID} \nสถานะ : ไม่สามารถรับงานได้`);
                    jobCancelSuccess(dispatch);
                }
            }
            else {
                /////////////////ส่วนซ่อม//////////////////
                let jobCancelStatus = await fireBaseConnect.setStatusJob(jobID, 'repairBooking', 'repairStatus', 'ไม่สามารถรับงานได้');
                if (jobCancelStatus == 'เสร็จสิ้น') {
                    fireBaseConnect.sendPushNotification(customerSelected.expoPushToken, `งานซ่อม : ${jobName}`, `รหัสการจอง : ${jobID} \nสถานะ : ไม่สามารถรับงานได้`);
                    jobCancelSuccess(dispatch);
                }
            }
        }
        catch (err: any) {
            jobCancelFail(dispatch, err.message);
        }
    }
}

/**รับงาน โดยกำหนดสถานะยืนยัน */
export const jobConfirm = (jobID: any, selectedIndex: number, customerSelected: any, jobName: String) => {
    return async (dispatch: any) => {
        //ทำการปิดงาน
        jobConfirm_init(dispatch);
        try {
            const user = firebase.auth().currentUser;
            if ((selectedIndex == 0) || (selectedIndex == 2)) {
                /////////////////ส่วนบริการ//////////////////
                let jobCancelStatus = await fireBaseConnect.setStatusJob(jobID, 'serviceBooking', 'serviceStatus', 'รอดำเนินการ');
                if (jobCancelStatus == 'เสร็จสิ้น') {
                    fireBaseConnect.sendPushNotification(customerSelected.expoPushToken, `งานบริการ : ${jobName}`, `รหัสการจอง : ${jobID} \nสถานะ : รอดำเนินการ`);
                    jobConfirm_Success(dispatch);
                }

            }
            else {
                /////////////////ส่วนซ่อม//////////////////
                let jobCancelStatus = await fireBaseConnect.setStatusJob(jobID, 'repairBooking', 'repairStatus', 'รอดำเนินการ');
                if (jobCancelStatus == 'เสร็จสิ้น') {
                    fireBaseConnect.sendPushNotification(customerSelected.expoPushToken, `งานซ่อม : ${jobName}`, `รหัสการจอง : ${jobID} \nสถานะ : รอดำเนินการ`);
                    jobConfirm_Success(dispatch);
                }

            }
        }
        catch (err: any) {
            jobConfirm_Fail(dispatch, err.message);
        }
    }
}

export const resetLoading = () => {
    return (dispatch: any) => {
        dispatch({
            type: JOB_DETAIL_RESET_LOADING,
        })
    }
}
//////////////////////////////////// Action Creator///////////////////////////////////////////
const jobShowList_init = (dispatch: any) => {
    dispatch({
        type: JOB_LOADING_INIT,
    })
}

const jobShowList_Set_SelectedIndex = (dispatch: any, value: any) => {
    dispatch({
        type: JOB_SET_SELECTED_INDEX,
        payload: value,
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