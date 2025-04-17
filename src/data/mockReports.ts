import { ReportListItem } from '../types/report';

export const mockReports: ReportListItem[] = [
  {
    id: '1',
    location: 'Central Park',
    description: 'Suspicious activity reported near the fountain',
    timestamp: '2024-04-17T10:30:00Z',
    status: 'pending',
  },
  {
    id: '2',
    location: 'Downtown Mall',
    description: 'Possible drug dealing in progress',
    timestamp: '2024-04-17T09:15:00Z',
    status: 'in_progress',
  },
  {
    id: '3',
    location: 'Subway Station',
    description: 'Report of drug use in restroom',
    timestamp: '2024-04-17T08:45:00Z',
    status: 'resolved',
  },
]; 