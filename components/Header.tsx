import React from 'react';
import { User } from '../types';
import { UserGroupIcon } from './Icons';
import LevelBadge from './LevelBadge';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const Header = ({ currentUser, onLogout }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between h-12 px-4 bg-camfrog-panel-light shadow-md z-10 flex-shrink-0">
      <div className="flex items-center">
        <UserGroupIcon className="w-8 h-8 text-camfrog-accent mr-3" />
        <h1 className="text-xl font-bold text-white">
          โอนลี่เฟรนด์
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-camfrog-text hidden sm:inline-flex items-center">
          <span>เข้าสู่ระบบในชื่อ:</span>
          <span className={`${currentUser.color} font-bold ml-1`}>{currentUser.name}</span>
          <LevelBadge level={currentUser.level} />
        </span>
        <button
          onClick={onLogout}
          className="bg-camfrog-accent hover:bg-red-500 text-white font-bold py-1 px-3 rounded text-sm"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
};

export default Header;