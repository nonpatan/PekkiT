import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ResetPasswordReducer from './ResetPasswordReducer';
import UserSettingReducer from './UserSettingReducer';
import UserSettingPasswordChange from './UserSettingPasswordChangReducer';
import UserProfile from './UserProfileReducer';
import JobReducer from './JobsReducer';
import UserAbout from './UserAboutReducer';
import jobDetailReducer from './jobDetailReducer';


//รวม reducers หลายตัว 
export default combineReducers({
  auth: AuthReducer,
  resetPassword: ResetPasswordReducer,
  userSetting: UserSettingReducer,
  userSettingPasswordChange: UserSettingPasswordChange,
  userProfile: UserProfile,
  job: JobReducer,
  jobDetail: jobDetailReducer,
  userAbout: UserAbout,
});