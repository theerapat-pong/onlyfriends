import React from 'react';

interface LevelBadgeProps {
  level?: number;
}

const getLevelStyle = (level: number): { badgeClass: string; textClass: string } => {
  if (level >= 99) { // Legendary
    return { 
      badgeClass: 'bg-rainbow-light border-2 border-white', 
      textClass: 'text-red-600 font-bold' 
    };
  }
  if (level >= 75) { // Master
    return { 
      badgeClass: 'bg-gradient-to-br from-red-600 to-purple-800 border border-red-400/50', 
      textClass: 'text-white font-bold' 
    };
  }
  if (level >= 50) { // Diamond
    return { 
      badgeClass: 'bg-gradient-to-br from-sky-400 to-cyan-300 border border-sky-200/50', 
      textClass: 'text-white font-bold text-shadow-strong' 
    };
  }
  if (level >= 30) { // Platinum
    return { 
      badgeClass: 'bg-gradient-to-br from-slate-500 to-purple-600 border border-slate-300/50', 
      textClass: 'text-white font-bold' 
    };
  }
  if (level >= 20) { // Gold
    return { 
      badgeClass: 'bg-gradient-to-br from-yellow-400 to-amber-500 border border-yellow-200/50', 
      textClass: 'text-amber-900 font-bold' 
    };
  }
  if (level >= 10) { // Silver
    return { 
      badgeClass: 'bg-gradient-to-br from-slate-300 to-slate-400 border border-slate-200/50', 
      textClass: 'text-slate-800 font-bold' 
    };
  }
  // Default (Bronze)
  return { 
    badgeClass: 'bg-gradient-to-br from-amber-700 to-orange-800 border border-amber-600/50', 
    textClass: 'text-orange-200 font-bold' 
  }; 
};


const LevelBadge = ({ level }: LevelBadgeProps) => {
  if (level === undefined || level < 1) return null;

  const { badgeClass, textClass } = getLevelStyle(level);

  return (
    <div className={`inline-flex items-center justify-center rounded-lg text-xs font-mono ml-2 px-2 py-0.5 shadow-md ${badgeClass}`}>
      <span className={textClass}>Lv.{level}</span>
    </div>
  );
};

export default LevelBadge;