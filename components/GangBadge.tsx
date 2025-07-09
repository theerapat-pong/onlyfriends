import React from 'react';

interface GangBadgeProps {
  rankColor?: string;
  isAuthorized?: boolean;
}

const GangBadge = ({ rankColor, isAuthorized = false }: GangBadgeProps) => {
  if (rankColor === 'text-rainbow-animated') { // Owner
    return (
      <div 
        className="inline-flex items-center justify-center rounded-md text-xs ml-1.5 px-1.5 py-px shadow-lg bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600"
      >
        <span className="font-bold tracking-tight text-yellow-900 text-shadow-strong" style={{ fontSize: '0.7rem' }}>OWNER</span>
      </div>
    );
  }

  if (rankColor === 'text-rank-admin') { // Admin
    return (
      <div className="inline-flex items-center justify-center rounded-md text-xs ml-1.5 px-1.5 py-px shadow-md bg-black border border-gray-500">
        <span className="font-bold tracking-tight text-white" style={{ fontSize: '0.7rem' }}>ADMIN</span>
      </div>
    );
  }

  // VIP badges are only shown in authorized rooms.
  if (!isAuthorized) {
    return null;
  }

  if (rankColor === 'text-rank-vip1') { // VVIP
    return (
      <div className="inline-flex items-center justify-center rounded-md text-xs ml-1.5 px-1.5 py-px shadow-lg bg-gradient-to-br from-pink-500 to-purple-600 border border-pink-400">
        <span className="font-bold tracking-tight text-white text-shadow-strong" style={{ fontSize: '0.7rem' }}>VVIP</span>
      </div>
    );
  }
  
  if (rankColor === 'text-rank-vip2') { // VIP
    return (
      <div className="inline-flex items-center justify-center rounded-md text-xs ml-1.5 px-1.5 py-px shadow-lg bg-gradient-to-br from-orange-500 to-red-600 border border-orange-400">
        <span className="font-bold tracking-tight text-white text-shadow-strong" style={{ fontSize: '0.7rem' }}>VIP</span>
      </div>
    );
  }

  return null;
};

export default GangBadge;