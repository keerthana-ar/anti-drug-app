import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types/navigation';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ReportScreen from './src/screens/ReportScreen';
import LoginScreen from './src/screens/LoginScreen';
import AuthorityDashboard from './src/screens/AuthorityDashboard';
import ReportDetailsScreen from './src/screens/ReportDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Anti-Drug Campaign' }}
          />
          <Stack.Screen 
            name="Report" 
            component={ReportScreen} 
            options={{ title: 'Submit Report' }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Authority Login' }}
          />
          <Stack.Screen 
            name="Dashboard" 
            component={AuthorityDashboard} 
            options={{ title: 'Authority Dashboard' }}
          />
          <Stack.Screen 
            name="ReportDetails" 
            component={ReportDetailsScreen} 
            options={{ title: 'Report Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 