export interface Message {
  id: string;
  author: string;
  avatar: string;
  text: string;
  type: 'user' | 'bot' | 'system';
  authorColor?: string;
  isAuthorOwner?: boolean;
  authorLevel?: number;
}

export interface User {
  id: number;
  uid: string;
  name: string;
  email: string;
  password?: string; // Password should not be stored in state long-term, but is needed for mock auth
  avatar: string;
  color: string;
  isOwner?: boolean;
  bio?: string;
  level: number;
}