import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Message, User, MessageStyle, LogEntry, LogType } from '../types';
import { getBotResponse } from '../services/geminiService';
import { createLogEntry } from '../services/loggingService';
import Header from './Header';
import UserList from './UserList';
import ChatPanel from './ChatPanel';
import ChatInput from './ChatInput';
import ProfileModal from './ProfileModal';
import UserContextMenu from './UserContextMenu';
import WelcomeNotification from './WelcomeNotification';
import LogPanel from './LogPanel';
import { UserGroupIcon, ListBulletIcon, XMarkIcon } from './Icons';
import { db, rtdb, firebase } from '../services/firebase';


const BOT_USER: User = { uid: 'GMNB0T', publicId: 'BOT-001', name: 'Gemini Bot', email: 'bot@example.com', avatar: 'bot', color: 'text-rank-user', bio: 'I am a helpful assistant bot.', level: 0 };

const RANK_HIERARCHY = [
  'text-rainbow-animated', // Owner
  'text-rank-admin',       // Admin
  'text-rank-vip1',        // Pink
  'text-rank-vip2',        // Orange
  'text-rank-pro',         // Red
  'text-rank-user',        // Blue
  'text-gray-300',         // Gray (Newbie)
];

const THAI_COLOR_TO_CLASS: { [key: string]: string } = {
  'สีม่วง': 'text-rank-admin',
  'สีชมพู': 'text-rank-vip1',
  'สีส้ม': 'text-rank-vip2',
  'สีแดง': 'text-rank-pro',
  'สีฟ้า': 'text-rank-user',
  'สีเทา': 'text-gray-300',
};

const RANK_PERMISSIONS: { [key: string]: string[] } = {
  'text-rainbow-animated': ['text-rank-admin', 'text-rank-vip1', 'text-rank-vip2', 'text-rank-pro', 'text-rank-user', 'text-gray-300'],
  'text-rank-admin': ['text-rank-vip1', 'text-rank-vip2', 'text-rank-pro', 'text-rank-user', 'text-gray-300'],
};


const getSortedUsers = (users: User[]): User[] => {
  return [...users].sort((a, b) => {
    const isABot = a.name === 'Gemini Bot';
    const isBBot = b.name === 'Gemini Bot';

    if (isABot && !isBBot) return 1;
    if (!isABot && isBBot) return -1;
    if (isABot && isBBot) return 0;
    
    const rankA = RANK_HIERARCHY.indexOf(a.color);
    const rankB = RANK_HIERARCHY.indexOf(b.color);

    if (rankA !== rankB) {
      return rankA - rankB;
    }
    
    return a.name.localeCompare(b.name);
  });
};

interface ChatRoomProps {
  allUsers: User[];
  currentUser: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: Partial<User> & { uid: string }) => void;
  onNavigate: (path: string) => void;
}

