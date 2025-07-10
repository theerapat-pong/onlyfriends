import React, { useState, useEffect } from 'react';
import { User } from './types';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ChatRoom from './components/ChatRoom';
import AdminPanel from './components/AdminPanel';
import { auth, db, rtdb, firebase } from './services/firebase';

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation function
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  };

  // Security check for admin route
  useEffect(() => {
    if (route === '/admin' && loading === false && !currentUser?.isOwner) {
      // Redirect non-owners away from admin page
      navigate('/');
    }
  }, [route, currentUser, loading]);


  useEffect(() => {
    let unsubscribeFromRtdb: (() => void) | null = null;

    const authUnsubscribe = auth.onAuthStateChanged(async (authUser) => {
      // Clean up previous RTDB listener if user logs out and back in without a page refresh
      if (unsubscribeFromRtdb) {
        unsubscribeFromRtdb();
        unsubscribeFromRtdb = null;
      }

      if (authUser) {
        // --- Presence System Logic ---
        const userStatusDatabaseRef = rtdb.ref('/status/' + authUser.uid);
        const connectedRef = rtdb.ref('.info/connected');
        
        const rtdbCallback = (snap: firebase.database.DataSnapshot) => {
          if (snap.val() === true) {
            const conStatus = {
              state: 'online',
              last_changed: firebase.database.ServerValue.TIMESTAMP,
            };
            userStatusDatabaseRef.set(conStatus);
            
            const disconStatus = {
              state: 'offline',
              last_changed: firebase.database.ServerValue.TIMESTAMP,
            };
            userStatusDatabaseRef.onDisconnect().set(disconStatus);
          }
        };
        connectedRef.on('value', rtdbCallback);
        unsubscribeFromRtdb = () => connectedRef.off('value', rtdbCallback);
        // --- End Presence System Logic ---

        const userDocRef = db.collection('users').doc(authUser.uid);
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
          const userData = { uid: docSnap.id, ...docSnap.data() } as User;
          setCurrentUser(userData);
          if (route === '/admin' && !userData.isOwner) {
            navigate('/');
          }
        } else {
          await auth.signOut();
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        if(route === '/admin') {
            navigate('/');
        }
      }
      setLoading(false);
    });

    return () => {
        authUnsubscribe();
        if (unsubscribeFromRtdb) {
            unsubscribeFromRtdb();
        }
    };
  }, [route]);

  useEffect(() => {
    const usersCollectionRef = db.collection('users');
    const unsubscribe = usersCollectionRef.onSnapshot((snapshot) => {
      const usersList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      await auth.signInWithEmailAndPassword(email, password);
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
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (!user) throw new Error("User creation failed.");
      
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
      
      await db.collection('users').doc(user.uid).set(newUser);
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
    if (auth.currentUser) {
      const userStatusDatabaseRef = rtdb.ref('/status/' + auth.currentUser.uid);
      // Update status without waiting, to make logout feel faster.
      // If it fails, log the error but don't block the user.
      userStatusDatabaseRef.set({
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      }).catch(rtdbError => {
        console.error("Could not update user status on logout:", rtdbError);
      });
    }
    try {
      await auth.signOut();
      // Force UI update immediately after sign-out completes.
      // This is more reliable than waiting for the onAuthStateChanged listener.
      setCurrentUser(null);
      navigate('/');
      setView('login');
    } catch (err) {
      console.error("Error signing out: ", err);
      // In a real app, we might show a toast notification to the user here.
    }
  };

  const handleUpdateUser = async (updatedUser: Partial<User> & { uid: string }) => {
    const userDocRef = db.collection('users').doc(updatedUser.uid);
    try {
        await userDocRef.update(updatedUser);
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

  if (route === '/admin' && currentUser?.isOwner) {
    return <AdminPanel onNavigate={navigate} onUpdateUser={handleUpdateUser} currentUser={currentUser} />;
  }

  if (currentUser) {
    return <ChatRoom allUsers={users} currentUser={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} onNavigate={navigate} />;
  }

  if (view === 'signup') {
    return <SignUp onSignUp={handleSignUp} onSwitchToLogin={() => { setView('login'); setError(null); }} error={error} />;
  }

  return <Login onLogin={handleLogin} onSwitchToSignUp={() => { setView('signup'); setError(null); }} error={error} />;
};

export default App;
