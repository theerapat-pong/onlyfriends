import React, { useEffect, useRef } from 'react';
import { User } from '../types';

const RANK_OPTIONS: { [key: string]: string } = {
  'สีม่วง': 'text-rank-admin',
  'สีชมพู': 'text-rank-vip1',
  'สีส้ม': 'text-rank-vip2',
  'สีแดง': 'text-rank-pro',
  'สีฟ้า': 'text-rank-user',
  'สีเทา': 'text-gray-300',
};

const RANK_COLOR_MAP: { [key: string]: string } = {
    'text-rank-admin': 'bg-rank-admin',
    'text-rank-vip1': 'bg-rank-vip1',
    'text-rank-vip2': 'bg-rank-vip2',
    'text-rank-pro': 'bg-rank-pro',
    'text-rank-user': 'bg-rank-user',
    'text-gray-300': 'bg-gray-300',
};

const RANK_HIERARCHY = [
  'text-rainbow-animated', // Owner
  'text-rank-admin',       // Admin
  'text-rank-vip1',        // VIP1
  'text-rank-vip2',        // VIP2
  'text-rank-pro',         // Pro
  'text-rank-user',        // User
  'text-gray-300',         // Newbie
];

const RANK_PERMISSIONS: { [key: string]: string[] } = {
  'text-rainbow-animated': ['text-rank-admin', 'text-rank-vip1', 'text-rank-vip2', 'text-rank-pro', 'text-rank-user', 'text-gray-300'],
  'text-rank-admin': ['text-rank-vip1', 'text-rank-vip2', 'text-rank-pro', 'text-rank-user', 'text-gray-300'],
};

interface UserContextMenuProps {
  x: number;
  y: number;
  currentUser: User;
  targetUser: User;
  onClose: () => void;
  onSetRank: (colorClass: string, thaiColor: string) => void;
  onKick: () => void;
  onMute: () => void;
  onBan: () => void;
  onUnrank: () => void;
}

const UserContextMenu = ({ x, y, currentUser, targetUser, onClose, onSetRank, onKick, onMute, onBan, onUnrank }: UserContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // --- Permission Checks ---
  const currentUserRankIndex = RANK_HIERARCHY.indexOf(currentUser.color);
  const targetUserRankIndex = RANK_HIERARCHY.indexOf(targetUser.color);

  const isSelf = currentUser.id === targetUser.id;
  const isBot = targetUser.name === 'Gemini Bot';
  const isTargetOwner = !!targetUser.isOwner;

  // Owner can moderate anyone except self. Admin can moderate users with lower rank.
  const canModerateGenerally = !isSelf && !isBot && !isTargetOwner &&
      (currentUser.isOwner || (currentUser.color === 'text-rank-admin' && currentUserRankIndex < targetUserRankIndex));

  // Owner can unrank anyone. Admin can unrank Pro and below.
  const canUnrank = canModerateGenerally && (currentUser.isOwner || 
    (currentUser.color === 'text-rank-admin' && targetUserRankIndex >= RANK_HIERARCHY.indexOf('text-rank-pro')));
  
  const allowedToSetRanks = RANK_PERMISSIONS[currentUser.color] || [];

  const handleRankClick = (colorClass: string, thaiColor: string) => {
    onSetRank(colorClass, thaiColor);
    onClose();
  };

  if (isSelf || isBot) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-camfrog-panel rounded-md shadow-lg py-2 w-48 animate-fade-in-down"
      style={{ top: y, left: x }}
      role="menu"
    >
      {!isTargetOwner && (
        <>
            <p className="px-3 py-1 text-xs font-bold text-camfrog-text-muted">กำหนด Rank</p>
            <ul className="space-y-1">
                {Object.entries(RANK_OPTIONS).map(([thaiColor, colorClass]) => {
                if (!allowedToSetRanks.includes(colorClass)) return null;
                
                return (
                    <li key={colorClass}>
                        <button
                        onClick={() => handleRankClick(colorClass, thaiColor)}
                        className="w-full text-left px-3 py-2 text-sm text-camfrog-text hover:bg-camfrog-accent hover:text-white rounded-md flex items-center transition-colors"
                        role="menuitem"
                        >
                        <span className={`w-3 h-3 rounded-full mr-3 ${RANK_COLOR_MAP[colorClass] || 'bg-gray-500'}`}></span>
                        {thaiColor}
                        </button>
                    </li>
                );
                })}
            </ul>
        </>
      )}

      {canModerateGenerally && (
        <>
            <div className="border-t border-camfrog-panel-light my-1 mx-2"></div>
            <p className="px-3 py-1 text-xs font-bold text-camfrog-text-muted">การจัดการ</p>
            <ul className="space-y-1">
                <li><button onClick={onKick} className="w-full text-left px-3 py-2 text-sm text-camfrog-text hover:bg-camfrog-accent hover:text-white rounded-md transition-colors">เตะออกจากห้อง</button></li>
                <li><button onClick={onMute} className="w-full text-left px-3 py-2 text-sm text-camfrog-text hover:bg-camfrog-accent hover:text-white rounded-md transition-colors">{targetUser.isMuted ? 'ปลดบล็อคข้อความ' : 'บล็อคข้อความ'}</button></li>
                {canUnrank && <li><button onClick={onUnrank} className="w-full text-left px-3 py-2 text-sm text-camfrog-text hover:bg-camfrog-accent hover:text-white rounded-md transition-colors">ปลด Rank</button></li>}
                <li><button onClick={onBan} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-colors font-semibold">แบน</button></li>
            </ul>
        </>
      )}
    </div>
  );
};

export default UserContextMenu;