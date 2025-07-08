import React, { useEffect, useRef } from 'react';

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


interface UserContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onSetRank: (colorClass: string, thaiColor: string) => void;
}

const UserContextMenu = ({ x, y, onClose, onSetRank }: UserContextMenuProps) => {
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

  const handleRankClick = (colorClass: string, thaiColor: string) => {
    onSetRank(colorClass, thaiColor);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-camfrog-panel rounded-md shadow-lg py-2 w-48 animate-fade-in-down"
      style={{ top: y, left: x }}
      role="menu"
    >
      <p className="px-3 py-1 text-xs font-bold text-camfrog-text-muted">กำหนด Rank</p>
      <ul className="space-y-1">
        {Object.entries(RANK_OPTIONS).map(([thaiColor, colorClass]) => (
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
        ))}
      </ul>
    </div>
  );
};

export default UserContextMenu;
