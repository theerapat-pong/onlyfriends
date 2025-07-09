import { useState } from 'react';
// เพิ่ม imports สำหรับ Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface SignUpProps {
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // State สำหรับเก็บข้อความ error

  // แก้ไขฟังก์ชัน handleSignUp ให้เชื่อมต่อกับ Firebase
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // เคลียร์ error เก่าทุกครั้งที่พยายามสมัคร

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // 1. สร้างผู้ใช้ใน Firebase Authentication ด้วยอีเมลและรหัสผ่าน
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. สร้างเอกสารสำหรับผู้ใช้ใน Firestore collection 'users'
      // โดยใช้ user.uid ที่ได้จาก Authentication เป็น ID ของเอกสาร
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: user.email,
        level: 1,
        gang: null,
        online: true,
        createdAt: serverTimestamp() // ใช้ serverTimestamp เพื่อให้เวลาจากเซิร์ฟเวอร์ตรงกัน
      });
      
      // เมื่อสมัครสำเร็จ onAuthStateChanged ใน App.tsx จะตรวจจับการเปลี่ยนแปลง
      // และอัปเดตหน้าจอให้เป็นหน้าแชทโดยอัตโนมัติ เราจึงไม่ต้องทำอะไรต่อในหน้านี้
      
    } catch (error: any) {
      // หากเกิดข้อผิดพลาด (เช่น อีเมลนี้ถูกใช้แล้ว)
      console.error("Error signing up:", error);
      // แปลง error code เป็นข้อความที่เข้าใจง่ายขึ้น (ตัวอย่าง)
      let errorMessage = "Failed to create an account. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      setError(errorMessage); // แสดง error ให้ผู้ใช้เห็น
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-white">Create Account</h2>
      <form onSubmit={handleSignUp} className="space-y-6">
        {/* แสดงข้อความ Error ถ้ามี */}
        {error && <p className="text-red-500 text-sm text-center bg-red-900 bg-opacity-30 p-2 rounded-md">{error}</p>}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" aria-required="true" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            aria-required="true"
            className="block text-sm font-medium text-gray-300"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </div>
      </form>
      <p className="text-sm text-center text-gray-400">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-indigo-400 hover:text-indigo-300">
          Log in
        </button>
      </p>
    </div>
  );
};

export default SignUp;
