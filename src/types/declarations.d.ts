declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class Icon extends Component<IconProps> {}
}

declare module 'react-native-image-picker' {
  export interface ImagePickerResponse {
    didCancel?: boolean;
    errorCode?: string;
    errorMessage?: string;
    assets?: Array<{
      uri: string;
      type?: string;
      name?: string;
      size?: number;
    }>;
  }

  export interface ImageLibraryOptions {
    mediaType?: 'photo' | 'video' | 'mixed';
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    videoQuality?: 'low' | 'medium' | 'high';
    durationLimit?: number;
    selectionLimit?: number;
    includeBase64?: boolean;
    includeExtra?: boolean;
  }

  export function launchImageLibrary(
    options: ImageLibraryOptions,
    callback: (response: ImagePickerResponse) => void
  ): void;
}

declare module 'react-native-audio-recorder-player' {
  export default class AudioRecorderPlayer {
    startRecorder(): Promise<string>;
    stopRecorder(): Promise<string>;
    startPlayer(): Promise<string>;
    stopPlayer(): Promise<string>;
    addRecordBackListener(callback: (data: any) => void): void;
    removeRecordBackListener(): void;
  }
}

declare module 'react-native-push-notification' {
  export interface PushNotificationOptions {
    onRegister?: (token: { os: string; token: string }) => void;
    onNotification?: (notification: any) => void;
    onAction?: (notification: any) => void;
    onRegistrationError?: (err: any) => void;
    permissions?: {
      alert?: boolean;
      badge?: boolean;
      sound?: boolean;
    };
    popInitialNotification?: boolean;
    requestPermissions?: boolean;
  }

  export default class PushNotification {
    static configure(options: PushNotificationOptions): void;
    static localNotification(details: any): void;
    static requestPermissions(): Promise<any>;
  }
}

declare module 'expo-status-bar' {
  import { Component } from 'react';
  import { ViewProps, StyleProp, ViewStyle } from 'react-native';

  interface StatusBarProps extends Omit<ViewProps, 'style'> {
    style?: 'auto' | 'inverted' | 'light' | 'dark';
    animated?: boolean;
    hidden?: boolean;
    backgroundColor?: string;
    translucent?: boolean;
  }

  export default class StatusBar extends Component<StatusBarProps> {}
} 