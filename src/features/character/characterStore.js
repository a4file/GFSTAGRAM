/**
 * 캐릭터 상태 관리 스토어 (Zustand)
 */

import { create } from 'zustand';
import { storage } from '../../utils/storage.js';
import { defaultCharacters, createDefaultCharacter } from './characterSchema.js';

const useCharacterStore = create((set, get) => ({
  // 초기 상태: localStorage에서 불러오거나 기본값 사용
  characters: (() => {
    const stored = storage.getCharacters();
    if (stored && stored.length > 0) {
      return stored;
    }
    // 기본 캐릭터 저장
    storage.setCharacters(defaultCharacters);
    return defaultCharacters;
  })(),
  
  // 캐릭터 추가
  addCharacter: (character) => {
    const newCharacter = {
      ...createDefaultCharacter(),
      ...character,
      id: character.id || `character_${Date.now()}`
    };
    
    set((state) => {
      const updated = [...state.characters, newCharacter];
      storage.setCharacters(updated);
      return { characters: updated };
    });
    
    return newCharacter.id;
  },
  
  // 캐릭터 업데이트
  updateCharacter: (id, updates) => {
    set((state) => {
      const updated = state.characters.map(char =>
        char.id === id ? { ...char, ...updates } : char
      );
      storage.setCharacters(updated);
      return { characters: updated };
    });
  },
  
  // 캐릭터 삭제
  deleteCharacter: (id) => {
    set((state) => {
      const updated = state.characters.filter(char => char.id !== id);
      storage.setCharacters(updated);
      return { characters: updated };
    });
  },
  
  // 캐릭터 가져오기
  getCharacter: (id) => {
    return get().characters.find(char => char.id === id);
  },
  
  // 모든 캐릭터 가져오기
  getAllCharacters: () => {
    return get().characters;
  },
}));

export default useCharacterStore;

