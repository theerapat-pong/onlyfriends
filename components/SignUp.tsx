import React, { useState } from 'react';
import { UserGroupIcon } from './Icons';

interface SignUpProps {
  onSignUp: (username: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
  error: string | null;
}

const SignUp = ({ onSignUp, onSwitchToLogin, error }: SignUpProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && email.trim() && password.trim()) {
      onSignUp(username.trim(), email.trim(), password.trim());
    }
  };
  
  const isFormValid = username.trim().length >= 3 && email.trim() && password.trim().length >= 6;

  return (
    <div className="flex items-center justify-center h-screen bg-camfrog-bg relative">
      <div className="w-full max-w-sm p-8 space-y-6 bg-camfrog-panel rounded-lg shadow-2xl">
        <div className="flex flex-col items-center">
          <UserGroupIcon className="w-16 h-16 text-camfrog-accent mb-4" />
          <h1 className="text-3xl font-bold text-white">สร้างบัญชีผู้ใช้</h1>
          <p className="text-camfrog-text-muted mt-2">เข้าร่วมห้องแชทโอนลี่เฟรนด์</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-camfrog-text-muted mb-2">
              ชื่อผู้ใช้
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='ต้องมีอย่างน้อย 3 ตัวอักษร'
              className="w-full bg-camfrog-panel-light border border-camfrog-panel-light rounded-md py-2 px-3 text-camfrog-text focus:outline-none focus:ring-2 focus:ring-camfrog-accent"
              required
              minLength={3}
              aria-label='ชื่อผู้ใช้'
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-camfrog-text-muted mb-2">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-camfrog-panel-light border border-camfrog-panel-light rounded-md py-2 px-3 text-camfrog-text focus:outline-none focus:ring-2 focus:ring-camfrog-accent"
              required
              aria-label='อีเมล'
            />
          </div>
          <div>
            <label htmlFor="password" aria-label='รหัสผ่าน' className="block text-sm font-medium text-camfrog-text-muted mb-2">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='ต้องมีอย่างน้อย 6 ตัวอักษร'
              className="w-full bg-camfrog-panel-light border border-camfrog-panel-light rounded-md py-2 px-3 text-camfrog-text focus:outline-none focus:ring-2 focus:ring-camfrog-accent"
              required
              minLength={6}
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-camfrog-accent hover:bg-blue-600 text-white font-semibold rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-camfrog-panel focus:ring-camfrog-accent transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={!isFormValid}
          >
            สมัครสมาชิก
          </button>
        </form>
        <p className="text-center text-sm text-camfrog-text-muted">
          มีบัญชีอยู่แล้วใช่ไหม?{' '}
          <button onClick={onSwitchToLogin} className="font-semibold text-camfrog-accent hover:underline focus:outline-none">
            ลงชื่อเข้าใช้
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
