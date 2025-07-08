import React from 'react';
import { SparklesIcon, CrownIcon, ShieldCheckIcon, UserIcon } from './Icons';

interface WelcomeNotificationProps {
  rank: string;
  name: string;
}

const WelcomeNotification = ({ rank, name }: WelcomeNotificationProps) => {
  let icon: JSX.Element;
  let gradientClass: string;
  let text: string;

  switch (rank) {
    case 'text-rainbow-animated':
      icon = <CrownIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-yellow-500 to-orange-500';
      text = `การกลับมาของเจ้าของห้อง, ${name}!`;
      break;
    case 'text-rank-admin':
      icon = <ShieldCheckIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-purple-500 to-purple-700';
      text = `ผู้ดูแลระบบ ${name} ได้เข้าสู่ระบบ`;
      break;
    case 'text-rank-vip1':
      icon = <SparklesIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-pink-400 to-pink-600';
      text = `ยินดีต้อนรับการกลับมาของบุคคลสำคัญ, ${name}!`;
      break;
    case 'text-rank-vip2':
      icon = <SparklesIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-orange-400 to-orange-600';
      text = `🎉 ยินดีต้อนรับ ${name}! การเข้ามาของคุณทำให้ห้องแชทมีสีสันมากขึ้น 🎉`;
      break;
    case 'text-rank-pro':
      icon = <SparklesIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-red-500 to-red-700';
      text = `ยินดีต้อนรับมือโปร, ${name}!`;
      break;
    case 'text-rank-user':
      icon = <UserIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-blue-500 to-blue-700';
      text = `ยินดีต้อนรับ, ${name}`;
      break;
    default: // text-gray-300 and any other cases
      icon = <UserIcon className="w-5 h-5 mr-2" />;
      gradientClass = 'from-gray-600 to-gray-800';
      text = `ยินดีต้อนรับ, ${name}`;
      break;
  }

  return (
    <div className="absolute bottom-20 left-6 z-20 animate-welcome-toast">
      <div className={`flex items-center bg-gradient-to-r ${gradientClass} text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-xl`}>
        {icon}
        <p>{text}</p>
      </div>
    </div>
  );
};

export default WelcomeNotification;
