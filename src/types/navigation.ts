import { NavigatorScreenParams } from '@react-navigation/native';
import { ReportListItem } from './report';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Report: undefined;
  ReportDetails: { report: ReportListItem };
  AuthorityDashboard: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 