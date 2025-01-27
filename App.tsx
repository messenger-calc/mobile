import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import 'react-native-get-random-values';

import { NavigationContainer } from '@react-navigation/native';
import { Alert, AppState } from 'react-native';

import messaging from '@react-native-firebase/messaging';
import { getFcmToken, registerListenerWithFCM } from './src/screens/chat/utils/fcmHelper/index';
import { Navigator } from './src/navigation/Navigator';

// import "./src/screens/chat/utils/socket"
import { SocketProvider } from './src/screens/chat/socket/SocketContext';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const App = () => {
      requestUserPermission();

      // useEffect(() => {
      //   getFcmToken();
      // }, []);
    
      useEffect(() => {
        const unsubscribe = registerListenerWithFCM();
        return unsubscribe;
      }, []);

    return (
        <SocketProvider>
          <NavigationContainer>
              <Navigator />
          </NavigationContainer>
        </SocketProvider>
    );
};

export default App;