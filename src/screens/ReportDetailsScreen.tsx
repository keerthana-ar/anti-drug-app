import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ReportListItem, ReportStatus } from '../types/report';
import { updateReportStatus } from '../services/reportService';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ReportDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ReportDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReportDetails'>;

const ReportDetailsScreen = () => {
  const route = useRoute<ReportDetailsScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { report } = route.params;
  const [status, setStatus] = useState<ReportStatus>(report.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: ReportStatus) => {
    setIsUpdating(true);
    try {
      await updateReportStatus(report.id, newStatus);
      setStatus(newStatus);
    } catch (error) {
      Alert.alert('Error', 'Failed to update report status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: ReportStatus): string => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'in_progress':
        return '#2196F3';
      case 'resolved':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: ReportStatus): string => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return 'Unknown';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Report Details</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.sectionText}>{report.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionText}>{report.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timestamp</Text>
          <Text style={styles.sectionText}>
            {new Date(report.timestamp).toLocaleString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                status === 'pending' && styles.statusButtonActive,
                { backgroundColor: status === 'pending' ? '#FFA500' : '#f0f0f0' }
              ]}
              onPress={() => handleStatusChange('pending')}
              disabled={isUpdating}
            >
              <Text style={[
                styles.statusButtonText,
                status === 'pending' && styles.statusButtonTextActive
              ]}>
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                status === 'in_progress' && styles.statusButtonActive,
                { backgroundColor: status === 'in_progress' ? '#2196F3' : '#f0f0f0' }
              ]}
              onPress={() => handleStatusChange('in_progress')}
              disabled={isUpdating}
            >
              <Text style={[
                styles.statusButtonText,
                status === 'in_progress' && styles.statusButtonTextActive
              ]}>
                In Progress
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                status === 'resolved' && styles.statusButtonActive,
                { backgroundColor: status === 'resolved' ? '#4CAF50' : '#f0f0f0' }
              ]}
              onPress={() => handleStatusChange('resolved')}
              disabled={isUpdating}
            >
              <Text style={[
                styles.statusButtonText,
                status === 'resolved' && styles.statusButtonTextActive
              ]}>
                Resolved
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {report.images && report.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {report.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  statusButtonActive: {
    backgroundColor: '#4CAF50',
  },
  statusButtonText: {
    color: '#666',
    fontSize: 14,
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 10,
  },
});

export default ReportDetailsScreen; 