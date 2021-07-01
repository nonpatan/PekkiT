import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import {Asset} from 'expo-asset';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        //Load Asset
        //เดิมไม่มีกำหนดนะ เอาจากของเก่ามา
        await Asset.loadAsync([
          require('../assets/images/logo.png'),
        ]);

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'DancingScript-Bold': require('../assets/fonts/Dancing_Script/DancingScript-Bold.ttf'),
          'DancingScript-Regular': require('../assets/fonts/Dancing_Script/DancingScript-Regular.ttf'),
          'Kodchasan-Medium': require('../assets/fonts/Kodchasan/Kodchasan-Medium.ttf'),
          'Kanit-Regular': require('../assets/fonts/Kanit/Kanit-Regular.ttf'),
          'Kanit-Medium': require('../assets/fonts/Kanit/Kanit-Medium.ttf'),
          'Kanit-Light': require('../assets/fonts/Kanit/Kanit-Light.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
