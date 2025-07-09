import React, { useState, useEffect } from 'react';
import { User } from './types';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ChatRoom from './components/ChatRoom';
import { auth, db } from './services/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, collection, updateDoc } from 'firebase/firestore';

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, 'users', authUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setCurrentUser({ uid: docSnap.id, ...docSnap.data() } as User);
        } else {
          // This case might happen if user is created in auth but not in firestore.
          // For this app, we'll log them out to force a clean sign-up.
          await signOut(auth);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const usersCollectionRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        setError('เกิดข้อผิดพลาดในการลงชื่อเข้าใช้');
      }
      console.error(err);
    }
  };
  
  const handleSignUp = async (name: string, email: string, password: string) => {
    setError(null);
    if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
        setError('ชื่อผู้ใช้นี้มีคนใช้แล้ว');
        return;
    }
    // Firestore security rules should handle email uniqueness, but a client-side check is good UX.
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว');
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const isOwner = user.email === 'theerapat.info@gmail.com';

      const newUser: User = {
          uid: user.uid,
          name,
          email: user.email!,
          avatar: `https://i.pravatar.cc/150?u=${user.uid}`,
          color: isOwner ? 'text-rainbow-animated' : 'text-gray-300',
          bio: 'ยินดีที่ได้รู้จัก!',
          level: isOwner ? 99 : 1,
          isMuted: false,
          isBanned: false,
          isOwner: isOwner
      };
      
      await setDoc(doc(db, 'users', user.uid), newUser);
      // onAuthStateChanged will handle setting the current user.
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว');
      } else {
        setError('เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
      console.error(err);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('login');
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  const handleUpdateUser = async (updatedUser: Partial<User> & { uid: string }) => {
    const userDocRef = doc(db, 'users', updatedUser.uid);
    try {
        await updateDoc(userDocRef, updatedUser);
        // Optimistically update current user if it's them
        if (currentUser && currentUser.uid === updatedUser.uid) {
          setCurrentUser(prev => ({ ...prev!, ...updatedUser }));
        }
    } catch (error) {
        console.error("Error updating user: ", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-camfrog-bg text-white">กำลังโหลด...</div>;
  }

  if (currentUser) {
    return <ChatRoom allUsers={users} currentUser={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
  }

  if (view === 'signup') {
    return <SignUp onSignUp={handleSignUp} onSwitchToLogin={() => { setView('login'); setError(null); }} error={error} />;
  }

  return <Login onLogin={handleLogin} onSwitchToSignUp={() => { setView('signup'); setError(null); }} error={error} />;
};

export default App;