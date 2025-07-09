import React, { useState } from 'react';
import { User } from './types';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ChatRoom from './components/ChatRoom';

// Initial state for a new room: contains only the owner and the bot.
const MOCK_USERS_INITIAL: User[] = [
  { id: 1, uid: 'OWNER', name: 'RAIN', email: 'theerapat.info@gmail.com', password: 'Trppt200442', avatar: 'https://i.pravatar.cc/150?u=1', color: 'text-rainbow-animated', isOwner: true, bio: 'Room owner. Loves coding and music.', level: 99 },
  { id: 2, uid: 'GMNB0T', name: 'Gemini Bot', email: 'bot@example.com', avatar: 'bot', color: 'text-rank-user', bio: 'I am a helpful assistant bot.', level: 0 },
];


const App = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS_INITIAL);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (email: string, password: string) => {
    setError(null);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      if (user.isBanned) {
        setError('บัญชีของคุณถูกระงับการใช้งาน');
      } else {
        setCurrentUser(user);
      }
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };
  
  const handleSignUp = (name: string, email: string, password: string) => {
    setError(null);
    if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
        setError('ชื่อผู้ใช้นี้มีคนใช้แล้ว');
        return;
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว');
        return;
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
        id: newId,
        uid: `USER${String(newId).padStart(4, '0')}`,
        name,
        email,
        password,
        avatar: `https://i.pravatar.cc/150?u=${newId}`,
        color: 'text-gray-300', // Default rank for new users
        bio: 'ยินดีที่ได้รู้จัก!',
        level: 1,
        isMuted: false,
        isBanned: false,
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  if (currentUser) {
    return <ChatRoom allUsers={users} currentUser={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
  }

  if (view === 'signup') {
    return <SignUp onSignUp={handleSignUp} onSwitchToLogin={() => { setView('login'); setError(null); }} error={error} />;
  }

  return <Login onLogin={handleLogin} onSwitchToSignUp={() => { setView('signup'); setError(null); }} error={error} />;
};

export default App;