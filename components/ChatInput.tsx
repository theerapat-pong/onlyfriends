import React, { useState } from 'react';
import { SendIcon, BoldIcon, ItalicIcon, TextColorIcon } from './Icons';
import { User, MessageStyle } from '../types';

const PERMITTED_RANKS_FOR_STYLING = [
  'text-rainbow-animated', // Owner
  'text-rank-admin',
  'text-rank-vip1',
  'text-rank-vip2',
  'text-rank-pro',
];

interface ChatInputProps {
  currentUser: User;
  onSendMessage: (message: string, styles: MessageStyle) => void;
}

const ChatInput = ({ currentUser, onSendMessage }: ChatInputProps) => {
  const [text, setText] = useState('');
  const [styles, setStyles] = useState<MessageStyle>({
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#dcddde',
  });

  const hasPermission = PERMITTED_RANKS_FOR_STYLING.includes(currentUser.color);
  const isMuted = !!currentUser.isMuted;

  const handleStyleChange = (styleUpdate: Partial<MessageStyle>) => {
    setStyles(prev => ({ ...prev, ...styleUpdate }));
  };
  
  const toggleBold = () => handleStyleChange({ fontWeight: styles.fontWeight === 'bold' ? 'normal' : 'bold' });
  const toggleItalic = () => handleStyleChange({ fontStyle: styles.fontStyle === 'italic' ? 'normal' : 'italic' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isMuted) {
      onSendMessage(text.trim(), styles);
      setText('');
    }
  };

  return (
    <div className="flex-shrink-0 bg-camfrog-panel-light border-t border-camfrog-panel">
      {hasPermission && !isMuted && (
        <div className="p-2 border-b border-camfrog-panel flex items-center flex-wrap gap-x-4 gap-y-2">
            <button onClick={toggleBold} title="ตัวหนา" className={`p-1 rounded ${styles.fontWeight === 'bold' ? 'bg-camfrog-accent text-white' : 'text-camfrog-text-muted hover:bg-camfrog-panel'}`}>
                <BoldIcon className="w-5 h-5" />
            </button>
            <button onClick={toggleItalic} title="ตัวเอียง" className={`p-1 rounded ${styles.fontStyle === 'italic' ? 'bg-camfrog-accent text-white' : 'text-camfrog-text-muted hover:bg-camfrog-panel'}`}>
                <ItalicIcon className="w-5 h-5" />
            </button>
            <select
                value={styles.fontSize}
                onChange={e => handleStyleChange({ fontSize: e.target.value })}
                title="ขนาดตัวอักษร"
                className="bg-camfrog-panel text-camfrog-text text-xs rounded p-1 border border-transparent focus:outline-none focus:ring-2 focus:ring-camfrog-accent"
            >
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
            </select>
            <div className="relative w-6 h-6" title="สีข้อความ">
                <input
                    type="color"
                    value={styles.color}
                    onChange={e => handleStyleChange({ color: e.target.value })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full h-full rounded border-2 border-camfrog-text-muted pointer-events-none" style={{ backgroundColor: styles.color }}></div>
                 <TextColorIcon className="absolute -bottom-1 -right-1 w-4 h-4 text-camfrog-text-muted bg-camfrog-panel-light rounded-full p-0.5 pointer-events-none" />
            </div>
        </div>
      )}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <div className="flex-1 relative">
              <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isMuted ? 'คุณถูกจำกัดการพิมพ์' : 'ส่งข้อความ...'}
              disabled={isMuted}
              className="w-full bg-camfrog-panel rounded-full px-4 py-2 placeholder-camfrog-text-muted focus:outline-none focus:ring-2 focus:ring-camfrog-accent disabled:bg-gray-800 disabled:cursor-not-allowed"
              style={{
                color: hasPermission ? styles.color : '#dcddde',
                fontSize: hasPermission ? styles.fontSize : '16px',
                fontWeight: hasPermission ? styles.fontWeight : 'normal',
                fontStyle: hasPermission ? styles.fontStyle : 'normal',
              }}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-camfrog-accent hover:bg-blue-500 disabled:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-camfrog-panel focus:ring-camfrog-accent" disabled={!text.trim() || isMuted}>
                  <SendIcon className="w-5 h-5 text-white" />
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;