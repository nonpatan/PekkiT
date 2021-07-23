/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  UserSetting: undefined;
  UserSettingPasswordChanged: undefined;
  UserProfile: undefined,
  UserAbout: undefined,
  Test: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Jobs: undefined;
  Chat: undefined;
  Setting: undefined;
};

export type TabHomeParamList = {
  HomeScreen: undefined;
}

export type TabJobsParamList = {
  JobScreen: undefined;
}

export type TabChatParamList = {
  ChatScreen: undefined;
}

export type TabSettingParamList = {
  SettingScreen: undefined;
}