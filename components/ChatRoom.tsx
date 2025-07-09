import { useEffect, useState, useRef } from 'react';
// เพิ่ม imports สำหรับ Firebase
import { collection, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Message, User } from '../types';

// Import components ที่เกี่ยวข้อง
import LevelBadge from './LevelBadge';

interface ChatRoomProps {
  currentUser: User; // รับข้อมูลผู้ใช้ที่ล็อกอินอยู่
}

const ChatRoom: React.FC<ChatRoomProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  // Ref สำหรับ auto-scroll ไปที่ข้อความล่าสุด
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // ทำงานทุกครั้งที่ messages มีการเปลี่ยนแปลง

  useEffect(() => {
    // สร้าง query เพื่อดึงข้อมูลจาก collection 'messages'
    // โดยเรียงตามเวลาที่ส่ง (timestamp) จากเก่าไปใหม่
    // หมายเหตุ: สำหรับแอปจริง ควรสร้างห้องแชทแยกสำหรับแต่ละคู่สนทนา
    // แต่ในตัวอย่างนี้จะใช้ collection กลางชื่อ 'messages' เพื่อความง่าย
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(messagesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ฟังก์ชันสำหรับแปลง Firebase Timestamp เป็นเวลาที่อ่านง่าย
  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-grow flex flex-col p-4 bg-gray-700 overflow-hidden">
      {loading && <div className="text-center text-gray-400">Loading messages...</div>}
      {!loading && messages.length === 0 && (
        <div className="text-center text-gray-400 flex-grow flex items-center justify-center">
          Start the conversation!
        </div>
      )}
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {messages.map((msg) => {
          const isSender = msg.sender.id === currentUser.id;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
              {!isSender && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center font-bold">
                  {msg.sender.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${
                    isSender ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'
                  }`}
                >
                  {!isSender && (
                     <div className="font-bold text-indigo-400 text-sm mb-1 flex items-center gap-2">
                        {msg.sender.username} <LevelBadge level={msg.sender.level} />
                     </div>
                  )}
                  <p className="text-base">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatRoom;
