/**
 * 모바일 뷰포트 훅
 * 모바일 브라우저 주소창 높이 변화 대응
 */

import { useState, useEffect } from 'react';

/**
 * 모바일 뷰포트 높이 관리
 * @returns {number} 현재 뷰포트 높이
 */
export function useMobileViewport() {
  const [viewportHeight, setViewportHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight;
    }
    return 0;
  });

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    // 초기 설정
    updateViewportHeight();

    // 리사이즈 이벤트
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    // 모바일 브라우저 주소창 변화 감지
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewportHeight, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return viewportHeight;
}

/**
 * 모바일 키보드 감지
 * @returns {boolean} 키보드가 올라와 있는지 여부
 */
export function useMobileKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const initialHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      // 뷰포트 높이가 150px 이상 줄어들면 키보드가 올라온 것으로 간주
      setIsKeyboardOpen(currentHeight < initialHeight - 150);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialHeight]);

  return isKeyboardOpen;
}

