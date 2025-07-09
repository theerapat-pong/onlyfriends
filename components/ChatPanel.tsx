import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { BotIcon, HomeIcon } from './Icons';
import LevelBadge from './LevelBadge';
import GangBadge from './GangBadge';

interface ChatPanelProps {
  messages: Message[];
  isBotTyping: boolean;
}

const MessageItem = ({ message }: { message: Message }) => {
  const isUser = message.type === 'user';
  const isBot = message.type === 'bot';
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="px-6 py-2 text-center">
        <p className="text-xs text-camfrog-text-muted italic">{message.text}</p>
      </div>
    );
  }

  return (
    <div className={`flex items-start px-6 py-2 hover:bg-gray-900/20`}>
      <div className="flex-shrink-0 mr-4">
        {isBot ? (
          <div className="w-10 h-10 rounded-full bg-camfrog-accent flex items-center justify-center">
            <BotIcon className="w-6 h-6 text-white" />
          </div>
        ) : (
          <img src={message.avatar} alt={message.author} className="w-10 h-10 rounded-full" />
        )}
      </div>
      <div>
        <div className="flex items-center">
          {message.isAuthorOwner && (
            <HomeIcon className="w-4 h-4 mr-1.5 flex-shrink-0" aria-label="Room Owner" />
          )}
          <p className={`font-bold ${message.authorColor || 'text-camfrog-accent'}`}>{message.author}</p>
          <GangBadge rankColor={message.authorColor} isAuthorized={message.showVipBadge} />
          <LevelBadge level={message.authorLevel} />
        </div>
        <p
          className="text-camfrog-text break-words whitespace-pre-wrap"
          style={message.styles}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
};

const ChatPanel = ({ messages, isBotTyping }: ChatPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
      {isBotTyping && (
        <div className="flex items-start px-6 py-2">
            <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 rounded-full bg-camfrog-accent flex items-center justify-center">
                    <BotIcon className="w-6 h-6 text-white" />
                </div>
            </div>
            <div>
                <p className={`font-bold ${messages.find(m => m.author === 'Gemini Bot')?.authorColor || 'text-rank-user'}`}>Gemini Bot</p>
                <div className="flex items-center space-x-1 mt-1">
                    <span className="w-2 h-2 bg-camfrog-text-muted rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-camfrog-text-muted rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-camfrog-text-muted rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                </div>
            </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatPanel;