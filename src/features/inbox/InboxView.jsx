/**
 * 인박스 뷰 컴포넌트 (친구 목록)
 */

import React, { useState } from 'react';
import { ChevronLeft, Video, Edit, Settings, Search, Camera, X, Plus } from 'lucide-react';
import useCharacterStore from '../character/characterStore.js';
import useChatStore from '../../stores/chatStore.js';
import useSettingsStore from '../../stores/settingsStore.js';
import CharacterList from '../character/CharacterList.jsx';

export default function InboxView({ onSelectCharacter, onOpenChat }) {
  const characters = useCharacterStore(state => state.characters);
  const { getChatHistory } = useChatStore();
  const { apiKey, modelName, setApiKey, setModelName } = useSettingsStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showCharacterList, setShowCharacterList] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  const handleCharacterClick = (character) => {
    if (onSelectCharacter) {
      onSelectCharacter(character);
    }
    if (onOpenChat) {
      onOpenChat(character);
    }
  };

  const getLastMessage = (characterId) => {
    const history = getChatHistory(characterId) || [];
    const lastMessage = history[history.length - 1];
    if (lastMessage) {
      if (lastMessage.type === 'image') return '📷 사진';
      if (lastMessage.type === 'audio') return '🎤 음성 메시지';
      return lastMessage.text || lastMessage.content || '';
    }
    return null;
  };

  const getLastMessageTime = (characterId) => {
    const history = getChatHistory(characterId) || [];
    const lastMessage = history[history.length - 1];
    if (lastMessage && lastMessage.time) {
      return lastMessage.time;
    }
    return null;
  };

  return (
    <>
      {/* 프로필 이미지 확대 뷰 */}
      {showProfileImage && selectedProfileImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 safe-area-inset"
          onClick={() => {
            setShowProfileImage(false);
            setSelectedProfileImage(null);
          }}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedProfileImage}
              alt="프로필 확대"
              className="max-w-full max-h-[80dvh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => {
                setShowProfileImage(false);
                setSelectedProfileImage(null);
              }}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white border-x border-gray-200 shadow-xl font-sans text-gray-900 overflow-hidden">
        <header className="px-4 py-4 flex items-center justify-between sticky top-0 bg-white border-b z-10 safe-area-top">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">instagram_user</h1>
            <ChevronLeft className="w-4 h-4 rotate-[270deg]" />
          </div>
          <div className="flex items-center gap-6">
            <button 
              type="button"
              className="touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Video className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center hover:text-blue-500"
              onClick={() => setShowCharacterList(true)}
              title="캐릭터 추가"
            >
              <Plus className="w-6 h-6" />
            </button>
            <button
              type="button"
              className={`touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center ${showSettings ? 'text-blue-500' : ''}`}
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </header>

        {showSettings && (
          <div className="px-4 py-3 bg-gray-50 border-b">
            <input
              type="password"
              placeholder="xAI API Key"
              className="w-full px-3 py-2 bg-white rounded-lg text-sm border outline-none mb-3"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div>
              <input
                type="text"
                placeholder="모델 이름 (예: grok-4-1-fast-reasoning)"
                className="w-full px-3 py-2 bg-white rounded-lg text-sm border outline-none"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">xAI API에서 사용 가능한 모델 이름을 입력하세요</p>
              <p className="text-xs text-gray-400 mt-1">일반적인 모델: grok-2-1212, grok-2-vision-1212, grok-4-latest</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">API 키와 모델은 로컬에 저장됩니다.</p>
          </div>
        )}

        <div className="p-4 flex flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2 text-gray-500 mb-4">
            <Search className="w-4 h-4" />
            <input type="text" placeholder="검색" className="bg-transparent text-sm outline-none w-full" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-sm">메시지</span>
            <span className="text-blue-500 text-sm font-semibold">요청</span>
          </div>
          {characters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>캐릭터가 없습니다.</p>
              <p className="text-sm mt-2">+ 버튼을 눌러 캐릭터를 추가하세요.</p>
            </div>
          ) : (
            characters.map(character => {
              const lastMsg = getLastMessage(character.id) || character.lastMsg;
              const lastTime = getLastMessageTime(character.id) || character.time;
              
              return (
                <div
                  key={character.id}
                  onClick={() => handleCharacterClick(character)}
                  className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    {character.image ? (
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-14 h-14 rounded-full object-cover shadow-inner cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ imageRendering: 'high-quality', minWidth: '56px', minHeight: '56px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProfileImage(character.image);
                          setShowProfileImage(true);
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-14 h-14 rounded-full ${character.color} flex items-center justify-center text-white text-xl font-bold shadow-inner ${character.image ? 'hidden' : ''}`}>
                      {character.name[0]}
                    </div>
                    {character.online && (
                      <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{character.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="truncate max-w-[150px]">{lastMsg}</span>
                      <span>• {lastTime}</span>
                    </div>
                  </div>
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              );
            })
          )}
        </div>
      </div>

      {showCharacterList && (
        <CharacterList
          onSelectCharacter={handleCharacterClick}
          onClose={() => setShowCharacterList(false)}
        />
      )}
    </>
  );
}

