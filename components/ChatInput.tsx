import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <div className="flex-shrink-0 p-4 bg-camfrog-panel-light border-t border-camfrog-panel">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <div className="flex-1 relative">
            <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='ส่งข้อความ...'
            className="w-full bg-camfrog-panel rounded-full px-4 py-2 text-camfrog-text placeholder-camfrog-text-muted focus:outline-none focus:ring-2 focus:ring-camfrog-accent"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-camfrog-accent hover:bg-blue-500 disabled:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-camfrog-panel focus:ring-camfrog-accent" disabled={!text.trim()}>
                <SendIcon className="w-5 h-5 text-white" />
            </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
