import CryptoJS from 'crypto-js';
import { db, storage } from '../config/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'YOUR_ENCRYPTION_KEY';

interface ReportData {
  location: string;
  description: string;
  images?: string[];
  audioPath?: string;
}

interface Report {
  location: string;
  description: string;
  images: string[];
  audioUrl: string;
  timestamp: string;
  status: 'pending' | 'in_progress' | 'resolved';
}

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const uploadFile = async (uri: string, path: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

export const submitReport = async (reportData: ReportData): Promise<string> => {
  try {
    // Encrypt sensitive data
    const encryptedLocation = encryptData(reportData.location);
    const encryptedDescription = encryptData(reportData.description);

    // Upload media files if present
    let imageUrls: string[] = [];
    if (reportData.images) {
      for (const image of reportData.images) {
        try {
          const imageUrl = await uploadFile(image, `reports/images/${Date.now()}`);
          imageUrls.push(imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          // Continue with other images even if one fails
        }
      }
    }

    let audioUrl = '';
    if (reportData.audioPath) {
      try {
        audioUrl = await uploadFile(reportData.audioPath, `reports/audio/${Date.now()}`);
      } catch (error) {
        console.error('Error uploading audio:', error);
      }
    }

    // Create report document
    const report: Report = {
      location: encryptedLocation,
      description: encryptedDescription,
      images: imageUrls,
      audioUrl,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'reports'), report);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw new Error('Failed to submit report');
  }
};

export const updateReportStatus = async (
  reportId: string, 
  status: 'pending' | 'in_progress' | 'resolved'
): Promise<void> => {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, { status });
  } catch (error) {
    console.error('Error updating report status:', error);
    throw new Error('Failed to update report status');
  }
}; 