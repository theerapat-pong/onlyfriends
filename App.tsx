import React, { useState } from 'react';
import { User } from './types';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ChatRoom from './components/ChatRoom';

const generateUID = (existingUIDs: string[], length = 6): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let result: string;
    do {
        result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    } while (existingUIDs.includes(result));
    return result;
};

const MOCK_USERS_INITIAL: User[] = [
  { id: 1, uid: 'OWNER', name: 'RAIN', email: 'theerapat.info@gmail.com', password: 'Trppt200442', avatar: 'https://i.pravatar.cc/150?u=1', color: 'text-rainbow-animated', isOwner: true, bio: 'Room owner. Loves coding and music.', level: 99 },
  { id: 2, uid: 'GMNB0T', name: 'Gemini Bot', email: 'bot@example.com', avatar: 'bot', color: 'text-rank-user', bio: 'I am a helpful assistant bot.', level: 0 },
  { id: 3, uid: 'M1NT23', name: 'MINT', email: 'mint@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=3', color: 'text-rank-vip1', bio: 'Loves pink!', level: 25 },
  { id: 4, uid: 'ADM001', name: 'ADMIN', email: 'admin@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=4', color: 'text-rank-admin', bio: 'Room administrator.', level: 50 },
  { id: 5, uid: 'USER01', name: 'SOMCHAI', email: 'somchai@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=5', color: 'text-rank-vip2', bio: 'Just chilling.', level: 15 },
  { id: 6, uid: 'USER02', name: 'SOMYING', email: 'somying@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=6', color: 'text-rank-pro', bio: 'Playing games.', level: 8 },
  { id: 7, uid: 'USER03', name: 'DAVID', email: 'david@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=7', color: 'text-rank-user', bio: 'Hello world.', level: 1 },
];


const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS_INITIAL);
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (email: string, password: string) => {
    setError(null);
    const userToLogin = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (userToLogin) {
      setCurrentUser(userToLogin);
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSignUp = (username: string, email: string, password: string) => {
    setError(null);
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        setError('มีบัญชีที่ใช้อีเมลนี้อยู่แล้ว');
        return;
    }
    if (users.some(user => user.name.toLowerCase() === username.toLowerCase())) {
        setError('มีคนใช้ชื่อผู้ใช้นี้แล้ว');
        return;
    }

    const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
    const existingUIDs = users.map(u => u.uid);
    const newUser: User = {
      id: maxId + 1,
      uid: generateUID(existingUIDs),
      name: username,
      email: email,
      password: password,
      avatar: `https://i.pravatar.cc/150?u=${maxId + 1}`,
      color: 'text-gray-300', // Default color for new users
      isOwner: false,
      bio: '',
      level: 1,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };


  if (!currentUser) {
    if (view === 'signup') {
      return <SignUp onSignUp={handleSignUp} onSwitchToLogin={() => { setView('login'); setError(null); }} error={error} />;
    }
    return <Login onLogin={handleLogin} onSwitchToSignUp={() => { setView('signup'); setError(null); }} error={error} />;
  }

  return <ChatRoom allUsers={users} currentUser={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
};

export default App;