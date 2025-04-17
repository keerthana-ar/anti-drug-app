import CryptoJS from 'crypto-js';
import { db, storage } from '../config/firebase';
import { collection, addDoc, doc, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { ENCRYPTION_KEY } from '@env';
import { ReportData, ReportListItem, Report as ReportType } from '../types/report';

interface Report {
  location: string;
  description: string;
  images: string[];
  audioUrl: string;
  timestamp: string;
  status: 'pending' | 'in_progress' | 'resolved';
}

const encryptData = (data: string): string => {
  try {
    if (!ENCRYPTION_KEY) {
      throw new Error('Encryption key not found');
    }
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

const decryptData = (encryptedData: string): string => {
  try {
    if (!ENCRYPTION_KEY) {
      throw new Error('Encryption key not found');
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_RETRIES = 3;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/heic'];
const ALLOWED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac'];

interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

const validateFile = (blob: Blob, isImage: boolean): void => {
  if (blob.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }
  
  const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_AUDIO_TYPES;
  if (!allowedTypes.includes(blob.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
};

const uploadFile = async (
  uri: string, 
  path: string, 
  onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Determine if this is an image upload based on the path
      const isImage = path.includes('/images/');
      validateFile(blob, isImage);
      
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      
      // Track upload progress
      if (onProgress) {
        uploadTask.on('state_changed', (snapshot) => {
          const progress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          };
          onProgress(progress);
        });
      }
      
      // Wait for upload to complete
      await uploadTask;
      return await getDownloadURL(storageRef);
    } catch (error) {
      attempt++;
      console.error(`Upload attempt ${attempt} failed:`, error);
      
      if (attempt === MAX_RETRIES) {
        throw new Error('Failed to upload file after multiple attempts');
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw new Error('Upload failed after maximum retries');
};

export const submitReport = async (
  reportData: ReportData, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    if (!reportData.description) {
      throw new Error('Description is required');
    }

    const encryptedLocation = encryptData(reportData.location || 'Unknown');
    const encryptedDescription = encryptData(reportData.description);

    let totalProgress = 0;
    const totalFiles = reportData.images.length + (reportData.audioPath ? 1 : 0);
    let completedFiles = 0;

    // Upload media files if present
    let imageUrls: string[] = [];
    if (reportData.images && reportData.images.length > 0) {
      for (const image of reportData.images) {
        try {
          const imageUrl = await uploadFile(
            image, 
            `reports/images/${Date.now()}_${Math.random().toString(36).substring(7)}`,
            progress => {
              if (onProgress) {
                const fileProgress = progress.progress / 100;
                const overallProgress = (completedFiles + fileProgress) / totalFiles * 100;
                onProgress(overallProgress);
              }
            }
          );
          imageUrls.push(imageUrl);
          completedFiles++;
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new Error('Failed to upload image. Please try again.');
        }
      }
    }

    let audioUrl = '';
    if (reportData.audioPath) {
      try {
        audioUrl = await uploadFile(
          reportData.audioPath, 
          `reports/audio/${Date.now()}_${Math.random().toString(36).substring(7)}`,
          progress => {
            if (onProgress) {
              const fileProgress = progress.progress / 100;
              const overallProgress = (completedFiles + fileProgress) / totalFiles * 100;
              onProgress(overallProgress);
            }
          }
        );
        completedFiles++;
      } catch (error) {
        console.error('Error uploading audio:', error);
        throw new Error('Failed to upload audio. Please try again.');
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
    throw error instanceof Error ? error : new Error('Failed to submit report. Please try again.');
  }
};

export const updateReportStatus = async (reportId: string, status: Report['status']): Promise<void> => {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, { status });
  } catch (error) {
    console.error('Error updating report status:', error);
    throw new Error('Failed to update report status');
  }
};

export const fetchReports = async (): Promise<ReportListItem[]> => {
  try {
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Report;
      return {
        id: doc.id,
        location: decryptData(data.location),
        description: decryptData(data.description),
        images: data.images,
        timestamp: data.timestamp,
        status: data.status
      };
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw new Error('Failed to fetch reports');
  }
}; 