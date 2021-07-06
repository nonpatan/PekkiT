/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import HomeScreen from '../screens/HomeScreen';
import JobScreen from '../screens/JobScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingScreen from '../screens/SettingScreen';

import { BottomTabParamList, TabHomeParamList,TabJobsParamList,TabChatParamList,TabSettingParamList  } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{activeTintColor: Colors[colorScheme].tint,labelStyle:{fontFamily:'Kanit-Light'} }}>
      <BottomTab.Screen
        name="Home"
        component={TabHomeNavigator}
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ color }) => <TabBarIcon name={Platform.OS == 'ios' ? `ios-home` : 'md-home'} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Jobs"
        component={TabJobsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={TabChatNavigator}
        options={{
          title: 'แชท',
          tabBarIcon: ({ color }) => <TabBarIcon name={Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Setting"
        component={TabSettingNavigator}
        options={{
          title: 'ตั้งค่า',
          tabBarIcon: ({ color }) => <TabBarIcon name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabHomeStack  = createStackNavigator<TabHomeParamList>();

function TabHomeNavigator() {
  const colorScheme = useColorScheme();
  return (
    <TabHomeStack.Navigator>
      <TabHomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerTitle: 'ยินดีต้อนรับสู่ Pekki Technician', headerTintColor: Colors[colorScheme].tintHeader, headerStyle: { backgroundColor: Colors[colorScheme].headerBackgroundColor,},headerTitleStyle:{fontFamily:'Kanit-Medium'} }}
      />
    </TabHomeStack.Navigator>
  )
}

const TabJobsStack = createStackNavigator<TabJobsParamList>();

function TabJobsNavigator() {
  const colorScheme = useColorScheme();
  return (
    <TabJobsStack.Navigator>
      <TabJobsStack.Screen
        name="JobScreen"
        component={JobScreen}
        options={{ headerTitle: 'งาน', headerTintColor: Colors[colorScheme].tintHeader, headerStyle: { backgroundColor: Colors[colorScheme].headerBackgroundColor },headerTitleStyle:{fontFamily:'Kanit-Medium'} }}
      />
    </TabJobsStack.Navigator>
  )
}

const TabChatStack = createStackNavigator<TabChatParamList>();

function TabChatNavigator() {
  const colorScheme = useColorScheme();
  return (
    <TabChatStack.Navigator>
      <TabChatStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerTitle: 'แชท', headerTintColor: Colors[colorScheme].tintHeader, headerStyle: { backgroundColor: Colors[colorScheme].headerBackgroundColor },headerTitleStyle:{fontFamily:'Kanit-Medium'} }}
      />
    </TabChatStack.Navigator>
  )
}

const TabSettingStack = createStackNavigator<TabSettingParamList>();

function TabSettingNavigator() {
  const colorScheme = useColorScheme();
  return (
    <TabSettingStack.Navigator>
      <TabSettingStack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ headerTitle: 'ตั้งค่า', headerTintColor: Colors[colorScheme].tintHeader, headerStyle: { backgroundColor: Colors[colorScheme].headerBackgroundColor },headerTitleStyle:{fontFamily:'Kanit-Medium'} }}
      />
    </TabSettingStack.Navigator>
  )
}
