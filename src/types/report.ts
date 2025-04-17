export type ReportStatus = 'pending' | 'in_progress' | 'resolved';

export interface Report {
  id: string;
  location: string;
  description: string;
  images: string[];
  audioUrl: string;
  timestamp: string;
  status: ReportStatus;
}

export interface ReportData {
  description: string;
  location: string;
  images: string[];
  audioPath?: string;
}

export interface ReportListItem {
  id: string;
  location: string;
  description: string;
  images: string[];
  timestamp: string;
  status: ReportStatus;
}

export interface ReportFormData {
  location: string;
  description: string;
  images?: string[];
  audioPath?: string;
}

export interface EncryptedReport {
  id: string;
  location: string; // encrypted
  description: string; // encrypted
  images?: string[];
  audioUrl?: string;
  timestamp: string;
  status: ReportStatus;
} 