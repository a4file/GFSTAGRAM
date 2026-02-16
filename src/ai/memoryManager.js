/**
 * 대화 히스토리 관리 및 메시지 준비 모듈
 */

import { buildSystemPrompt, adjustPromptForContext, detectConversationType, buildEmotionalContextMessage } from './promptBuilder.js';
import { summarizeMessages } from './api.js';
import { retrieveRelevantContext } from './rag.js';
import { estimateMessageTokens, truncateMessages } from '../utils/tokenCounter.js';

const RECENT_COUNT = 8; // 최근 메시지 개수
const SUMMARY_THRESHOLD = 10; // 요약 시작 임계값
const MAX_CONTEXT_TOKENS = 100000; // 최대 컨텍스트 토큰 (128K의 약 80%)

/**
 * 최근 메시지 추출
 * @param {Array} chatHistory - 채팅 히스토리
 * @param {number} count - 추출할 개수
 * @returns {Array} 최근 메시지 배열
 */
export function getRecentMessages(chatHistory, count = RECENT_COUNT) {
  if (!Array.isArray(chatHistory)) return [];
  return chatHistory.slice(-count);
}

/**
 * 오래된 메시지 추출
 * @param {Array} chatHistory - 채팅 히스토리
 * @param {number} count} - 최근 메시지 개수
 * @returns {Array} 오래된 메시지 배열
 */
export function getOldMessages(chatHistory, count = RECENT_COUNT) {
  if (!Array.isArray(chatHistory)) return [];
  return chatHistory.slice(0, -count);
}

/**
 * 요약 필요 여부 판단
 * @param {Array} oldMessages - 오래된 메시지 배열
 * @returns {boolean} 요약 필요 여부
 */
export function shouldSummarize(oldMessages) {
  return oldMessages && oldMessages.length >= SUMMARY_THRESHOLD;
}

/**
 * 감정 컨텍스트 업데이트
 * @param {Object} currentContext - 현재 감정 컨텍스트
 * @param {string} characterId - 캐릭터 ID
 * @param {string} conversationType - 대화 타입
 * @param {string} topic - 주제 (최대 50자)
 * @returns {Object} 업데이트된 감정 컨텍스트
 */
export function updateEmotionalContext(currentContext, characterId, conversationType, topic) {
  return {
    ...currentContext,
    [characterId]: {
      ...currentContext[characterId],
      mood: conversationType === 'emotional_support' ? 'caring' : 
            conversationType === 'happy' ? 'happy' : 'normal',
      lastTopic: topic ? topic.substring(0, 50) : (currentContext[characterId]?.lastTopic || ''),
      relationshipLevel: currentContext[characterId]?.relationshipLevel || 'friend'
    }
  };
}

/**
 * 메시지 준비 (RAG 통합)
 * @param {string} currentMsg - 현재 사용자 메시지
 * @param {Array} chatHistory - 채팅 히스토리
 * @param {string} characterId - 캐릭터 ID
 * @param {Object} character - 캐릭터 객체
 * @param {string} apiKey - API 키
 * @param {string} modelName - 모델 이름
 * @param {Object} emotionalContext - 감정 컨텍스트
 * @param {Function} setEmotionalContext - 감정 컨텍스트 업데이트 함수
 * @returns {Promise<Array>} 준비된 메시지 배열
 */
export async function prepareMessages(
  currentMsg,
  chatHistory,
  characterId,
  character,
  apiKey,
  modelName,
  emotionalContext,
  setEmotionalContext
) {
  if (!character || !chatHistory) return [];
  
  // 대화 타입 감지
  const conversationType = detectConversationType(currentMsg);
  
  // 감정 컨텍스트 업데이트
  if (setEmotionalContext) {
    const updated = updateEmotionalContext(emotionalContext, characterId, conversationType, currentMsg);
    setEmotionalContext(updated);
  }
  
  // 메시지 변환
  const allMessages = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text || msg.content || ''
  })).filter(msg => msg.content);
  
  // 최근 메시지와 오래된 메시지 분리
  const recentMessages = getRecentMessages(allMessages, RECENT_COUNT);
  const oldMessages = getOldMessages(allMessages, RECENT_COUNT);
  
  let messages = [];
  
  // 1. 시스템 프롬프트 추가
  const basePrompt = buildSystemPrompt(character);
  const adjustedPrompt = adjustPromptForContext(basePrompt, conversationType, character);
  messages.push({
    role: 'system',
    content: adjustedPrompt
  });
  
  // 2. 감정 컨텍스트 정보 추가
  const emotionalContextMsg = buildEmotionalContextMessage(emotionalContext, characterId);
  messages.push(emotionalContextMsg);
  
  // 3. 오래된 메시지 처리
  if (shouldSummarize(oldMessages)) {
    // RAG로 관련 메시지 검색
    const relevantMessages = retrieveRelevantContext(
      currentMsg,
      chatHistory,
      characterId,
      MAX_CONTEXT_TOKENS * 0.3, // 오래된 메시지에 할당할 토큰
      RECENT_COUNT
    );
    
    if (relevantMessages.length > 0) {
      // RAG로 검색된 메시지 추가
      messages.push(...relevantMessages);
    } else {
      // RAG 결과가 없으면 요약 시도
      try {
        const summary = await summarizeMessages(oldMessages, apiKey, modelName);
        if (summary && summary.trim()) {
          messages.push({
            role: 'system',
            content: `[이전 대화 요약]\n${summary}\n\n위 요약을 참고하되, 최근 대화에 집중하여 답변해주세요.`
          });
        }
      } catch (e) {
        console.warn('요약 중 오류:', e);
      }
    }
  }
  
  // 4. 최근 메시지 추가
  messages.push(...recentMessages);
  
  // 5. 현재 사용자 메시지 추가
  messages.push({
    role: 'user',
    content: currentMsg
  });
  
  // 6. 토큰 제한 확인 및 자르기
  const estimatedTokens = estimateMessageTokens(messages);
  if (estimatedTokens > MAX_CONTEXT_TOKENS) {
    // 시스템 메시지는 유지하고 나머지만 자르기
    messages = truncateMessages(messages, MAX_CONTEXT_TOKENS, true);
  }
  
  // 7. 메시지 검증
  return messages.filter(m => 
    m && 
    m.role && 
    m.content && 
    typeof m.content === 'string' && 
    m.content.trim().length > 0
  );
}

