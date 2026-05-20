import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import ClientRegisterScreen from './src/screens/ClientRegisterScreen';
import VendorRegisterScreen from './src/screens/VendorRegisterScreen';
import VendorFinishRegisterScreen from './src/screens/VendorFinishRegisterScreen';
import HomeScreen_Client from './src/screens/HomeScreen_Client';
import HomeScreen_Vendor from './src/screens/HomeScreen_Vendor';
import Business_DetailScreen from './src/screens/Business_DetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VendorScheduleScreen from './src/screens/VendorScheduleScreen';
import EditContactScreen from './src/screens/EditContactScreen';
import EditBusinessScreen from './src/screens/EditBusinessScreen';
import MenuScreen from './src/screens/MenuScreen';
import { loadSession, saveSession, clearSession } from './src/services/sessionStorage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const CustomTabButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customTabButton}
    onPress={onPress}
  >
    <View style={styles.customTabButtonInner}>
      {children}
    </View>
  </TouchableOpacity>
);

function LoginStack({ onLoginSuccess }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {() => <LoginScreen onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen 
        name="ClientRegister" 
        component={ClientRegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VendorRegister" 
        component={VendorRegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VendorDetails" 
        component={VendorFinishRegisterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainTabs({ onLogout, user }) {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: 'rgb(250, 249, 246)',
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: 'rgb(45, 44, 44)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 6,
          shadowRadius: 10,
          height: 65,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: 'rgb(232, 17, 35)',
        tabBarInactiveTintColor: 'rgb(181, 181, 181)',
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      }}
    >
      <Tab.Screen 
        name="MenuTab" 
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menú',
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="HomeTab" 
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <Ionicons name="home" color="rgba(255, 255, 255, 1)" size={30} />
          ),
          tabBarButton: (props) => (
            <CustomTabButton {...props} />
          ),
        }}
      >
        {({ navigation }) => user.idRol === 1 ? <HomeScreen_Vendor user={user} /> : <HomeScreen_Client navigation={navigation} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="ProfileTab" 
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" color={color} size={26} />
          ),
        }}
      >
        {() => <ProfileScreen onLogout={onLogout} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function LoggedInStack({ user, onLogout }) {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="MainTabs" options={{ headerShown: false }}>
        {() => <MainTabs onLogout={onLogout} user={user} />}
      </RootStack.Screen>
      <RootStack.Screen
        name="VendorSchedule"
        options={{ headerShown: false }}
      >
        {() => <VendorScheduleScreen user={user} />}
      </RootStack.Screen>
      <RootStack.Screen
        name="EditContact"
        options={{ headerShown: false }}
      >
        {() => <EditContactScreen user={user} />}
      </RootStack.Screen>
      <RootStack.Screen
        name="EditBusiness"
        options={{ headerShown: false }}
      >
        {() => <EditBusinessScreen user={user} />}
      </RootStack.Screen>
      <RootStack.Screen
        name="BusinessDetail"
        component={Business_DetailScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
}

function isRestorableUser(data) {
  return (
    data != null &&
    typeof data === 'object' &&
    data.idUser != null &&
    data.idRol != null
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await loadSession();
        if (!cancelled && isRestorableUser(stored)) {
          setUser(stored);
        }
      } catch (e) {
        console.warn('No se pudo restaurar la sesión:', e);
      } finally {
        if (!cancelled) {
          setSessionReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoginSuccess = useCallback(async (userData) => {
    setUser(userData);
    try {
      await saveSession(userData);
    } catch (e) {
      console.warn('No se pudo guardar la sesión en el dispositivo:', e);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await clearSession();
    } catch (e) {
      console.warn('No se pudo borrar la sesión local:', e);
    }
    setUser(null);
  }, []);

  if (!sessionReady) {
    return (
      <View style={styles.bootContainer}>
        <ActivityIndicator size="large" color="#e81123" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <LoggedInStack user={user} onLogout={handleLogout} />
      ) : (
        <LoginStack onLoginSuccess={handleLoginSuccess} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7fa',
  },
  customTabButton: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTabButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgb(232, 17, 35)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
