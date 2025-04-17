import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform, PermissionsAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { ReportData } from '../types/report';
import { submitReport } from '../services/reportService';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';

type ReportScreenProps = {
  navigation: StackNavigationProp<any>;
};

const ReportScreen = ({ navigation }: ReportScreenProps) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [audioPath, setAudioPath] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);

        console.log('Permission grants:', grants);
      } catch (err) {
        console.warn('Failed to request permissions:', err);
        Alert.alert('Permission Error', 'Failed to request necessary permissions');
      }
    } else {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please enable camera and photo library permissions in your device settings to use these features.'
        );
      }
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImages([...images, result.assets[0].uri]);
        console.log('Image picked:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const startRecording = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot record audio without microphone permission');
          return;
        }
      }

      console.log('Starting recording...');
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('Recording...', e.currentPosition);
      });
      setAudioPath(result);
      setIsRecording(true);
      console.log('Recording started:', result);
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      
      if (!result) {
        throw new Error('No audio file was recorded');
      }
      
      setAudioPath(result);
      setIsRecording(false);
      console.log('Recording stopped:', result);
      Alert.alert('Success', 'Audio recording completed');
    } catch (error) {
      console.error('Stop recording error:', error);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Please provide a description of the incident');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setUploadProgress(0);

    try {
      const reportData: ReportData = {
        description: description.trim(),
        location: location || 'Unknown',
        images: images,
        audioPath: audioPath,
      };

      await submitReport(reportData, (progress) => {
        setUploadProgress(progress);
      });

      // Clear form
      setDescription('');
      setLocation('');
      setImages([]);
      setAudioPath('');
      setUploadProgress(0);
      
      // Show success message
      Alert.alert(
        'Success',
        'Your report has been submitted anonymously. Thank you for helping make our community safer.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location details"
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the incident"
          multiline
          numberOfLines={4}
        />

        <View style={styles.attachmentSection}>
          <Text style={styles.label}>Attachments</Text>
          
          <TouchableOpacity 
            style={styles.attachmentButton} 
            onPress={handleImagePick}
            disabled={isSubmitting}
          >
            <Icon name="photo-camera" size={24} color="#4CAF50" />
            <Text style={styles.attachmentButtonText}>Add Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.attachmentButton} 
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isSubmitting}
          >
            <Icon name={isRecording ? "stop" : "mic"} size={24} color="#4CAF50" />
            <Text style={styles.attachmentButtonText}>
              {isRecording ? "Stop Recording" : "Record Audio"}
            </Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <Text style={styles.attachmentInfo}>
              {images.length} image(s) attached
            </Text>
          )}

          {audioPath ? (
            <Text style={styles.attachmentInfo}>
              Audio recording attached
            </Text>
          ) : null}
        </View>

        {isSubmitting && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{`Uploading... ${Math.round(uploadProgress)}%`}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.submitButton,
            (isSubmitting || !description.trim()) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !description.trim()}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  attachmentSection: {
    marginBottom: 20,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  attachmentButtonText: {
    marginLeft: 10,
    color: '#4CAF50',
    fontSize: 16,
  },
  attachmentInfo: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  progressContainer: {
    marginVertical: 15,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 5,
    color: '#666',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
});

export default ReportScreen; 