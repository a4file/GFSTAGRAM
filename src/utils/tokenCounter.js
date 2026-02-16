/**
 * 토큰 카운팅 유틸리티
 * 간단한 추정 방식 사용 (정확한 토큰화는 API에서 수행)
 */

/**
 * 텍스트의 대략적인 토큰 수를 추정
 * @param {string} text - 토큰 수를 계산할 텍스트
 * @returns {number} 추정된 토큰 수
 */
export function estimateTokens(text) {
  if (!text || typeof text !== 'string') return 0;
  
  // 한글: 1자 ≈ 1.5 토큰
  // 영어: 1단어 ≈ 1.3 토큰
  // 공백, 구두점 등도 고려
  
  const koreanChars = (text.match(/[가-힣]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const otherChars = text.length - koreanChars - (text.match(/[a-zA-Z]/g) || []).length;
  
  return Math.ceil(koreanChars * 1.5 + englishWords * 1.3 + otherChars * 0.5);
}

/**
 * 메시지 배열의 총 토큰 수를 추정
 * @param {Array} messages - 메시지 배열 [{role, content}, ...]
 * @returns {number} 총 토큰 수
 */
export function estimateMessageTokens(messages) {
  if (!Array.isArray(messages)) return 0;
  
  let total = 0;
  for (const msg of messages) {
    if (msg.content) {
      total += estimateTokens(msg.content);
    }
    // role도 약간의 토큰 사용
    if (msg.role) {
      total += 2;
    }
  }
  
  // 시스템 오버헤드 (각 메시지당 약 4 토큰)
  total += messages.length * 4;
  
  return total;
}

/**
 * 토큰 제한 내에서 메시지 배열을 자르기
 * @param {Array} messages - 메시지 배열
 * @param {number} maxTokens - 최대 토큰 수
 * @param {boolean} keepSystemMessages - 시스템 메시지 유지 여부
 * @returns {Array} 잘린 메시지 배열
 */
export function truncateMessages(messages, maxTokens, keepSystemMessages = true) {
  if (!Array.isArray(messages) || messages.length === 0) return [];
  
  const systemMessages = keepSystemMessages 
    ? messages.filter(m => m.role === 'system')
    : [];
  const otherMessages = keepSystemMessages
    ? messages.filter(m => m.role !== 'system')
    : messages;
  
  let tokens = estimateMessageTokens(systemMessages);
  const result = [...systemMessages];
  
  // 역순으로 추가 (최신 메시지 우선)
  for (let i = otherMessages.length - 1; i >= 0; i--) {
    const msg = otherMessages[i];
    const msgTokens = estimateTokens(msg.content || '') + 6; // 오버헤드 포함
    
    if (tokens + msgTokens <= maxTokens) {
      result.push(msg);
      tokens += msgTokens;
    } else {
      break;
    }
  }
  
  // 시스템 메시지는 앞에, 나머지는 시간순으로 정렬
  return result;
}

/**
 * 컨텍스트 윈도우 사용률 계산
 * @param {number} usedTokens - 사용된 토큰 수
 * @param {number} maxTokens - 최대 토큰 수 (기본값: 128000)
 * @returns {number} 사용률 (0-1)
 */
export function calculateUsageRate(usedTokens, maxTokens = 128000) {
  return Math.min(usedTokens / maxTokens, 1);
}

