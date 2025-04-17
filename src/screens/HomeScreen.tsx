import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { auth } from '../config/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  console.log('HomeScreen rendering...');
  
  const navigation = useNavigation<NavigationProp>();
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Checking...');

  useEffect(() => {
    console.log('HomeScreen useEffect running...');
    // Test Firebase connection
    const testFirebase = async () => {
      try {
        // Try to get current user (will be null if not logged in)
        const user = auth.currentUser;
        setFirebaseStatus('Firebase Connected Successfully!');
        console.log('Firebase connection test passed');
      } catch (error) {
        setFirebaseStatus('Firebase Connection Failed');
        console.error('Firebase connection test failed:', error);
      }
    };

    testFirebase();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Anti-Drug Campaign</Text>
        <Text style={styles.subtitle}>Report Anonymously, Save Lives</Text>
        <Text style={styles.status}>{firebaseStatus}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            console.log('Navigating to Report screen...');
            navigation.navigate('Report');
          }}
        >
          <Icon name="report" size={30} color="#fff" />
          <Text style={styles.buttonText}>Submit Report</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            console.log('Navigating to Login screen...');
            navigation.navigate('Login');
          }}
        >
          <Icon name="security" size={30} color="#fff" />
          <Text style={styles.buttonText}>Authority Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your identity is protected. All reports are encrypted.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen; 