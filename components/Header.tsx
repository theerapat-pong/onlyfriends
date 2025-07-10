import React from 'react';
import { User } from '../types';
import { UserGroupIcon, ShieldCheckIcon } from './Icons';
import LevelBadge from './LevelBadge';
import GangBadge from './GangBadge';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  isAuthorized: boolean;
  onToggleSidebar: () => void;
  onNavigate: (path: string) => void;
}

const Header = ({ currentUser, onLogout, isAuthorized, onToggleSidebar, onNavigate }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between h-12 px-2 sm:px-4 bg-camfrog-panel-light shadow-md z-10 flex-shrink-0">
      <div className="flex items-center">
        <UserGroupIcon className="w-8 h-8 text-camfrog-accent mr-2 sm:mr-3" />
        <h1 className="text-xl font-bold text-white">
          โอนลี่เฟรนด์
        </h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className="text-sm text-camfrog-text hidden md:inline-flex items-center">
          <span>เข้าสู่ระบบในชื่อ:</span>
          <span className={`${currentUser.color} font-bold ml-1`}>{currentUser.name}</span>
          <GangBadge rankColor={currentUser.color} isAuthorized={isAuthorized} />
          <LevelBadge level={currentUser.level} />
        </span>
        {currentUser.isOwner && (
            <button
              onClick={() => onNavigate('/admin')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm hidden sm:flex items-center"
              title="Admin Panel"
            >
              <ShieldCheckIcon className="w-4 h-4 mr-1.5"/>
              แผงควบคุม
            </button>
        )}
        <button
          onClick={onLogout}
          className="bg-camfrog-accent hover:bg-red-500 text-white font-bold py-1 px-3 rounded text-sm"
        >
          ออกจากระบบ
        </button>
        <button
            onClick={onToggleSidebar}
            className="p-2 text-camfrog-text hover:text-white md:hidden"
            aria-label="แสดงรายชื่อผู้ใช้"
          >
            <UserGroupIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
