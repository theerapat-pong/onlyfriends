import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { User, LogEntry } from './types';
import { createLogEntry } from './services/loggingService';

// Import Components
import Login from './components/Login';
import SignUp from './components/SignUp';
import Header from './components/Header';
import UserList from './components/UserList';
import ChatRoom from './components/ChatRoom';
import ChatInput from './components/ChatInput';
import LogPanel from './components/LogPanel';
import WelcomeNotification from './components/WelcomeNotification';
import WelcomeTestPanel from './components/WelcomeTestPanel'; // For testing welcome UI

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);

  // State for UI elements
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [welcomeInfo, setWelcomeInfo] = useState<{ name: string; rank: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = { ...userDoc.data(), id: userDoc.id } as User;
          setCurrentUser(userData);
          
          // Set user online status
          await updateDoc(userDocRef, { online: true });

          // Add a log entry for login
          addLog(`User ${userData.username} (${userData.id}) logged in.`, 'info');
          
          // Trigger welcome notification
          setWelcomeInfo({ name: userData.username, rank: userData.color || 'text-rank-user' });
          setTimeout(() => setWelcomeInfo(null), 5000); // Hide after 5 seconds
        } else {
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

  const handleLogout = async () => {
    if (currentUser) {
      // Set user offline status
      const userDocRef = doc(db, 'users', currentUser.id);
      await updateDoc(userDocRef, { online: false });
      addLog(`User ${currentUser.username} (${currentUser.id}) logged out.`, 'info');
    }
    await signOut(auth);
    setCurrentUser(null);
  };

  const addLog = (message: string, type: LogEntry['type']) => {
    const newLog = createLogEntry(message, type);
    setLogs(prevLogs => [...prevLogs, newLog]);
  };
  
  const handleTestWelcome = (rank: string) => {
    if(currentUser){
        setWelcomeInfo({ name: currentUser.name, rank: rank });
        setTimeout(() => setWelcomeInfo(null), 5000); // Hide after 5 seconds
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-camfrog-bg text-white">
        <div>Loading...</div>
      </div>
    );
  }

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="bg-camfrog-bg text-white min-h-screen flex flex-col">
      {!currentUser ? (
        <div className="flex items-center justify-center flex-grow">
          {isLoginView ? (
            <Login onSwitchToSignUp={toggleView} />
          ) : (
            <SignUp onSwitchToLogin={toggleView} />
          )}
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          <Header
            currentUser={currentUser}
            onLogout={handleLogout}
            isAuthorized={true} 
            onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          />
          {welcomeInfo && <WelcomeNotification name={welcomeInfo.name} rank={welcomeInfo.rank} />}
          <main className="flex flex-1 overflow-hidden">
            {/* User List Sidebar (Desktop) */}
            <aside className="w-64 bg-camfrog-panel flex-shrink-0 hidden md:flex flex-col">
              <UserList />
            </aside>
            
            {/* Main Chat Area */}
            <section className="flex-1 flex flex-col bg-camfrog-panel-light">
              <ChatRoom currentUser={currentUser} />
              <ChatInput currentUser={currentUser} />
            </section>
            
            {/* Right Sidebar (Logs & Testing) */}
            <aside className="w-80 bg-camfrog-panel flex-shrink-0 hidden lg:flex flex-col p-2">
              <LogPanel logs={logs} />
              {currentUser.isOwner && <WelcomeTestPanel onTestWelcome={handleTestWelcome} />}
            </aside>

            {/* User List Sidebar (Mobile) */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-30 md:hidden">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
                    <aside className="relative z-40 w-64 bg-camfrog-panel h-full flex flex-col">
                       <UserList />
                    </aside>
                </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;