import React from 'react';
import { User } from '../types';
import { BotIcon, HomeIcon } from './Icons';
import LevelBadge from './LevelBadge';
import GangBadge from './GangBadge';

interface UserListProps {
  users: User[];
  currentUser: User;
  onViewProfile: (user: User) => void;
  onUserContextMenu: (event: React.MouseEvent, user: User) => void;
  isAuthorized: boolean;
}

const UserListItem = ({ user, currentUser, onViewProfile, onUserContextMenu, isAuthorized }: { user: User; currentUser: User; onViewProfile: (user: User) => void; onUserContextMenu: (event: React.MouseEvent, user: User) => void; isAuthorized: boolean; }) => {
  
  const handleContextMenu = (event: React.MouseEvent) => {
    const isModerator = currentUser.isOwner || currentUser.color === 'text-rank-admin';

    // A moderator can open context menu on other users, but not on themselves, bots, or other owners.
    if (isModerator && user.uid !== currentUser.uid && user.name !== 'Gemini Bot' && !user.isOwner) {
      event.preventDefault();
      onUserContextMenu(event, user);
    }
  };

  return (
    <li onContextMenu={handleContextMenu}>
      <button
        onClick={() => onViewProfile(user)}
        className="w-full text-left flex items-center p-2 rounded-md hover:bg-camfrog-panel-light"
        aria-label={`View profile for ${user.name}`}
      >
        <div className="relative mr-3">
          {user.avatar === 'bot' ? (
            <div className="w-10 h-10 rounded-full bg-camfrog-accent flex items-center justify-center">
              <BotIcon className="w-6 h-6 text-white" />
            </div>
          ) : (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => { e.currentTarget.src = `https://i.pravatar.cc/150?u=${user.uid}`; }}/>
          )}
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-camfrog-panel ${user.uid.charCodeAt(0) % 2 === 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        </div>
        <div className="flex-1 flex items-center min-w-0">
          {user.isOwner && (
            <HomeIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-label="Room Owner" />
          )}
          <span className={`font-semibold text-sm truncate ${user.color}`}>{user.name}</span>
          <GangBadge rankColor={user.color} isAuthorized={isAuthorized} />
          <LevelBadge level={user.level} />
        </div>
      </button>
    </li>
  );
};

const UserList = ({ users, currentUser, onViewProfile, onUserContextMenu, isAuthorized }: UserListProps) => {
  const bots = users.filter(u => u.name === 'Gemini Bot');
  const regularUsers = users.filter(u => u.name !== 'Gemini Bot');
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold uppercase text-camfrog-text-muted px-2 mb-2">{`ผู้ใช้งาน — ${regularUsers.length}`}</h2>
        <ul className="space-y-1">
            {regularUsers.map(user => (
                <UserListItem key={user.uid} user={user} currentUser={currentUser} onViewProfile={onViewProfile} onUserContextMenu={onUserContextMenu} isAuthorized={isAuthorized} />
            ))}
        </ul>

        {bots.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xs font-bold uppercase text-camfrog-text-muted px-2 mb-2">{`บอท — ${bots.length}`}</h2>
            <ul className="space-y-1">
                {bots.map(bot => (
                    <UserListItem key={bot.uid} user={bot} currentUser={currentUser} onViewProfile={onViewProfile} onUserContextMenu={onUserContextMenu} isAuthorized={isAuthorized} />
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;