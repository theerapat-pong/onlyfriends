import { useState } from 'react';
// เพิ่ม imports สำหรับ Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

interface LoginProps {
  onSwitchToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State สำหรับเก็บข้อความ error

  // แก้ไขฟังก์ชัน handleLogin ให้เชื่อมต่อกับ Firebase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // เคลียร์ error เก่าทุกครั้งที่พยายามล็อกอิน

    try {
      // 1. ล็อกอินด้วย Email และ Password ผ่าน Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);

      // เมื่อล็อกอินสำเร็จ onAuthStateChanged ใน App.tsx จะตรวจจับการเปลี่ยนแปลง
      // และอัปเดตหน้าจอให้เป็นหน้าแชทโดยอัตโนมัติ

    } catch (error: any) {
      // หากเกิดข้อผิดพลาด (เช่น รหัสผ่านผิด, ไม่มีอีเมลนี้ในระบบ)
      console.error("Error logging in:", error);
      // แปลง error code เป็นข้อความที่เข้าใจง่ายขึ้น
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-white">Login to your account</h2>
      <form onSubmit={handleLogin} className="space-y-6">
        {/* แสดงข้อความ Error ถ้ามี */}
        {error && <p className="text-red-500 text-sm text-center bg-red-900 bg-opacity-30 p-2 rounded-md">{error}</p>}
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
            autoComplete="current-password"
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            Log in
          </button>
        </div>
      </form>
      <p className="text-sm text-center text-gray-400">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignUp} className="font-medium text-indigo-400 hover:text-indigo-300">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
