/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import Colors from '../constants/Colors'; //เพิ่มมาเอง
import useColorScheme from '../hooks/useColorScheme'; //เพิ่มมาเอง
import firebase from 'firebase'; //เพิ่มมาเอง

/** 
 * เพิ่มหน้าต่างๆ 
 */
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import ResetPassword from '../screens/AuthScreens/ResetPasswordScreen';
import UserSetting from '../screens/SettingScreens/UserSettingScreen';
import UserSettingPasswordChanged from '../screens/SettingScreens/UserSettingPasswordChangedScreen';
import UserProfile from '../screens/SettingScreens/UserProfileScreen';
import UserAbout from '../screens/SettingScreens/UserAbout';
import TestScreen from '../screens/TestScreen';

/**
 * เกี่ยวกับ Redux 
*/
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from '../redux/reducers/index';
const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
/********************** */

/** 
 * ติดต่อ firebase 
 */
const config = {
  apiKey: "AIzaSyD_19Th27TqrIV2U1LFJUOesHwbX29DrJ8",
  authDomain: "pekki-41653.firebaseapp.com",
  databaseURL: "https://pekki-41653.firebaseio.com",
  projectId: "pekki-41653",
  storageBucket: "pekki-41653.appspot.com",
  messagingSenderId: "841283763937",
  appId: "1:841283763937:web:f5c039a993b3709e9a81a0"

};

//สร้าง obj stack
const AuthStack = createStackNavigator();

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  //กำหนด state เพื่อตรวจสอบการ login
  const [user, setUser] = React.useState({ loggedIn: false });
  const colorSchemeStack = useColorScheme();

  //ตรวจสอบการ login
  React.useEffect(() => {
    async function loadFirebase() {
      //ติดต่อ firebase
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }

        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            setUser({ loggedIn: true });
          }
          else {
            setUser({ loggedIn: false });
          }
        });
      }
      catch (e) {
        console.warn(e);
      }
    }
    loadFirebase();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        
        {user.loggedIn ? (
          <RootNavigator />
        ) : (
          <AuthStack.Navigator>
            <AuthStack.Screen name='Login' component={LoginScreen} options={{ headerShown: false, headerTintColor: Colors[colorSchemeStack].tintHeader, headerStyle: { backgroundColor: Colors[colorSchemeStack].headerBackgroundColor } }} />
            <AuthStack.Screen name='ResetPassword' component={ResetPassword} options={{ headerShown: false, headerTintColor: Colors[colorSchemeStack].tintHeader, headerStyle: { backgroundColor: Colors[colorSchemeStack].headerBackgroundColor } }} />
          </AuthStack.Navigator>
        )}

      </NavigationContainer>
    </Provider>

  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

/** 
 * หน้าสำหรับ stack navigation 
 * ได้ทำการกำหนดธีมสีให้กับแต่ละหน้า รูปแบบการแสดงผลในแต่ละหน้า
 */
function RootNavigator() {

  //ดึงธีมสีจากระบบ
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, headerTintColor: Colors[colorScheme].tintHeader, headerStyle: { backgroundColor: Colors[colorScheme].headerBackgroundColor }, headerTitleStyle: { fontFamily: 'Kanit-Medium' } }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ title: 'หน้าหลัก' }} />
      <Stack.Screen name="UserSetting" component={UserSetting} options={{ title: 'ข้อมูลผู้ใช้', headerShown: true, }} />
      <Stack.Screen name="UserSettingPasswordChanged" component={UserSettingPasswordChanged} options={{ title: 'เปลี่ยนรหัสผ่าน', headerShown: true }} />
      <Stack.Screen name='UserProfile' component={UserProfile} options={{ title: 'ข้อมูลส่วนตัวผู้ใช้', headerShown: true }} />
      <Stack.Screen name='UserAbout' component={UserAbout} options={{title:'เกี่ยวกับ',headerShown:true}} />
      <Stack.Screen name="Test" component={TestScreen} options={{ title: 'ทดสอบ', headerShown: true, headerTintColor: Colors[colorScheme].tintHeader, headerStyle: { backgroundColor: Colors[colorScheme].headerBackgroundColor } }} />
    </Stack.Navigator>
  );
}
