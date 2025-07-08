import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Message, User } from '../types';
import { getBotResponse } from '../services/geminiService';
import Header from './Header';
import UserList from './UserList';
import ChatPanel from './ChatPanel';
import ChatInput from './ChatInput';
import ProfileModal from './ProfileModal';
import WelcomeNotification from './WelcomeNotification';
import UserContextMenu from './UserContextMenu';

interface ChatRoomProps {
  allUsers: User[];
  currentUser: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

// --- Rank Configuration ---

const RANK_HIERARCHY = [
  'text-rainbow-animated', // Owner
  'text-rank-admin',       // Admin
  'text-rank-vip1',        // Pink
  'text-rank-vip2',        // Orange
  'text-rank-pro',         // Red
  'text-rank-user',        // Blue
  'text-gray-300',         // Gray (Newbie)
];

const RANK_PERMISSIONS: { [key: string]: string[] } = {
  'text-rainbow-animated': ['text-rank-admin', 'text-rank-vip1', 'text-rank-vip2', 'text-rank-pro', 'text-rank-user', 'text-gray-300'],
  'text-rank-admin': ['text-rank-vip2', 'text-rank-pro', 'text-rank-user', 'text-gray-300'],
};

const THAI_COLOR_TO_CLASS: { [key: string]: string } = {
  'สีม่วง': 'text-rank-admin',
  'สีชมพู': 'text-rank-vip1',
  'สีส้ม': 'text-rank-vip2',
  'สีแดง': 'text-rank-pro',
  'สีฟ้า': 'text-rank-user',
  'สีเทา': 'text-gray-300',
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

const ChatRoom = ({ allUsers, currentUser, onLogout, onUpdateUser }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const users = useMemo(() => getSortedUsers(allUsers), [allUsers]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [welcomeInfo, setWelcomeInfo] = useState<{ rank: string; name: string; key: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetUser: User } | null>(null);

  useEffect(() => {
    const initialSystemMessage: Message = {
        id: crypto.randomUUID(),
        author: 'System',
        avatar: '',
        text: `เข้าสู่ห้องแชทสำเร็จ! พิมพ์ /help เพื่อดูคำสั่งทั้งหมด`,
        type: 'system',
    };
    setMessages([initialSystemMessage]);

    // Set notification info to trigger the rank-based welcome effect
    setWelcomeInfo({
      rank: currentUser.color,
      name: currentUser.name,
      key: Date.now(),
    });

    const duration = currentUser.isOwner ? 5000 : 5000; 
    const timer = setTimeout(() => {
        setWelcomeInfo(null);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentUser.id, currentUser.name, currentUser.color, currentUser.isOwner]);


  const addSystemMessage = useCallback((text: string) => {
    const systemMessage: Message = {
      id: crypto.randomUUID(),
      author: 'System',
      avatar: '',
      text,
      type: 'system',
    };
    setMessages(prev => [...prev, systemMessage]);
  }, []);

  const handleRankChangeCommand = useCallback(async (thaiColor: string, targetUid: string) => {
    const targetColorClass = THAI_COLOR_TO_CLASS[thaiColor];
     if (!targetColorClass) {
        addSystemMessage(`ไม่รู้จักสี: ${thaiColor}`);
        return;
    }
    
    // Superadmin check: Owner can bypass permission checks.
    if (!currentUser.isOwner) {
        const allowedRanks = RANK_PERMISSIONS[currentUser.color];
        if (!allowedRanks || !allowedRanks.includes(targetColorClass)) {
        addSystemMessage("คุณไม่มีสิทธิ์ในการกำหนดสีนี้");
        return;
        }
    }

    const targetUser = allUsers.find(u => u.uid === targetUid);
    if (!targetUser) {
      addSystemMessage(`ไม่พบผู้ใช้ที่มี UID: ${targetUid}`);
      return;
    }
     if (targetUser.isOwner) {
      addSystemMessage("ไม่สามารถเปลี่ยน Rank ของ Owner ได้");
      return;
    }

    // Optimistic update
    onUpdateUser({ ...targetUser, color: targetColorClass });
    addSystemMessage(`${currentUser.name} ได้เปลี่ยน Rank ของ ${targetUser.name} เป็น ${thaiColor}`);

    setIsBotTyping(true);
    try {
      const botCommand = `/setrank ${thaiColor} ${targetUid}`;
      const botResponseText = await getBotResponse(botCommand);
      if(botResponseText) {
          const botMessage: Message = {
            id: crypto.randomUUID(),
            author: 'Gemini Bot',
            avatar: 'bot',
            text: botResponseText,
            type: 'bot',
            authorColor: users.find(u => u.name === 'Gemini Bot')?.color || 'text-rank-user',
          };
          setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      addSystemMessage("ขออภัย, บอทไม่สามารถยืนยันคำสั่งได้ในขณะนี้");
    } finally {
      setIsBotTyping(false);
    }
  }, [addSystemMessage, currentUser, allUsers, onUpdateUser, users]);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      author: currentUser.name,
      avatar: currentUser.avatar,
      text,
      type: 'user',
      authorColor: currentUser.color || 'text-white',
      isAuthorOwner: currentUser.isOwner,
      authorLevel: currentUser.level,
    };

    setMessages(prev => [...prev, userMessage]);

    const parts = text.trim().split(' ');
    if (parts.length === 2) {
      const [thaiColor, targetUid] = parts;
      if (THAI_COLOR_TO_CLASS[thaiColor]) {
        handleRankChangeCommand(thaiColor, targetUid);
        return;
      }
    }

    if (!text.startsWith('/')) {
        return;
    }
    
    const botUser = users.find(u => u.name === 'Gemini Bot');
    setIsBotTyping(true);
    try {
      const botResponseText = await getBotResponse(text);
      if(botResponseText) {
          const botMessage: Message = {
            id: crypto.randomUUID(),
            author: 'Gemini Bot',
            avatar: 'bot',
            text: botResponseText,
            type: 'bot',
            authorColor: botUser?.color || 'text-rank-user',
          };
          setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      addSystemMessage('ขออภัย, ไม่สามารถดำเนินการตามคำสั่งได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsBotTyping(false);
    }
  }, [users, currentUser, handleRankChangeCommand, addSystemMessage]);

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseProfile = () => {
    setSelectedUser(null);
  };
  
  const handleSaveProfile = (updatedUser: User) => {
    if (
      updatedUser.name !== selectedUser?.name &&
      allUsers.some(u => u.id !== updatedUser.id && u.name.toLowerCase() === updatedUser.name.toLowerCase())
    ) {
      alert('มีผู้ใช้ชื่อนี้แล้ว');
      return;
    }
    onUpdateUser(updatedUser);
    setSelectedUser(null);
  };

  const handleUserContextMenu = (event: React.MouseEvent, user: User) => {
    setContextMenu({ x: event.clientX, y: event.clientY, targetUser: user });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleSetRankFromMenu = useCallback(async (colorClass: string, thaiColor: string) => {
    if (!contextMenu) return;
    const { targetUser } = contextMenu;
    await handleRankChangeCommand(thaiColor, targetUser.uid);
    handleCloseContextMenu();
  }, [contextMenu, handleRankChangeCommand]);


  return (
    <div className="flex flex-col h-screen font-sans bg-camfrog-bg text-camfrog-text">
      <Header currentUser={currentUser} onLogout={onLogout} />
      <div className="flex flex-1 overflow-hidden">
        <main className="relative flex-1 flex flex-col overflow-hidden bg-camfrog-panel-light">
           <ChatPanel messages={messages} isBotTyping={isBotTyping} />
           {welcomeInfo && (
              <WelcomeNotification
                key={welcomeInfo.key}
                rank={welcomeInfo.rank}
                name={welcomeInfo.name}
              />
            )}
           <ChatInput onSendMessage={handleSendMessage} />
        </main>
        <aside className="w-64 bg-camfrog-panel flex flex-col p-2 flex-shrink-0">
          <UserList 
            users={users}
            currentUser={currentUser}
            onViewProfile={handleViewProfile}
            onUserContextMenu={handleUserContextMenu}
          />
        </aside>
      </div>
      {contextMenu && (
        <UserContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onSetRank={handleSetRankFromMenu}
        />
      )}
       {selectedUser && (
        <ProfileModal
          user={selectedUser}
          currentUser={currentUser}
          onClose={handleCloseProfile}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default ChatRoom;