import React from 'react';
import { SparklesIcon, HomeIcon, ShieldCheckIcon, UserIcon } from './Icons';

interface WelcomeNotificationProps {
  rank: string;
  name: string;
}

const WelcomeNotification = ({ rank, name }: WelcomeNotificationProps) => {
  let icon: JSX.Element;
  let gradientClass: string;
  let animationClass = 'animate-welcome-toast'; // Default animation
  const text = `ยินดีต้อนรับคุณ ${name} เข้าสู่ โอนลี่เฟรนด์`;

  switch (rank) {
    case 'text-rainbow-animated':
      icon = <HomeIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-yellow-500 to-orange-500';
      break;
    case 'text-rank-admin':
      icon = <ShieldCheckIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-purple-500 to-purple-700';
      break;
    case 'text-rank-vip1':
      icon = <SparklesIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-pink-400 to-pink-600';
      animationClass = 'animate-vip1-welcome'; // Special VIP1 animation
      break;
    case 'text-rank-vip2':
      icon = <SparklesIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-orange-400 to-orange-600';
      animationClass = 'animate-vip2-welcome'; // Special VIP2 animation
      break;
    case 'text-rank-pro':
      icon = <SparklesIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-red-500 to-red-700';
      break;
    case 'text-rank-user':
      icon = <UserIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-blue-500 to-blue-700';
      break;
    default: // text-gray-300 and any other cases
      icon = <UserIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-gray-600 to-gray-800';
      break;
  }

  return (
    <div className={`absolute bottom-36 left-4 z-20 ${animationClass}`}>
      <div className={`inline-flex items-center bg-gradient-to-r ${gradientClass} text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-xl`}>
        {icon}
        <p>{text}</p>
      </div>
    </div>
  );
};

export default WelcomeNotification;