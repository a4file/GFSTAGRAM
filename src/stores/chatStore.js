/**
 * 채팅 히스토리 전역 관리 스토어 (Zustand)
 */

import { create } from 'zustand';
import { storage } from '../utils/storage.js';

const useChatStore = create((set, get) => ({
  // 초기 상태: localStorage에서 불러오기
  chatHistory: (() => {
    const stored = storage.getChatHistory();
    // 기본값이 있으면 반환, 없으면 빈 객체
    return stored || {};
  })(),
  
  // 감정 컨텍스트
  emotionalContext: (() => {
    const stored = storage.getEmotionalContext();
    return stored || {};
  })(),
  
  // 특정 캐릭터의 채팅 히스토리 가져오기
  getChatHistory: (characterId) => {
    return get().chatHistory[characterId] || [];
  },
  
  // 메시지 추가
  addMessage: (characterId, message) => {
    set((state) => {
      const currentHistory = state.chatHistory[characterId] || [];
      const updated = {
        ...state.chatHistory,
        [characterId]: [...currentHistory, message]
      };
      storage.setChatHistory(updated);
      return { chatHistory: updated };
    });
  },
  
  // 메시지 업데이트
  updateMessage: (characterId, messageId, updates) => {
    set((state) => {
      const currentHistory = state.chatHistory[characterId] || [];
      const updated = {
        ...state.chatHistory,
        [characterId]: currentHistory.map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        )
      };
      storage.setChatHistory(updated);
      return { chatHistory: updated };
    });
  },
  
  // 채팅 히스토리 설정
  setChatHistory: (characterId, history) => {
    set((state) => {
      const updated = {
        ...state.chatHistory,
        [characterId]: history
      };
      storage.setChatHistory(updated);
      return { chatHistory: updated };
    });
  },
  
  // 감정 컨텍스트 업데이트
  setEmotionalContext: (characterId, context) => {
    set((state) => {
      const updated = {
        ...state.emotionalContext,
        [characterId]: context
      };
      storage.setEmotionalContext(updated);
      return { emotionalContext: updated };
    });
  },
  
  // 감정 컨텍스트 가져오기
  getEmotionalContext: (characterId) => {
    return get().emotionalContext[characterId] || {
      mood: 'happy',
      lastTopic: '',
      relationshipLevel: 'friend'
    };
  },
  
  // 채팅 히스토리 초기화 (캐릭터별)
  clearChatHistory: (characterId) => {
    set((state) => {
      const updated = { ...state.chatHistory };
      delete updated[characterId];
      storage.setChatHistory(updated);
      return { chatHistory: updated };
    });
  },
}));

export default useChatStore;

