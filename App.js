/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import Home from './components/Home';
import AssetTracking from './components/AssetTracking';
import LocationAsset from './components/LocationAsset';
import ClientLogin from './components/ClientLogin';
import Comparison from './components/Comparison';
import LocationDetails from './components/LocationDetails';
const Stack = createNativeStackNavigator();
export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isNew, setisNew] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [initialRoute, setinitialRoute] = useState('');


  function onAuthStateChanged(user) {
    // setUser(user);
    const { currentUser } = auth();
    console.log(currentUser)
    if (currentUser) {
      setinitialRoute('LoggedInContainer');
    } else {

      setinitialRoute('ClientSign');
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


  const ClientSign = ({ navigation }) => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ClientLogin" component={ClientLogin} />
      </Stack.Navigator>
    );
  };

  const LoggedInContainer = ({ navigation }) => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AssetTracking" component={AssetTracking} />
        <Stack.Screen name="LocationAsset" component={LocationAsset} />
        <Stack.Screen name="LocationDetails" component={LocationDetails} />
        <Stack.Screen name="Comparison" component={Comparison} />
      </Stack.Navigator>
    );
  };
  return (
    // <View>
    //   <Text>sdsd</Text>
    // </View>
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FA" />
      {initialRoute && (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ClientSign" component={ClientSign} />
            <Stack.Screen
              name="LoggedInContainer"
              component={LoggedInContainer}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}
