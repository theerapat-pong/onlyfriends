import { useState } from 'react';
// เพิ่ม imports สำหรับ Firebase
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { User } from '../types';
import { SendIcon } from './Icons'; // แก้ไข: เปลี่ยนจาก PaperPlaneIcon เป็น SendIcon

interface ChatInputProps {
  currentUser: User; // รับข้อมูลผู้ใช้ที่ล็อกอินอยู่
}

const ChatInput: React.FC<ChatInputProps> = ({ currentUser }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อ submit form
    const trimmedMessage = message.trim();
    if (trimmedMessage === '') return; // ไม่ส่งข้อความว่าง

    try {
      // เพิ่ม document ใหม่เข้าไปใน collection 'messages'
      await addDoc(collection(db, 'messages'), {
        text: trimmedMessage,
        sender: { // เก็บข้อมูลผู้ส่งบางส่วน เพื่อไม่ต้อง join ตอนแสดงผล
          id: currentUser.id,
          username: currentUser.username,
          level: currentUser.level,
          gang: currentUser.gang
        },
        timestamp: serverTimestamp() // ใช้เวลาจากเซิร์ฟเวอร์
      });
      setMessage(''); // เคลียร์ช่อง input หลังส่งสำเร็จ
    } catch (error) {
      console.error("Error sending message: ", error);
      // อาจจะแสดงข้อความ error ให้ผู้ใช้เห็น
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-900 disabled:cursor-not-allowed"
          disabled={message.trim() === ''}
        >
          {/* แก้ไข: เปลี่ยนจาก PaperPlaneIcon เป็น SendIcon */}
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;