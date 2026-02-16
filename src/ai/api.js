/**
 * xAI API 통신 모듈
 */

const API_BASE_URL = 'https://api.x.ai/v1/responses';

/**
 * 스트리밍 채팅 응답 처리
 * @param {Array} messages - 메시지 배열
 * @param {string} apiKey - API 키
 * @param {string} modelName - 모델 이름
 * @param {Function} onDelta - 델타 콜백 (text) => void
 * @param {Function} onComplete - 완료 콜백 (fullText) => void
 * @param {Function} onError - 에러 콜백 (error) => void
 */
export async function streamChatResponse(messages, apiKey, modelName, onDelta, onComplete, onError) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        input: messages,
        model: modelName,
        stream: true
      })
    });

    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      if (response.status === 404) {
        errorMessage += ' - 모델을 찾을 수 없습니다. 설정에서 모델 이름을 확인해주세요.';
      } else if (response.status === 401) {
        errorMessage += ' - API 키가 유효하지 않습니다.';
      } else if (response.status === 429) {
        errorMessage += ' - 요청 한도를 초과했습니다.';
      } else {
        errorMessage += ` - ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // 스트리밍 응답 처리
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const json = JSON.parse(data);
            let delta = '';
            
            // 다양한 응답 형식 지원
            if (json.choices && json.choices[0]?.delta?.content) {
              delta = json.choices[0].delta.content;
            } else if (json.output) {
              delta = json.output;
            } else if (json.content) {
              delta = json.content;
            } else if (json.text) {
              delta = json.text;
            }
            
            if (delta) {
              fullResponse += delta;
              if (onDelta) onDelta(delta, fullResponse);
            }
          } catch (e) {
            console.warn('JSON 파싱 오류:', e);
          }
        }
      }
    }
    
    if (onComplete) onComplete(fullResponse);
    return fullResponse;
  } catch (error) {
    console.error('API 호출 오류:', error);
    if (onError) onError(error);
    throw error;
  }
}

/**
 * 메시지 요약 (비스트리밍)
 * @param {Array} oldMessages - 요약할 메시지 배열
 * @param {string} apiKey - API 키
 * @param {string} modelName - 모델 이름
 * @returns {Promise<string>} 요약된 텍스트
 */
export async function summarizeMessages(oldMessages, apiKey, modelName) {
  if (!oldMessages || oldMessages.length === 0) return '';
  
  const summaryPrompt = `다음 대화 내용을 간단히 요약해주세요. 중요한 정보, 맥락, 사용자의 선호도나 특별한 요구사항만 포함하세요. 불필요한 세부사항은 생략하세요:\n\n${oldMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`;
  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        input: [{ role: 'user', content: summaryPrompt }],
        model: modelName,
        stream: false
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.output || data.content || data.text || '';
    }
  } catch (e) {
    console.warn('요약 실패:', e);
  }
  return '';
}

/**
 * 에러 메시지 포맷팅
 * @param {Error} error - 에러 객체
 * @returns {string} 포맷된 에러 메시지
 */
export function formatErrorMessage(error) {
  let errorText = `오류가 발생했습니다: ${error.message}`;
  
  if (error.message.includes('404')) {
    errorText += '\n\n⚠️ 모델 이름이 잘못되었거나 해당 모델에 접근 권한이 없을 수 있습니다.';
    errorText += '\n\n다음을 확인해주세요:';
    errorText += '\n1. xAI API 대시보드에서 사용 가능한 모델 확인';
    errorText += '\n2. 설정에서 다른 모델 선택 시도';
    errorText += '\n3. API 키가 올바른지 확인';
    errorText += '\n4. 계정에 충분한 크레딧이 있는지 확인';
  } else if (error.message.includes('400')) {
    errorText += '\n\n⚠️ 요청 형식이 잘못되었습니다.';
    errorText += '\n\n다음을 확인해주세요:';
    errorText += '\n1. 메시지 내용이 비어있지 않은지 확인';
    errorText += '\n2. 모델 이름이 올바른지 확인';
    errorText += '\n3. API 키가 올바른지 확인';
    errorText += '\n4. 프롬프트가 너무 길지 않은지 확인';
  } else if (error.message.includes('401')) {
    errorText += '\n\n⚠️ API 키가 유효하지 않습니다.';
  } else if (error.message.includes('429')) {
    errorText += '\n\n⚠️ 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
  }
  
  return errorText;
}

