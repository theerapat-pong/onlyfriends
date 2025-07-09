import React from 'react';

const TEST_RANKS = [
  { name: 'Owner', rank: 'text-rainbow-animated', color: 'bg-yellow-400' },
  { name: 'Admin', rank: 'text-rank-admin', color: 'bg-rank-admin' },
  { name: 'VIP 1', rank: 'text-rank-vip1', color: 'bg-rank-vip1' },
  { name: 'VIP 2', rank: 'text-rank-vip2', color: 'bg-rank-vip2' },
  { name: 'Pro', rank: 'text-rank-pro', color: 'bg-rank-pro' },
  { name: 'User', rank: 'text-rank-user', color: 'bg-rank-user' },
  { name: 'Newbie', rank: 'text-gray-300', color: 'bg-gray-400' },
];

interface WelcomeTestPanelProps {
  onTestWelcome: (rank: string) => void;
}

const WelcomeTestPanel = ({ onTestWelcome }: WelcomeTestPanelProps) => {
  return (
    <div className="mt-2 p-2 bg-camfrog-panel-light rounded-lg">
      <h3 className="text-xs font-bold uppercase text-camfrog-text-muted mb-2 text-center">
        ทดสอบ Welcome
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {TEST_RANKS.map(({ name, rank, color }) => (
          <button
            key={name}
            onClick={() => onTestWelcome(rank)}
            className={`w-full text-xs text-white font-semibold py-1 rounded-md ${color} hover:opacity-80 transition-opacity`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeTestPanel;
