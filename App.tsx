import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types/navigation';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ReportScreen from './src/screens/ReportScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AuthorityDashboard from './src/screens/AuthorityDashboard';
import ReportDetailsScreen from './src/screens/ReportDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  console.log('App rendering...');
  
  return (
    <SafeAreaProvider>
      <NavigationContainer
        onStateChange={(state) => console.log('Navigation state:', state)}
        fallback={<Text>Loading...</Text>}
      >
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
            name="Register" 
            component={RegisterScreen}
            options={{ title: 'Create Account' }}
          />
          <Stack.Screen 
            name="AuthorityDashboard" 
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

export default App; 