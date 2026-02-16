/**
 * 채팅 윈도우 컴포넌트
 */

import React from 'react';
import { ChevronLeft, Phone, Video, Info, CheckCircle2 } from 'lucide-react';
import { useChat } from './useChat.js';
import MessageList from './MessageList.jsx';
import ChatInput from './ChatInput.jsx';

export default function ChatWindow({ character, onBack, onProfileClick }) {
  const { messages, isTyping, sendMessage } = useChat(character?.id);

  const handleSendMessage = (content, type) => {
    sendMessage(content, type);
  };

  if (!character) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">캐릭터를 선택해주세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white border-x border-gray-200 shadow-xl font-sans text-gray-900 overflow-hidden relative">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <ChevronLeft className="w-7 h-7 cursor-pointer" onClick={onBack} />
          <div className="flex items-center gap-3 cursor-pointer" onClick={onProfileClick}>
            {character.image ? (
              <img
                src={character.image}
                alt={character.name}
                className="w-9 h-9 rounded-full object-cover"
                style={{ imageRendering: 'high-quality', minWidth: '36px', minHeight: '36px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className={`w-9 h-9 rounded-full ${character.color} flex items-center justify-center text-white font-bold text-sm ${character.image ? 'hidden' : ''}`}>
              {character.name[0]}
            </div>
            <div>
              <h1 className="text-sm font-bold flex items-center gap-1">
                {character.name} <CheckCircle2 className="w-3 h-3 text-blue-500 fill-current" />
              </h1>
              <p className="text-[10px] text-gray-500">{character.username}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-700">
          <Phone className="w-5 h-5 cursor-pointer" />
          <Video className="w-5 h-5 cursor-pointer" />
          <Info className="w-5 h-5 cursor-pointer" onClick={onProfileClick} />
        </div>
      </header>

      <MessageList messages={messages} isTyping={isTyping} />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendMedia={handleSendMessage}
      />
    </div>
  );
}

