export interface MessageStyle {
  fontSize?: string;
  fontWeight?: 'bold' | 'normal';
  fontStyle?: 'italic' | 'normal';
  color?: string;
}

export interface Message {
  id: string;
  author: string;
  avatar: string;
  text: string;
  type: 'user' | 'bot' | 'system';
  authorColor?: string;
  isAuthorOwner?: boolean;
  authorLevel?: number;
  styles?: MessageStyle;
  showVipBadge?: boolean;
  authorUid: string;
  createdAt?: any; // To hold serverTimestamp
}

export interface User {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  isOwner?: boolean;
  bio?: string;
  level: number;
  isMuted?: boolean;
  isBanned?: boolean;
}

export type LogType = 'info' | 'action' | 'moderation' | 'system' | 'error';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  message: string;
}