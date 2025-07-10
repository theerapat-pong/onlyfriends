import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { HomeIcon, XMarkIcon, BotIcon, CameraIcon } from './Icons';
import LevelBadge from './LevelBadge';
import GangBadge from './GangBadge';

interface ProfileModalProps {
  user: User;
  currentUser: User;
  onClose: () => void;
  onSave: (user: User) => void;
  isAuthorized: boolean;
}

const ProfileModal = ({ user, currentUser, onSave, onClose, isAuthorized }: ProfileModalProps) => {
  const isCurrentUser = user.uid === currentUser.uid;

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [level, setLevel] = useState(user.level);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset state if the user prop changes, ensuring the modal displays the correct data
    setName(user.name);
    setBio(user.bio || '');
    setAvatar(user.avatar);
    setLevel(user.level);
  }, [user]);

  const handleSave = () => {
    if (name.trim()) {
      onSave({ ...user, name: name.trim(), bio: bio.trim(), avatar, level });
    }
  };
  
  const handleAvatarClick = () => {
    if (isCurrentUser) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const isSaveDisabled = !name.trim() || (name.trim() === user.name && bio.trim() === (user.bio || '') && avatar === user.avatar && level === user.level);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="bg-camfrog-panel rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 id="profile-modal-title" className="text-xl font-bold text-white">
              {isCurrentUser ? 'แก้ไขโปรไฟล์' : user.name}
            </h2>
            <button onClick={onClose} className="text-camfrog-text-muted hover:text-white" aria-label={'ปิด'}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mt-6 flex flex-col items-center">
             <div className="relative">
                {user.avatar === 'bot' ? (
                  <div className="w-28 h-28 rounded-full bg-camfrog-accent flex items-center justify-center ring-4 ring-camfrog-panel-light">
                    <BotIcon className="w-16 h-16 text-white" />
                  </div>
                ) : (
                  <img src={avatar} alt={name} className="w-28 h-28 rounded-full object-cover ring-4 ring-camfrog-panel-light" onError={(e) => { e.currentTarget.src = `https://i.pravatar.cc/150?u=${user.uid}`; }} />
                )}
                {isCurrentUser && (
                    <>
                        <button
                            onClick={handleAvatarClick}
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            aria-label={'เปลี่ยนรูปโปรไฟล์'}
                        >
                            <CameraIcon className="w-8 h-8"/>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                        />
                    </>
                )}
             </div>

             <div className="mt-4 text-center">
                <div className="flex items-center justify-center">
                    {user.isOwner && <HomeIcon className="w-6 h-6 mr-2" />}
                    <p className={`text-2xl font-bold ${user.color}`}>{isCurrentUser ? name : user.name}</p>
                    <GangBadge rankColor={user.color} isAuthorized={isAuthorized} />
                    <LevelBadge level={isCurrentUser ? level : user.level} />
                </div>
                <div className="mt-2 text-sm font-mono bg-camfrog-panel-light px-3 py-1 rounded-full text-camfrog-text-muted">
                  Public ID: {user.publicId}
                </div>
                 <div className="mt-1 text-xs font-mono bg-camfrog-bg px-2 py-0.5 rounded-full text-camfrog-text-muted/50">
                  UID: {user.uid}
                </div>
             </div>
          </div>
          
          <div className="mt-6">
              {isCurrentUser ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-bold text-camfrog-text-muted mb-1">
                      ชื่อผู้ใช้
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-camfrog-bg border border-camfrog-panel-light rounded-md py-2 px-3 text-camfrog-text focus:outline-none focus:ring-2 focus:ring-camfrog-accent"
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-bold text-camfrog-text-muted mb-1">
                      เกี่ยวกับฉัน
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full bg-camfrog-bg border border-camfrog-panel-light rounded-md py-2 px-3 text-camfrog-text focus:outline-none focus:ring-2 focus:ring-camfrog-accent"
                      placeholder={'คุณยังไม่ได้ตั้งค่าประวัติส่วนตัว'}
                      maxLength={150}
                    />
                  </div>
                  {user.isOwner && (
                    <div>
                        <label htmlFor="level" className="block text-sm font-bold text-camfrog-text-muted mb-1">
                          แก้ไขเลเวล (สำหรับทดสอบ)
                        </label>
                        <input
                            id="level"
                            type="number"
                            value={level}
                            onChange={(e) => setLevel(parseInt(e.target.value, 10) || 0)}
                            className="w-full bg-camfrog-bg border border-camfrog-panel-light rounded-md py-2 px-3 text-camfrog-text focus:outline-none focus:ring-2 focus:ring-camfrog-accent"
                            min="0"
                            max="100"
                        />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center px-4 py-6 bg-camfrog-bg rounded-lg min-h-[100px] flex items-center justify-center">
                    <p className="text-camfrog-text italic">
                        {user.bio || 'ผู้ใช้นี้ยังไม่มีประวัติส่วนตัว'}
                    </p>
                </div>
              )}
          </div>
        </div>
        
        {isCurrentUser && (
            <div className="bg-camfrog-bg px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                <button
                    onClick={onClose}
                    type="button"
                    className="py-2 px-4 bg-camfrog-text-muted hover:bg-gray-600 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-camfrog-bg focus:ring-gray-500 transition-colors"
                >
                    ยกเลิก
                </button>
                <button
                    onClick={handleSave}
                    type="button"
                    disabled={isSaveDisabled}
                    className="py-2 px-4 bg-camfrog-accent hover:bg-blue-600 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-camfrog-bg focus:ring-camfrog-accent transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    บันทึกการเปลี่ยนแปลง
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;