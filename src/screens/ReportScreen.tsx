import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { ReportData } from '../types/report';
import { submitReport } from '../services/reportService';

const ReportScreen = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [audioPath, setAudioPath] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer();

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
      });

      if (!result.didCancel && result.assets?.[0]?.uri) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('Recording...', e.currentPosition);
      });
      setAudioPath(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setAudioPath(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handleSubmit = async () => {
    if (!description || !location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const reportData: ReportData = {
        description,
        location,
        images,
        audioPath: audioPath || undefined,
      };

      await submitReport(reportData);
      Alert.alert('Success', 'Report submitted successfully');
      // Clear form
      setDescription('');
      setLocation('');
      setImages([]);
      setAudioPath('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
            onPress={audioPath ? stopRecording : startRecording}
            disabled={isSubmitting}
          >
            <Icon name={audioPath ? "stop" : "mic"} size={24} color="#4CAF50" />
            <Text style={styles.attachmentButtonText}>
              {audioPath ? "Stop Recording" : "Record Audio"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
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
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReportScreen; 