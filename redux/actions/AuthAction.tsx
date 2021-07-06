import {
  EMAIL_CHANGED,
  EMAIL_REG_CHANGED,
  PASSWORD_CHANGED,
  PASSWORD_REG_CHANGED,
  REPASSWORD_REG_CHANGED,
  LOGOUT_USER,
  LOGIN_USER,
  LOGIN_USER_FAIL,
  LOGIN_USER_SUCCESS,
  NAME_REG_CHANGED,
  CHECK_PASSWORD,
  UPDATE_PROFILE_SUCCESS,
  CREATE_REG_USER,
  CREATE_REG_FAIL,
  EMAIL_RESET_START,
  EMAIL_RESET_CHANGED,
  EMAIL_RESET_ERR,
  EMAIL_RESET_SUCCESS,
  EMAIL_RESET_INIT,
} from '../types';

import firebase from 'firebase';

//แก้ไข email ใน state
export const emailChanged = (text: String) => {
  return {
    type: EMAIL_CHANGED,
    payload: text,
  }
}

//แก้ไข password ใน state
export const passwordChanged = (text: String) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text,
  }
}

//เมื่อทำการ login firebase เรียบร้อยแล้วก็จะได้ return มาเป็น promise เมื่อเป็น promise ก็สามารถใช้ then ได้(เป็น call back นั่นเอง) 
//จะได้ user เป็น parameter มาจากนั้นก็เรียกฟังก์ชั่น dispatch เพื่อทำการแก้ไข state โดยจะต้องระบุ action และ 
//ค่าที่จะแก้ไขด้วย คือ type:'LOGIN_USER_SUCCESS',payload:user จากนั้นมันจะส่งไปที่ reducer ต่อ
export const loginUser = (email: any, password: any) => {
  //แทนจะ return action เราจะ return function แทน และใช้ function นั้น return action อีกที โดยจะใช้ redux thunk ช่วยในการส่ง action ไป reducer ต่อไป
  return (dispatch: any) => {
    startLoginUser(dispatch);//ให้แสดงโหลด และเคลียร์ error

    ////ของเก่านะ จะ login ถ้าไม่มีก็สร้าง user ให้เลยแหละ
    /*firebase.auth().signInWithEmailAndPassword(email,password)
      .then((user)=>loginUserSuccess(dispatch,user))
      .catch(()=>{
        firebase.auth().createUserWithEmailAndPassword(email,password)
          .then((user)=>loginUserSuccess(dispatch,user))
          .catch(()=>loginUserFail(dispatch));
      });*/
    //ของใหม่ จะ login ถ้ายังไม่มีก็แสดง error พอ
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => { loginUserSuccess(dispatch) })
      .catch((error) => { loginUserFail(dispatch, error.message) });
  }
}

export const emailResetChanged = (text: String) => { //Reset Password
  return {
    type: EMAIL_RESET_CHANGED,
    payload: text,
  }
}

export const resetPassword = (email: any) => {//Reset Password

  return ((dispatch: any) => {
    resetPasswordStart(dispatch);//กำหนดค่าเริ่มต้นกันก่อน
    const auth = firebase.auth();
    auth.useDeviceLanguage();//กำหนดภาษา
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert('ระบบได้ทำการส่งรหัสผ่านไปยังอีเมลส์ของท่านแล้ว');
        sendEmailResetSuccess(dispatch);
      })
      .catch((err) => sendEmailResetFail(dispatch, err.message));
  });
}

export const initailResetPassword = ()=>{
  return{
    type:EMAIL_RESET_INIT,
  }
}

//////////////////////////////////// Action Creator///////////////////////////////////////////
//ใช้สำหรับการใช้งาน ReduxThunk
//การเรียก dispatch มันจะเป็นการเรียก action ใน reducer โดยตรงเลยไม่ต้อง return อะไรแระ
const startLoginUser = (dispatch: any) => {
  dispatch({ type: LOGIN_USER });
};

const loginUserFail = (dispatch: any, errorMessage: any) => {
  dispatch({ type: LOGIN_USER_FAIL, payload: errorMessage });
};

//แยกออกมาเพื่อเรียก dispatch เพราะมีการใช้ซ้ำเกิน 1 ครั้ง
//เมื่อเข้าระบบถูกต้อง
const loginUserSuccess = (dispatch: any) => {
  dispatch({ type: LOGIN_USER_SUCCESS });
};

const sendEmailResetSuccess = (dispatch: any) => {//Reset Password
  dispatch({
    type: EMAIL_RESET_SUCCESS,
  })
}

const sendEmailResetFail = (dispatch: any, errorMessage: String) => {//Reset Password
  dispatch({
    type: EMAIL_RESET_ERR,
    payload: errorMessage,
  })
}

const resetPasswordStart = (dispatch: any) => {//Reset Password
  dispatch({
    type: EMAIL_RESET_START,
  })
}