import React, { useState } from 'react';
import { UserGroupIcon } from './Icons';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignUp: () => void;
  error: string | null;
}

const Login = ({ onLogin, onSwitchToSignUp, error }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-camfrog-bg relative">
      <div className="w-full max-w-sm p-8 space-y-6 bg-camfrog-panel rounded-lg shadow-2xl">
        <div className="flex flex-col items-center">
          <UserGroupIcon className="w-16 h-16 text-camfrog-accent mb-4" />
          <h1 className="text-3xl font-bold text-white">โอนลี่เฟรนด์</h1>
          <p className="text-camfrog-text-muted mt-2">ลงชื่อเข้าใช้เพื่อดำเนินการต่อ</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              aria-label="อีเมล"
            />
          </div>
          <div>
            <label htmlFor="password" aria-label="รหัสผ่าน" className="block text-sm font-medium text-camfrog-text-muted mb-2">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-camfrog-panel-light border border-camfrog-panel-light rounded-md py-2 px-3 text-camfrog-text focus:outline-none focus:ring-2 focus:ring-camfrog-accent"
              required
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-camfrog-accent hover:bg-blue-600 text-white font-semibold rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-camfrog-panel focus:ring-camfrog-accent transition-colors duration-200"
            disabled={!email || !password}
          >
            ลงชื่อเข้าใช้
          </button>
        </form>
        <p className="text-center text-sm text-camfrog-text-muted">
          ยังไม่มีบัญชีใช่ไหม?{' '}
          <button onClick={onSwitchToSignUp} className="font-semibold text-camfrog-accent hover:underline focus:outline-none">
            สมัครสมาชิก
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
