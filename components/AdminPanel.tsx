import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/firebase';
import { ShieldCheckIcon } from './Icons';

// Duplicating from UserContextMenu for simplicity, with more descriptive names
const RANK_OPTIONS: { [key: string]: string } = {
  'สีม่วง (Admin)': 'text-rank-admin',
  'สีชมพู (VIP 1)': 'text-rank-vip1',
  'สีส้ม (VIP 2)': 'text-rank-vip2',
  'สีแดง (Pro)': 'text-rank-pro',
  'สีฟ้า (User)': 'text-rank-user',
  'สีเทา (Newbie)': 'text-gray-300',
};

interface AdminPanelProps {
  onNavigate: (path: string) => void;
  onUpdateUser: (updatedUser: Partial<User> & { uid: string }) => Promise<void>;
  currentUser: User;
}

const AdminPanel = ({ onNavigate, onUpdateUser }: AdminPanelProps) => {
  const [searchUid, setSearchUid] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [newPublicId, setNewPublicId] = useState('');
  const [isUpdatingPublicId, setIsUpdatingPublicId] = useState(false);


  useEffect(() => {
    if (foundUser) {
      setSelectedRank(foundUser.color);
      setNewPublicId(foundUser.publicId);
    } else {
        setNewPublicId('');
    }
  }, [foundUser]);

  const handleSearch = async () => {
    if (!searchUid.trim()) return;
    setIsLoading(true);
    setError('');
    setFoundUser(null);
    setSuccessMessage('');
    try {
      const userDocRef = db.collection('users').doc(searchUid.trim());
      const docSnap = await userDocRef.get();
      if (docSnap.exists) {
        setFoundUser({ uid: docSnap.id, ...docSnap.data() } as User);
      } else {
        setError('ไม่พบผู้ใช้ที่มี UID นี้');
      }
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการค้นหาผู้ใช้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRank = async () => {
    if (!foundUser || !selectedRank) return;
    if (foundUser.isOwner) {
        setError('ไม่สามารถเปลี่ยน Rank ของ Owner ได้');
        return;
    }
    setSuccessMessage('');
    setError('');
    try {
      await onUpdateUser({ uid: foundUser.uid, color: selectedRank });
      setFoundUser(prev => prev ? { ...prev, color: selectedRank } : null);
      setSuccessMessage(`เปลี่ยน Rank ของ ${foundUser.name} สำเร็จแล้ว`);
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการอัปเดต Rank');
    }
  };
  
  const handleUpdatePublicId = async () => {
    if (!foundUser || !newPublicId.trim() || newPublicId.trim() === foundUser.publicId) {
        return;
    }
    
    setIsUpdatingPublicId(true);
    setError('');
    setSuccessMessage('');

    try {
        // Check for uniqueness
        const trimmedId = newPublicId.trim();
        const q = db.collection('users').where('publicId', '==', trimmedId);
        const querySnapshot = await q.get();

        if (!querySnapshot.empty) {
            setError(`Public ID "${trimmedId}" นี้มีผู้ใช้อื่นใช้แล้ว`);
            setIsUpdatingPublicId(false);
            return;
        }

        await onUpdateUser({ uid: foundUser.uid, publicId: trimmedId });
        setFoundUser(prev => prev ? { ...prev, publicId: trimmedId } : null);
        setSuccessMessage(`เปลี่ยน Public ID ของ ${foundUser.name} สำเร็จแล้ว`);

    } catch (err) {
        console.error(err);
        setError('เกิดข้อผิดพลาดในการอัปเดต Public ID');
    } finally {
        setIsUpdatingPublicId(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-camfrog-bg text-camfrog-text p-4 sm:p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-camfrog-panel-light">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <ShieldCheckIcon className="w-8 h-8 mr-3 text-camfrog-accent" />
            Admin Control Panel
          </h1>
          <button
            onClick={() => onNavigate('/')}
            className="bg-camfrog-accent hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-colors"
          >
            กลับไปที่ห้องแชท
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* User Management Section */}
          <div className="bg-camfrog-panel p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">จัดการผู้ใช้</h2>
            
            {/* Search User */}
            <div className="mb-6">
              <label htmlFor="uid-search" className="block text-sm font-medium text-camfrog-text-muted mb-2">
                ค้นหาผู้ใช้ด้วย UID
              </label>
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex space-x-2">
                <input
                  id="uid-search"
                  type="text"
                  value={searchUid}
                  onChange={(e) => setSearchUid(e.target.value)}
                  placeholder="ใส่ UID ของผู้ใช้"
                  className="flex-grow bg-camfrog-panel-light border border-camfrog-panel-light rounded-md py-2 px-3 text-camfrog-text focus:outline-none focus:ring-2 focus:ring-camfrog-accent"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-camfrog-accent hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
                </button>
              </form>
            </div>

            {error && <p className="text-red-400 text-center my-4">{error}</p>}
            {successMessage && <p className="text-green-400 text-center my-4">{successMessage}</p>}

            {/* Found User Details */}
            {foundUser && (
              <div className="bg-camfrog-panel-light p-4 rounded-md animate-fade-in-down">
                <div className="flex items-center space-x-4">
                  <img src={foundUser.avatar} alt={foundUser.name} className="w-16 h-16 rounded-full object-cover"/>
                  <div>
                    <p className={`text-xl font-bold ${foundUser.color}`}>{foundUser.name}</p>
                    <p className="text-sm text-camfrog-text-muted">{foundUser.email}</p>
                    <p className="text-sm font-mono bg-camfrog-bg px-2 py-0.5 rounded-full inline-block mt-1">Public ID: {foundUser.publicId}</p>
                    <p className="text-xs font-mono bg-camfrog-bg px-2 py-0.5 rounded-full inline-block mt-1 text-camfrog-text-muted/50">UID: {foundUser.uid}</p>
                  </div>
                </div>

                {/* Rank Management */}
                <div className="mt-4 border-t border-camfrog-panel pt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">เปลี่ยน Rank</h3>
                   <div className="flex items-center space-x-2">
                     <select
                      value={selectedRank}
                      onChange={e => setSelectedRank(e.target.value)}
                      disabled={foundUser.isOwner}
                      className="flex-grow bg-camfrog-bg text-camfrog-text text-sm rounded-md p-2 border border-camfrog-panel focus:outline-none focus:ring-2 focus:ring-camfrog-accent disabled:opacity-50"
                     >
                      {Object.entries(RANK_OPTIONS).map(([name, value]) => (
                        <option key={value} value={value}>{name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleUpdateRank}
                      disabled={foundUser.isOwner || foundUser.color === selectedRank}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                      อัปเดต Rank
                    </button>
                   </div>
                </div>
              </div>
            )}
          </div>
          
           {/* Public ID Change Section */}
           <div className="bg-camfrog-panel p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">เปลี่ยน Public ID</h2>
                <p className="text-sm text-camfrog-text-muted mb-4">
                    ใช้ส่วนนี้เพื่อเปลี่ยน Public ID ของผู้ใช้ (รหัสที่แสดงต่อสาธารณะ) โปรดตรวจสอบให้แน่ใจว่า ID ใหม่ไม่ซ้ำกับผู้อื่น
                </p>
                <form onSubmit={(e) => { e.preventDefault(); handleUpdatePublicId(); }} className="space-y-4">
                     <div>
                        <label htmlFor="current-public-id" className="block text-sm font-medium text-camfrog-text-muted mb-2">Public ID ปัจจุบัน</label>
                        <input id="current-public-id" type="text" value={foundUser?.publicId || ''} disabled className="w-full bg-camfrog-panel-light rounded-md py-2 px-3 cursor-not-allowed text-camfrog-text-muted"/>
                    </div>
                    <div>
                        <label htmlFor="new-public-id" className="block text-sm font-medium text-camfrog-text-muted mb-2">Public ID ใหม่</label>
                        <input 
                            id="new-public-id" 
                            type="text" 
                            value={newPublicId}
                            onChange={(e) => setNewPublicId(e.target.value)}
                            disabled={!foundUser || isUpdatingPublicId} 
                            className="w-full bg-camfrog-bg border border-camfrog-panel rounded-md py-2 px-3 text-camfrog-text focus:outline-none focus:ring-2 focus:ring-camfrog-accent disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={!foundUser ? "โปรดค้นหาผู้ใช้ก่อน" : "ใส่ Public ID ใหม่"}
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={!foundUser || isUpdatingPublicId || !newPublicId.trim() || newPublicId.trim() === foundUser.publicId}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isUpdatingPublicId ? 'กำลังอัปเดต...' : 'ยืนยันการเปลี่ยน Public ID'}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};
export default AdminPanel;