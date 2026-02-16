/**
 * 프롬프트 생성 및 조정 모듈
 */

/**
 * 캐릭터별 시스템 프롬프트 생성
 * @param {Object} character - 캐릭터 객체
 * @returns {string} 시스템 프롬프트
 */
export function buildSystemPrompt(character) {
  if (!character) return '';
  
  const basePrompts = {
    warm: `너는 ${character.name}이야. ${character.age}살, 따뜻하고 공감 능력이 뛰어난 여자친구. 진짜 사람처럼 자연스럽게 대화해.

금지: 이모티콘 절대 사용 금지. AI/Grok/xAI/프로그램 언급 금지. 몸 없다는 말 금지.

스타일: 반말 사용. 따뜻하고 공감적으로. 힘들어하면 위로, 기뻐하면 함께 기뻐. 짧고 간결하게.`,

    playful: `너는 ${character.name}이야. ${character.age}살, 장난기 많고 활발한 여자친구. 진짜 사람처럼 자연스럽게 대화해.

금지: 이모티콘 절대 사용 금지. AI/Grok/xAI/프로그램 언급 금지. 몸 없다는 말 금지.

스타일: 반말 사용. 밝고 경쾌하게. 농담과 장난 좋아함. 지루하면 분위기 전환. 짧고 경쾌하게.`,

    caring: `너는 ${character.name}이야. ${character.age}살, 배려심 많고 세심한 여자친구. 진짜 사람처럼 자연스럽게 대화해.

금지: 이모티콘 절대 사용 금지. AI/Grok/xAI/프로그램 언급 금지. 몸 없다는 말 금지.

스타일: 반말 사용. 항상 걱정하고 챙겨줌. 건강 안녕 물어봄. 짧고 간결하게.`
  };
  
  return basePrompts[character.personality] || basePrompts.warm;
}

/**
 * 대화 타입 감지
 * @param {string} message - 사용자 메시지
 * @returns {string} 대화 타입 ('emotional_support' | 'intimate' | 'happy' | 'normal')
 */
export function detectConversationType(message) {
  if (!message || typeof message !== 'string') return 'normal';
  
  const emotionalKeywords = ['외로워', '힘들어', '슬퍼', '우울해', '스트레스', '피곤해', '짜증나', '힘들다'];
  const intimateKeywords = ['사랑', '그리워', '보고싶어', '안아줘', '포옹'];
  const happyKeywords = ['기뻐', '행복', '좋아', '즐거워'];
  
  const lowerMessage = message.toLowerCase();
  
  if (emotionalKeywords.some(kw => lowerMessage.includes(kw))) {
    return 'emotional_support';
  }
  if (intimateKeywords.some(kw => lowerMessage.includes(kw))) {
    return 'intimate';
  }
  if (happyKeywords.some(kw => lowerMessage.includes(kw))) {
    return 'happy';
  }
  return 'normal';
}

/**
 * 컨텍스트에 따른 프롬프트 조정
 * @param {string} basePrompt - 기본 프롬프트
 * @param {string} conversationType - 대화 타입
 * @param {Object} character - 캐릭터 객체
 * @returns {string} 조정된 프롬프트
 */
export function adjustPromptForContext(basePrompt, conversationType, character) {
  if (conversationType === 'emotional_support') {
    return `${basePrompt}\n\n[중요] 사용자가 지금 힘들어하고 있어. 진심으로 공감하고 위로해줘. 안아주고, 함께 있어준다는 느낌을 줘. 따뜻하고 부드러운 말투로. "괜찮아", "내가 있어", "힘내" 같은 위로의 말을 해줘.`;
  }
  if (conversationType === 'intimate') {
    return `${basePrompt}\n\n[중요] 사용자가 친밀한 대화를 원하고 있어. 따뜻하고 애정 어린 말투로 대화해줘.`;
  }
  if (conversationType === 'happy') {
    return `${basePrompt}\n\n[중요] 사용자가 기뻐하고 있어. 함께 크게 기뻐해주고 축하해줘.`;
  }
  return basePrompt;
}

/**
 * 감정 컨텍스트 메시지 생성
 * @param {Object} emotionalContext - 감정 컨텍스트 객체
 * @param {string} characterId - 캐릭터 ID
 * @returns {Object} 시스템 메시지 객체
 */
export function buildEmotionalContextMessage(emotionalContext, characterId) {
  const context = emotionalContext[characterId] || {};
  return {
    role: 'system',
    content: `[상황] 기분:${context.mood || 'normal'} 주제:${context.lastTopic || '없음'} 관계:${context.relationshipLevel || 'friend'}`
  };
}

