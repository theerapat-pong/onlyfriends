import { useEffect, useState } from 'react';
// เพิ่ม imports สำหรับ Firebase
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { User } from '../types';

// Import components ที่เกี่ยวข้อง
import LevelBadge from './LevelBadge';
import GangBadge from './GangBadge';

// อาจจะต้องมี props เพิ่มเติมในอนาคต เช่น ฟังก์ชันเมื่อเลือก user
interface UserListProps {}

const UserList: React.FC<UserListProps> = () => {
  // State สำหรับเก็บรายชื่อผู้ใช้ทั้งหมด
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // สร้าง query เพื่อดึงข้อมูลจาก collection 'users'
    // และจัดเรียงตามสถานะออนไลน์ (online) ก่อน แล้วตามด้วยชื่อผู้ใช้ (username)
    const q = query(collection(db, 'users'), orderBy('online', 'desc'), orderBy('username'));

    // onSnapshot จะสร้าง listener ที่คอยฟังการเปลี่ยนแปลงใน collection 'users' แบบเรียลไทม์
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        // นำข้อมูลจากแต่ละ document มาสร้างเป็น object แล้ว push เข้า array
        usersData.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(usersData); // อัปเดต state ด้วยข้อมูลใหม่
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
      setLoading(false);
    });

    // Cleanup: ยกเลิก listener เมื่อ component ถูก unmount
    return () => unsubscribe();
  }, []); // ทำงานแค่ครั้งเดียวตอน component โหลด

  if (loading) {
    return <div className="p-4 text-gray-400">Loading users...</div>;
  }

  return (
    <div className="bg-gray-800 h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold text-white mb-4">Users</h2>
      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <div className="relative">
              {/* จุดแสดงสถานะออนไลน์ */}
              <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-gray-800 ${
                user.online ? 'bg-green-500' : 'bg-gray-500'
              }`}></span>
              {/* รูปโปรไฟล์ (Placeholder) */}
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="ml-3">
              <p className="font-semibold text-white">{user.username}</p>
              <div className="flex items-center space-x-2 mt-1">
                <LevelBadge level={user.level} />
                {user.gang && <GangBadge gang={user.gang} />}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
