/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home:{
            screens:{
              HomeScreen:'Home',
            }
          },
          Jobs:{
            screens:{
              JobScreen:'Jobs'
            }
          },
          Chat:{
            screens:{
              ChatScreen:'Chat'
            }
          },
          Setting:{
            screens:{
              SettingScreen:'Setting'
            }
          }
        },
      },
      NotFound: '*',
    },
  },
};
