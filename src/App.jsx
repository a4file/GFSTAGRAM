/**
 * 메인 App 컴포넌트
 * 리팩토링된 모듈화된 구조
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, X } from 'lucide-react';
import InboxView from './features/inbox/InboxView.jsx';
import ChatWindow from './features/chat/ChatWindow.jsx';
import ProfileView from './features/profile/ProfileView.jsx';
import useCharacterStore from './features/character/characterStore.js';
import useChatStore from './stores/chatStore.js';
import { defaultCharacters } from './features/character/characterSchema.js';
import { storage } from './utils/storage.js';

function App() {
  const [view, setView] = useState('inbox');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  const { characters, getAllCharacters } = useCharacterStore();
  const { getChatHistory, setChatHistory } = useChatStore();

  // 데이터 마이그레이션: 기존 하드코딩된 friends 배열을 localStorage로 마이그레이션
  useEffect(() => {
    const stored = storage.getCharacters();
    if (!stored || stored.length === 0) {
      // 기본 캐릭터 저장
      storage.setCharacters(defaultCharacters);
      
      // 기본 채팅 히스토리 초기화
      const defaultHistory = {};
      defaultCharacters.forEach(char => {
        defaultHistory[char.id] = [{
          id: 1,
          text: "새로운 친구가 추가되었습니다.",
          sender: 'bot',
          time: '오후 2:00',
          type: 'text'
        }];
      });
      storage.setChatHistory(defaultHistory);
      
      // 기본 감정 컨텍스트 초기화
      const defaultEmotionalContext = {};
      defaultCharacters.forEach(char => {
        defaultEmotionalContext[char.id] = {
          mood: 'happy',
          lastTopic: '',
          relationshipLevel: 'friend'
        };
      });
      storage.setEmotionalContext(defaultEmotionalContext);
    }
  }, []);

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
    setView('chat');
  };

  const handleBackToInbox = () => {
    setView('inbox');
    setSelectedCharacter(null);
  };

  const handleOpenProfile = () => {
    if (selectedCharacter) {
      setView('profile');
    }
  };

  const handleBackToChat = () => {
    setView('chat');
  };

  // Post Detail View
  if (selectedPost) {
    const postId = `${selectedPost.friend.id}-${selectedPost.id}`;
    const isLiked = likedPosts.has(postId);
    const isSaved = savedPosts.has(postId);

    return (
      <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white border-x border-gray-200 shadow-xl font-sans text-gray-900 overflow-hidden">
        <header className="px-4 py-3 flex items-center justify-between sticky top-0 bg-white border-b z-10 safe-area-top touch-none">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              className="touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setSelectedPost(null)}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">게시물</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overscroll-contain">
          {/* 게시글 헤더 */}
          <div className="px-4 py-3 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              {selectedPost.friend.image ? (
                <img
                  src={selectedPost.friend.image}
                  alt={selectedPost.friend.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full ${selectedPost.friend.color} flex items-center justify-center text-white font-bold`}>
                  {selectedPost.friend.name[0]}
                </div>
              )}
              <div>
                <p className="font-semibold text-sm">{selectedPost.friend.username}</p>
                <p className="text-xs text-gray-500">{selectedPost.time}</p>
              </div>
            </div>
            <MoreHorizontal className="w-6 h-6 text-gray-600" />
          </div>

          {/* 게시글 이미지 */}
          <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
            {selectedPost.image ? (
              <img src={selectedPost.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${selectedPost.gradient || selectedPost.friend.color} flex items-center justify-center`}>
                <div className="text-white/40 text-8xl font-bold">
                  {selectedPost.friend.name[0]}
                </div>
              </div>
            )}
          </div>

          {/* 게시글 액션 버튼 */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const newLiked = new Set(likedPosts);
                    if (isLiked) {
                      newLiked.delete(postId);
                    } else {
                      newLiked.add(postId);
                    }
                    setLikedPosts(newLiked);
                  }}
                  className="hover:opacity-70 transition-opacity"
                >
                  <Heart className={`w-7 h-7 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-900'}`} />
                </button>
                <MessageCircle className="w-7 h-7 text-gray-900" />
                <Share2 className="w-7 h-7 text-gray-900" />
              </div>
              <button
                onClick={() => {
                  const newSaved = new Set(savedPosts);
                  if (isSaved) {
                    newSaved.delete(postId);
                  } else {
                    newSaved.add(postId);
                  }
                  setSavedPosts(newSaved);
                }}
                className="hover:opacity-70 transition-opacity"
              >
                <Bookmark className={`w-7 h-7 ${isSaved ? 'fill-gray-900 text-gray-900' : 'text-gray-900'}`} />
              </button>
            </div>

            <div className="mb-1">
              <p className="text-sm font-semibold">
                좋아요 <span>{isLiked ? selectedPost.likes + 1 : selectedPost.likes}</span>개
              </p>
            </div>
          </div>

          {/* 게시글 캡션 */}
          <div className="px-4 py-2">
            <p className="text-sm">
              <span className="font-semibold mr-2">{selectedPost.friend.username}</span>
              <span className="whitespace-pre-line">{selectedPost.caption}</span>
            </p>
            <button className="text-gray-500 text-sm mt-1">
              댓글 {selectedPost.comments}개 모두 보기
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Profile View
  if (view === 'profile') {
    return (
      <ProfileView
        character={selectedCharacter}
        onBack={handleBackToChat}
        onOpenChat={() => setView('chat')}
        onPostClick={setSelectedPost}
      />
    );
  }

  // Chat View
  if (view === 'chat') {
    return (
      <ChatWindow
        character={selectedCharacter}
        onBack={handleBackToInbox}
        onProfileClick={handleOpenProfile}
      />
    );
  }

  // Inbox View (기본)
  return (
    <InboxView
      onSelectCharacter={handleSelectCharacter}
      onOpenChat={handleSelectCharacter}
    />
  );
}

export default App;
