/**
 * localStorage 헬퍼 유틸리티
 */

const STORAGE_KEYS = {
  CHARACTERS: 'gfstagram_characters',
  CHAT_HISTORY: 'gfstagram_chat_history',
  EMOTIONAL_CONTEXT: 'gfstagram_emotional_context',
  SETTINGS: 'gfstagram_settings',
};

/**
 * 안전하게 JSON 파싱
 */
function safeParse(json, defaultValue = null) {
  try {
    return json ? JSON.parse(json) : defaultValue;
  } catch (e) {
    console.warn('Storage parse error:', e);
    return defaultValue;
  }
}

/**
 * 안전하게 JSON 문자열화
 */
function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch (e) {
    console.warn('Storage stringify error:', e);
    return null;
  }
}

export const storage = {
  // 캐릭터 데이터
  getCharacters() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.CHARACTERS), []);
  },
  
  setCharacters(characters) {
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, safeStringify(characters));
  },
  
  // 채팅 히스토리
  getChatHistory() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY), {});
  },
  
  setChatHistory(history) {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, safeStringify(history));
  },
  
  // 감정 컨텍스트
  getEmotionalContext() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.EMOTIONAL_CONTEXT), {});
  },
  
  setEmotionalContext(context) {
    localStorage.setItem(STORAGE_KEYS.EMOTIONAL_CONTEXT, safeStringify(context));
  },
  
  // 설정
  getSettings() {
    return safeParse(localStorage.getItem(STORAGE_KEYS.SETTINGS), {
      apiKey: '',
      modelName: 'grok-4-1-fast-reasoning',
    });
  },
  
  setSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, safeStringify(settings));
  },
  
  // 전체 초기화
  clear() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

