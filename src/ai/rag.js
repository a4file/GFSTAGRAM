/**
 * RAG (Retrieval-Augmented Generation) 모듈
 * 하이브리드 방식: 키워드 기반 + 의미 기반 검색
 */

/**
 * 메시지에서 키워드 추출
 * @param {string} message - 메시지 텍스트
 * @returns {Array<string>} 키워드 배열
 */
export function extractKeywords(message) {
  if (!message || typeof message !== 'string') return [];
  
  // 불용어 제거
  const stopWords = ['은', '는', '이', '가', '을', '를', '에', '의', '와', '과', '도', '로', '으로', 
                     '에서', '에게', '께', '한테', '더', '또', '그', '저', '이', '그것', '저것',
                     'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had'];
  
  // 한글 단어 추출 (2글자 이상)
  const koreanWords = message.match(/[가-힣]{2,}/g) || [];
  
  // 영어 단어 추출 (3글자 이상)
  const englishWords = message.match(/[a-zA-Z]{3,}/g) || [];
  
  // 숫자 제외, 소문자 변환
  const allWords = [...koreanWords, ...englishWords.map(w => w.toLowerCase())]
    .filter(word => word.length >= 2 && !stopWords.includes(word));
  
  // 중복 제거
  return [...new Set(allWords)];
}

/**
 * 키워드 인덱스 생성
 * @param {Array} chatHistory - 채팅 히스토리
 * @returns {Map} 키워드 -> 메시지 ID 배열 맵
 */
export function buildKeywordIndex(chatHistory) {
  const index = new Map();
  
  if (!Array.isArray(chatHistory)) return index;
  
  chatHistory.forEach((msg, idx) => {
    const content = msg.text || msg.content || '';
    if (!content || msg.sender === 'bot') return; // 봇 메시지는 제외하거나 선택적으로 포함
    
    const keywords = extractKeywords(content);
    keywords.forEach(keyword => {
      if (!index.has(keyword)) {
        index.set(keyword, []);
      }
      index.get(keyword).push(idx);
    });
  });
  
  return index;
}

/**
 * 키워드 기반 검색
 * @param {string} query - 검색 쿼리
 * @param {Map} keywordIndex - 키워드 인덱스
 * @param {Array} chatHistory - 채팅 히스토리
 * @param {number} topK - 상위 K개 결과
 * @returns {Array} 관련 메시지 인덱스 배열
 */
export function searchByKeywords(query, keywordIndex, chatHistory, topK = 5) {
  if (!query || !keywordIndex || !chatHistory) return [];
  
  const queryKeywords = extractKeywords(query);
  const scoreMap = new Map(); // 인덱스 -> 점수
  
  queryKeywords.forEach(keyword => {
    const indices = keywordIndex.get(keyword) || [];
    indices.forEach(idx => {
      scoreMap.set(idx, (scoreMap.get(idx) || 0) + 1);
    });
  });
  
  // 점수순 정렬
  const sorted = Array.from(scoreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .map(([idx]) => idx);
  
  return sorted;
}

/**
 * 간단한 텍스트 유사도 계산 (Jaccard 유사도 기반)
 * @param {string} text1 - 첫 번째 텍스트
 * @param {string} text2 - 두 번째 텍스트
 * @returns {number} 유사도 (0-1)
 */
export function calculateSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  
  const words1 = new Set(extractKeywords(text1));
  const words2 = new Set(extractKeywords(text2));
  
  if (words1.size === 0 && words2.size === 0) return 1;
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * 의미 기반 검색
 * @param {string} query - 검색 쿼리
 * @param {Array} chatHistory - 채팅 히스토리
 * @param {number} topK - 상위 K개 결과
 * @returns {Array} 관련 메시지 인덱스 배열
 */
export function searchBySemantic(query, chatHistory, topK = 5) {
  if (!query || !Array.isArray(chatHistory)) return [];
  
  const scores = chatHistory.map((msg, idx) => {
    const content = msg.text || msg.content || '';
    if (!content) return { idx, score: 0 };
    
    const similarity = calculateSimilarity(query, content);
    return { idx, score: similarity };
  });
  
  return scores
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.idx);
}

/**
 * RAG 기반 관련 컨텍스트 검색 (하이브리드)
 * @param {string} query - 현재 사용자 메시지
 * @param {Array} chatHistory - 전체 채팅 히스토리
 * @param {string} characterId - 캐릭터 ID
 * @param {number} maxTokens - 최대 토큰 수
 * @param {number} recentCount - 최근 메시지 개수 (제외할 개수)
 * @returns {Array} 관련 메시지 배열 (역순, 최신 우선)
 */
export function retrieveRelevantContext(query, chatHistory, characterId, maxTokens = 10000, recentCount = 8) {
  if (!query || !Array.isArray(chatHistory) || chatHistory.length <= recentCount) {
    return [];
  }
  
  // 최근 메시지는 제외 (이미 포함될 예정)
  const oldHistory = chatHistory.slice(0, -recentCount);
  if (oldHistory.length === 0) return [];
  
  // 키워드 인덱스 생성
  const keywordIndex = buildKeywordIndex(oldHistory);
  
  // 키워드 검색
  const keywordResults = searchByKeywords(query, keywordIndex, oldHistory, 10);
  
  // 의미 기반 검색
  const semanticResults = searchBySemantic(query, oldHistory, 10);
  
  // 결과 병합 및 중복 제거
  const combinedIndices = new Set([...keywordResults, ...semanticResults]);
  
  // 인덱스를 시간순으로 정렬 (최신 우선)
  const sortedIndices = Array.from(combinedIndices)
    .sort((a, b) => b - a)
    .slice(0, 20); // 최대 20개까지
  
  // 메시지 변환 및 토큰 제한 확인
  const relevantMessages = [];
  let tokenCount = 0;
  
  for (const idx of sortedIndices) {
    const msg = oldHistory[idx];
    if (!msg) continue;
    
    const content = msg.text || msg.content || '';
    if (!content) continue;
    
    // 간단한 토큰 추정 (한글 1자 ≈ 1.5 토큰)
    const estimatedTokens = Math.ceil(content.length * 1.5) + 10; // 오버헤드 포함
    
    if (tokenCount + estimatedTokens <= maxTokens) {
      relevantMessages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: content
      });
      tokenCount += estimatedTokens;
    } else {
      break;
    }
  }
  
  // 시간순 정렬 (오래된 것부터)
  return relevantMessages.reverse();
}

