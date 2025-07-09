import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase'; // Import auth และ db จากไฟล์ที่เราสร้าง
import { User } from './types'; // Import User type ของเรา

// Import components ต่างๆ ที่มีอยู่แล้ว
import ChatPanel from './components/ChatPanel';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Header from './components/Header';
import LogPanel from './components/LogPanel';
import UserList from './components/UserList';
import WelcomeNotification from './components/WelcomeNotification';
import WelcomeTestPanel from './components/WelcomeTestPanel';


function App() {
  // State สำหรับเก็บข้อมูลผู้ใช้ที่ล็อกอินอยู่
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // State สำหรับจัดการหน้า loading ขณะตรวจสอบสถานะล็อกอิน
  const [loading, setLoading] = useState(true);
  // State สำหรับสลับระหว่างหน้า Login และ SignUp
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    // onAuthStateChanged เป็น listener จาก Firebase ที่จะทำงานทุกครั้ง
    // ที่สถานะการล็อกอินของผู้ใช้มีการเปลี่ยนแปลง (เช่น ล็อกอิน, ล็อกเอาต์)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // ถ้ามีผู้ใช้ล็อกอินในระบบ (firebaseUser ไม่ใช่ null)
        // เราจะไปดึงข้อมูลโปรไฟล์เพิ่มเติมจาก Firestore collection 'users'
        // โดยใช้ uid ของผู้ใช้เป็น key
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // ถ้าเจอบันทึกข้อมูลผู้ใช้ใน Firestore
          // ให้ตั้งค่า state ของ currentUser ด้วยข้อมูลนั้น
          setCurrentUser({ id: userDoc.id, ...userDoc.data() } as User);
        } else {
          // กรณีที่ไม่เจอข้อมูลใน Firestore (อาจเกิดข้อผิดพลาดตอนสมัคร)
          // ให้ล็อกผู้ใช้ออกจากระบบไปก่อน
           setCurrentUser(null);
        }
      } else {
        // ถ้าไม่มีผู้ใช้ล็อกอินในระบบ
        setCurrentUser(null);
      }
      // เมื่อตรวจสอบเสร็จสิ้น ให้ปิดหน้า loading
      setLoading(false);
    });

    // Cleanup function: ยกเลิกการ subscribe listener เมื่อ component ถูก unmount
    // เพื่อป้องกัน memory leak
    return () => unsubscribe();
  }, []); // dependency array เป็น [] หมายความว่า useEffect นี้จะทำงานแค่ครั้งเดียวตอน component โหลด

  // แสดงหน้า loading ขณะที่กำลังตรวจสอบสถานะ
  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div>Loading...</div>
        </div>
    );
  }

  // ฟังก์ชันสำหรับสลับหน้า Login/SignUp
  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* ถ้ามี currentUser (ล็อกอินแล้ว) ให้แสดงหน้า ChatPanel */}
      {currentUser ? (
        // ส่งข้อมูล currentUser ไปให้ ChatPanel เพื่อใช้งานต่อ
        <ChatPanel currentUser={currentUser} />
      ) : (
        // ถ้ายังไม่ล็อกอิน ให้แสดงหน้า Login หรือ SignUp
        <div className="flex items-center justify-center flex-grow">
            {isLoginView ? (
                <Login onSwitchToSignUp={toggleView} />
            ) : (
                <SignUp onSwitchToLogin={toggleView} />
            )}
        </div>
      )}
    </div>
  );
}

export default App;