const ChatRoom = ({ allUsers, currentUser, onLogout, onUpdateUser, onNavigate }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [welcomeInfo, setWelcomeInfo] = useState<{ rank: string; name: string; key: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetUser: User } | null>(null);
  const [kickedUserUids, setKickedUserUids] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [onlineUserUids, setOnlineUserUids] = useState<string[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  const [joinTimestamp] = useState(() => new Date());

  const canViewLogs = useMemo(() => currentUser.isOwner || currentUser.color === 'text-rank-admin', [currentUser]);

  const users = useMemo(() => {
    const onlineUidSet = new Set(onlineUserUids);
    // The current user might not appear in the RTDB list immediately upon login, so we add them manually to ensure they see themselves.
    onlineUidSet.add(currentUser.uid);

    const onlineUsers = allUsers.filter(u => 
        onlineUidSet.has(u.uid) &&
        !u.isBanned &&
        !kickedUserUids.includes(u.uid)
    );

    const combinedUsers = [BOT_USER, ...onlineUsers];
    return getSortedUsers(combinedUsers);
  }, [allUsers, onlineUserUids, kickedUserUids, currentUser.uid]);

  const currentRoomId = 'onlyfriends-main';
  const vipAuthorizedRooms = ['onlyfriends-main'];
  const isVipAuthorizedInCurrentRoom = vipAuthorizedRooms.includes(currentRoomId);

  const addLog = useCallback((message: string, type: LogType) => {
    const newLog = createLogEntry(message, type);
    setLogs(prev => [newLog, ...prev].slice(0, 200));
  }, []);

  const addSystemMessage = useCallback(async (text: string) => {
    const systemMessage: Omit<Message, 'id'> = {
      author: 'System',
      authorUid: 'system',
      avatar: '',
      text,
      type: 'system',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    try {
        await db.collection('messages').add(systemMessage);
    } catch (error) {
        console.error("Error adding system message:", error);
    }
  }, []);

  useEffect(() => {
    const statusRef = rtdb.ref('status');
    const callback = (snapshot: firebase.database.DataSnapshot) => {
        const statuses = snapshot.val() || {};
        const onlineUids = Object.keys(statuses).filter(uid => statuses[uid].state === 'online');
        setOnlineUserUids(onlineUids);
    };
    statusRef.on('value', callback);
    return () => statusRef.off('value', callback);
  }, []);

  useEffect(() => {
    if (!canViewLogs && activeTab === 'logs') {
      setActiveTab('users');
    }
  }, [canViewLogs, activeTab]);
  
  useEffect(() => {
    const messagesCollectionRef = db.collection('messages');
    const q = messagesCollectionRef
        .orderBy('createdAt', 'asc')
        .where('createdAt', '>=', joinTimestamp);

    const unsubscribe = q.onSnapshot((snapshot) => {
        const messageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        setMessages(messageList);
    },
    (error) => {
        console.error("Error fetching messages:", error);
        addSystemMessage("เกิดข้อผิดพลาดในการโหลดข้อความ");
    });

    return () => unsubscribe();
  }, [joinTimestamp, addSystemMessage]);

  useEffect(() => {
    setWelcomeInfo({
      rank: currentUser.color,
      name: currentUser.name,
      key: Date.now(),
    });

    addLog(`[Join] ${currentUser.uid} has entered the room.`, 'info');

    const duration = currentUser.isOwner ? 5000 : 5000; 
    const timer = setTimeout(() => {
        setWelcomeInfo(null);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentUser.uid, currentUser.name, currentUser.color, currentUser.isOwner, addLog]);


  const addBotMessage = useCallback(async (text: string) => {
      const botMessage: Omit<Message, 'id'> = {
        author: 'Gemini Bot',
        authorUid: 'GMNB0T',
        avatar: 'bot',
        text: text,
        type: 'bot',
        authorColor: BOT_USER.color,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection('messages').add(botMessage);
  }, []);

  const handleRankChangeCommand = useCallback(async (thaiColor: string, targetUid: string) => {
    const targetColorClass = THAI_COLOR_TO_CLASS[thaiColor];
     if (!targetColorClass) {
        await addSystemMessage(`ไม่รู้จักสี: ${thaiColor}`);
        return;
    }
    
    if (!currentUser.isOwner) {
        const allowedRanks = RANK_PERMISSIONS[currentUser.color];
        if (!allowedRanks || !allowedRanks.includes(targetColorClass)) {
            await addSystemMessage("คุณไม่มีสิทธิ์ในการกำหนดสีนี้");
            return;
        }
    }

    const targetUser = allUsers.find(u => u.uid === targetUid);
    if (!targetUser) {
      await addSystemMessage(`ไม่พบผู้ใช้ที่มี UID: ${targetUid}`);
      return;
    }
     if (targetUser.isOwner) {
      await addSystemMessage("ไม่สามารถเปลี่ยน Rank ของ Owner ได้");
      return;
    }

    onUpdateUser({ uid: targetUser.uid, color: targetColorClass });
    const systemMsg = `${currentUser.name} ได้เปลี่ยน Rank ของ ${targetUser.name} เป็น ${thaiColor}`;
    await addSystemMessage(systemMsg);
    addLog(`[Rank Set] Action by ${currentUser.uid}. Target: ${targetUser.uid}. Rank: ${thaiColor}.`, 'moderation');

    setIsBotTyping(true);
    try {
      const botCommand = `/setrank ${thaiColor} ${targetUid}`;
      const botResponseText = await getBotResponse(botCommand);
      if(botResponseText) {
          await addBotMessage(botResponseText);
          addLog(`[Bot Success] Confirmed rank change for ${targetUid}.`, 'system');
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      await addSystemMessage("ขออภัย, บอทไม่สามารถยืนยันคำสั่งได้ในขณะนี้");
      addLog(`[Bot Error] Failed rank change confirmation for ${targetUid}.`, 'error');
    } finally {
      setIsBotTyping(false);
    }
  }, [addSystemMessage, currentUser, allUsers, onUpdateUser, addLog, addBotMessage]);

  const handleSendMessage = useCallback(async (text: string, styles: MessageStyle) => {
    if (currentUser.isMuted) {
      await addSystemMessage("คุณถูกจำกัดการพิมพ์และไม่สามารถส่งข้อความได้");
      return;
    }
    
    const userMessage: Omit<Message, 'id'> = {
      author: currentUser.name,
      authorUid: currentUser.uid,
      avatar: currentUser.avatar,
      text,
      type: 'user',
      authorColor: currentUser.color || 'text-white',
      isAuthorOwner: currentUser.isOwner,
      authorLevel: currentUser.level,
      styles,
      showVipBadge: isVipAuthorizedInCurrentRoom,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('messages').add(userMessage);
    addLog(`[Message] ${currentUser.uid}: ${text}`, 'action');

    const parts = text.trim().split(' ');
    if (parts.length === 2 && THAI_COLOR_TO_CLASS[parts[0]]) {
        const [thaiColor, targetUid] = parts;
        handleRankChangeCommand(thaiColor, targetUid);
        return;
    }

    if (!text.startsWith('/')) {
        return;
    }
    
    addLog(`[Command Used] User: ${currentUser.uid}, Command: ${text}`, 'info');
    setIsBotTyping(true);
    try {
      const botResponseText = await getBotResponse(text);
      if(botResponseText) {
          await addBotMessage(botResponseText);
          addLog(`[Bot Success] User: ${currentUser.uid}, Command: ${text}`, 'system');
      } else {
        addLog(`[Bot Ignored] Bot ignored non-command message.`, 'system');
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      await addSystemMessage('ขออภัย, ไม่สามารถดำเนินการตามคำสั่งได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
      addLog(`[Bot Error] User: ${currentUser.uid}, Failed on command: ${text}`, 'error');
    } finally {
      setIsBotTyping(false);
    }
  }, [currentUser, handleRankChangeCommand, addSystemMessage, isVipAuthorizedInCurrentRoom, addLog, addBotMessage]);

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setIsSidebarOpen(false);
  };

  const handleCloseProfile = () => {
    setSelectedUser(null);
  };
  
  const handleSaveProfile = (updatedUser: User) => {
    if (
      updatedUser.name !== selectedUser?.name &&
      allUsers.some(u => u.uid !== updatedUser.uid && u.name.toLowerCase() === updatedUser.name.toLowerCase())
    ) {
      alert('มีผู้ใช้ชื่อนี้แล้ว');
      return;
    }
    onUpdateUser(updatedUser);
    setSelectedUser(null);
    addLog(`[Profile Update] ${updatedUser.uid} updated their profile.`, 'info');
  };

  const handleUserContextMenu = (event: React.MouseEvent, user: User) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, targetUser: user });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleSetRankFromMenu = useCallback(async (colorClass: string, thaiColor: string) => {
    if (!contextMenu) return;
    const { targetUser } = contextMenu;
    handleRankChangeCommand(thaiColor, targetUser.uid);
    handleCloseContextMenu();
  }, [contextMenu, handleRankChangeCommand]);

  const handleKickUser = useCallback(async () => {
    if (!contextMenu) return;
    const { targetUser } = contextMenu;
    setKickedUserUids(prev => [...prev, targetUser.uid]);
    const message = `${targetUser.name} ถูกเตะออกจากห้องโดย ${currentUser.name}`;
    await addSystemMessage(message);
    addLog(`[Kick] Target: ${targetUser.uid}, By: ${currentUser.uid}`, 'moderation');
    handleCloseContextMenu();
  }, [contextMenu, addSystemMessage, currentUser.name, currentUser.uid, addLog]);

  const handleMuteUser = useCallback(async () => {
    if (!contextMenu) return;
    const { targetUser } = contextMenu;
    const isMuted = !targetUser.isMuted;
    onUpdateUser({ uid: targetUser.uid, isMuted });
    const actionText = isMuted ? 'บล็อคข้อความ' : 'ปลดบล็อคข้อความ';
    const message = `${targetUser.name} ถูก${actionText}โดย ${currentUser.name}`;
    await addSystemMessage(message);
    addLog(`[Mute Toggled] Target: ${targetUser.uid}, By: ${currentUser.uid}, Muted: ${isMuted}`, 'moderation');
    handleCloseContextMenu();
  }, [contextMenu, onUpdateUser, addSystemMessage, currentUser.name, currentUser.uid, addLog]);

  const handleBanUser = useCallback(async () => {
    if (!contextMenu) return;
    const { targetUser } = contextMenu;
    onUpdateUser({ uid: targetUser.uid, isBanned: true });
    const message = `${targetUser.name} ถูกแบนโดย ${currentUser.name}`;
    await addSystemMessage(message);
    addLog(`[Ban] Target: ${targetUser.uid}, By: ${currentUser.uid}`, 'moderation');
    handleCloseContextMenu();
  }, [contextMenu, onUpdateUser, addSystemMessage, currentUser.name, currentUser.uid, addLog]);

  const handleUnrankUser = useCallback(async () => {
    if (!contextMenu) return;
    const { targetUser } = contextMenu;
    onUpdateUser({ uid: targetUser.uid, color: 'text-gray-300' });
    const message = `${targetUser.name} ถูกปลด Rank โดย ${currentUser.name}`;
    await addSystemMessage(message);
    addLog(`[Unrank] Target: ${targetUser.uid}, By: ${currentUser.uid}`, 'moderation');
    handleCloseContextMenu();
  }, [contextMenu, onUpdateUser, addSystemMessage, currentUser.name, currentUser.uid, addLog]);

  return (
    <div className="flex flex-col h-screen font-sans bg-camfrog-bg text-camfrog-text">
      <Header 
        currentUser={currentUser} 
        onLogout={onLogout} 
        isAuthorized={isVipAuthorizedInCurrentRoom}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={onNavigate}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <main className="relative flex-1 flex flex-col overflow-hidden bg-camfrog-panel-light">
           <ChatPanel messages={messages} isBotTyping={isBotTyping} />
           <ChatInput currentUser={currentUser} onSendMessage={handleSendMessage} />
           {welcomeInfo && (
              <WelcomeNotification
                key={welcomeInfo.key}
                rank={welcomeInfo.rank}
                name={welcomeInfo.name}
              />
           )}
        </main>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        <aside className={`fixed inset-y-0 right-0 z-40 w-full max-w-xs bg-camfrog-panel flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 md:z-auto md:w-72 md:max-w-none`}>
          <div className="p-2 border-b border-camfrog-panel-light flex items-center justify-between md:hidden">
            <h2 className="text-lg font-semibold text-white">ผู้ใช้ & ล็อก</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-full text-camfrog-text-muted hover:bg-camfrog-panel-light">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-2">
            <div className="flex-shrink-0 mb-2 flex space-x-1 bg-camfrog-bg p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-md flex items-center justify-center transition-colors ${activeTab === 'users' ? 'bg-camfrog-accent text-white' : 'text-camfrog-text-muted hover:bg-camfrog-panel-light'}`}
                >
                    <UserGroupIcon className="w-5 h-5 mr-2" />
                    ผู้ใช้ ({users.length})
                </button>
                {canViewLogs && (
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-md flex items-center justify-center transition-colors ${activeTab === 'logs' ? 'bg-camfrog-accent text-white' : 'text-camfrog-text-muted hover:bg-camfrog-panel-light'}`}
                >
                    <ListBulletIcon className="w-5 h-5 mr-2" />
                    ล็อก
                </button>
                )}
            </div>
          </div>
          <div className="flex-1 min-h-0 px-2 pb-2">
            {activeTab === 'logs' && canViewLogs ? (
              <LogPanel logs={logs} />
            ) : (
              <UserList 
                users={users}
                currentUser={currentUser}
                onViewProfile={handleViewProfile}
                onUserContextMenu={handleUserContextMenu}
                isAuthorized={isVipAuthorizedInCurrentRoom}
              />
            )}
          </div>
        </aside>
      </div>
      {contextMenu && (
        <UserContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          currentUser={currentUser}
          targetUser={contextMenu.targetUser}
          onClose={handleCloseContextMenu}
          onSetRank={handleSetRankFromMenu}
          onKick={handleKickUser}
          onMute={handleMuteUser}
          onBan={handleBanUser}
          onUnrank={handleUnrankUser}
        />
      )}
       {selectedUser && (
        <ProfileModal
          user={selectedUser}
          currentUser={currentUser}
          onClose={handleCloseProfile}
          onSave={handleSaveProfile}
          isAuthorized={isVipAuthorizedInCurrentRoom}
        />
      )}
    </div>
  );
};

export default ChatRoom;