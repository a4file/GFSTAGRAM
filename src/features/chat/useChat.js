/**
 * 채팅 로직 커스텀 훅
 */

import { useState, useCallback } from 'react';
import useChatStore from '../../stores/chatStore.js';
import useSettingsStore from '../../stores/settingsStore.js';
import { streamChatResponse, formatErrorMessage } from '../../ai/api.js';
import useCharacterStore from '../character/characterStore.js';

export function useChat(characterId) {
  const { getChatHistory, addMessage, updateMessage, setEmotionalContext, getEmotionalContext } = useChatStore();
  const { apiKey, modelName } = useSettingsStore();
  const { getCharacter } = useCharacterStore();
  
  const [isTyping, setIsTyping] = useState(false);
  const messages = getChatHistory(characterId);
  const character = getCharacter(characterId);
  const emotionalContext = getEmotionalContext(characterId);

  const sendMessage = useCallback(async (content, type = 'text') => {
    if (!content || !character) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now(),
      text: type === 'text' ? content : undefined,
      content: type !== 'text' ? content : undefined,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: type
    };

    addMessage(characterId, userMessage);

    // API 키 확인
    if (!apiKey) {
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: "API 키가 없어서 답변을 드릴 수 없어요. 설정에서 등록해 주세요! 🔑",
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        };
        addMessage(characterId, botMessage);
      }, 1000);
      return;
    }

    setIsTyping(true);

    try {
      // 메시지 준비
      let apiMessages = [];
      
      if (type === 'image') {
        const base64Data = content.includes(',') ? content.split(',')[1] : content;
        apiMessages = [{
          role: 'user',
          content: `이 이미지를 자세히 분석해주세요. 이미지 base64 데이터: data:image/jpeg;base64,${base64Data}`
        }];
        
        // 시스템 프롬프트 추가
        const { buildSystemPrompt, adjustPromptForContext } = await import('../../ai/promptBuilder.js');
        const basePrompt = buildSystemPrompt(character);
        const adjustedPrompt = adjustPromptForContext(basePrompt, 'normal', character);
        apiMessages.unshift({
          role: 'system',
          content: adjustedPrompt
        });
      } else if (type === 'audio') {
        apiMessages = [{
          role: 'user',
          content: '음성 메시지를 받았습니다. 음성 내용을 요약해주세요.'
        }];
        
        // 시스템 프롬프트 추가
        const { buildSystemPrompt, adjustPromptForContext, detectConversationType } = await import('../../ai/promptBuilder.js');
        const conversationType = detectConversationType(content || '');
        const basePrompt = buildSystemPrompt(character);
        const adjustedPrompt = adjustPromptForContext(basePrompt, conversationType, character);
        apiMessages.unshift({
          role: 'system',
          content: adjustedPrompt
        });
      } else {
        // 텍스트 메시지인 경우 RAG 통합된 메시지 준비
        const { prepareMessages } = await import('../../ai/memoryManager.js');
        apiMessages = await prepareMessages(
          content,
          messages,
          characterId,
          character,
          apiKey,
          modelName,
          { [characterId]: emotionalContext },
          (updated) => {
            setEmotionalContext(characterId, updated[characterId]);
          }
        );
      }

      // 메시지 검증
      const validMessages = apiMessages.filter(m => 
        m && m.role && m.content && typeof m.content === 'string' && m.content.trim().length > 0
      );

      if (validMessages.length === 0) {
        throw new Error('유효한 메시지가 없습니다.');
      }

      // 스트리밍 응답 처리
      let botMessageId = null;
      let messageCreated = false;

      await streamChatResponse(
        validMessages,
        apiKey,
        modelName,
        (delta, fullResponse) => {
          // 첫 델타가 올 때만 메시지 생성
          if (!messageCreated) {
            botMessageId = Date.now() + 1;
            const botMessage = {
              id: botMessageId,
              text: '',
              sender: 'bot',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'text'
            };
            addMessage(characterId, botMessage);
            messageCreated = true;
          }
          
          // 실시간으로 메시지 업데이트
          updateMessage(characterId, botMessageId, { text: fullResponse });
        },
        (fullResponse) => {
          // 완료 시 최종 업데이트
          if (botMessageId) {
            updateMessage(characterId, botMessageId, { text: fullResponse });
          }
        },
        (error) => {
          // 에러 처리
          const errorText = formatErrorMessage(error);
          const errorMessage = {
            id: Date.now() + 1,
            text: errorText,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
          };
          addMessage(characterId, errorMessage);
        }
      );

      // 메시지가 생성되지 않았다면 빈 메시지 생성
      if (!messageCreated) {
        const botMessage = {
          id: Date.now() + 1,
          text: '응답을 받을 수 없었습니다.',
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        };
        addMessage(characterId, botMessage);
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      const errorText = formatErrorMessage(error);
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      addMessage(characterId, errorMessage);
    } finally {
      setIsTyping(false);
    }
  }, [characterId, character, messages, apiKey, modelName, emotionalContext, addMessage, updateMessage, setEmotionalContext, getEmotionalContext]);

  return {
    messages,
    isTyping,
    sendMessage
  };
}

