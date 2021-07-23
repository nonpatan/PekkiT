import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ResetPasswordReducer from './ResetPasswordReducer';
import UserSettingReducer from './UserSettingReducer';
import UserSettingPasswordChange from './UserSettingPasswordChangReducer';
import UserProfile from './UserProfileReducer';
import JobReducer from './JobsReducer';
import UserAbout from './UserAboutReducer';


//รวม reducers หลายตัว 
export default combineReducers({
  auth: AuthReducer,
  resetPassword: ResetPasswordReducer,
  userSetting: UserSettingReducer,
  userSettingPasswordChange: UserSettingPasswordChange,
  userProfile: UserProfile,
  jobReducer : JobReducer,
  UserAbout : UserAbout,
});