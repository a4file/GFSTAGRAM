/**
 * 토큰 사용량 추적 훅
 */

import { useState, useEffect } from 'react';
import { estimateMessageTokens, calculateUsageRate } from '../utils/tokenCounter.js';

/**
 * 토큰 사용량 추적 커스텀 훅
 * @param {Array} messages - 메시지 배열
 * @param {number} maxTokens - 최대 토큰 수 (기본값: 128000)
 * @returns {Object} 토큰 사용량 정보
 */
export function useTokenTracker(messages = [], maxTokens = 128000) {
  const [tokenInfo, setTokenInfo] = useState({
    used: 0,
    max: maxTokens,
    usageRate: 0,
    warning: false
  });
  
  useEffect(() => {
    if (!Array.isArray(messages)) {
      setTokenInfo({
        used: 0,
        max: maxTokens,
        usageRate: 0,
        warning: false
      });
      return;
    }
    
    const used = estimateMessageTokens(messages);
    const usageRate = calculateUsageRate(used, maxTokens);
    const warning = usageRate > 0.8; // 80% 이상 사용 시 경고
    
    setTokenInfo({
      used,
      max: maxTokens,
      usageRate,
      warning
    });
  }, [messages, maxTokens]);
  
  return tokenInfo;
}

