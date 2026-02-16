/**
 * 설정 상태 관리 스토어 (Zustand)
 */

import { create } from 'zustand';
import { storage } from '../utils/storage.js';

const useSettingsStore = create((set) => ({
  // 초기 상태: localStorage에서 불러오기
  apiKey: (() => {
    const settings = storage.getSettings();
    return settings.apiKey || localStorage.getItem('xai_api_key') || '';
  })(),
  
  modelName: (() => {
    const settings = storage.getSettings();
    return settings.modelName || localStorage.getItem('xai_model_name') || 'grok-4-1-fast-reasoning';
  })(),
  
  // API 키 설정
  setApiKey: (apiKey) => {
    set({ apiKey });
    localStorage.setItem('xai_api_key', apiKey);
    const settings = storage.getSettings();
    storage.setSettings({ ...settings, apiKey });
  },
  
  // 모델명 설정
  setModelName: (modelName) => {
    set({ modelName });
    localStorage.setItem('xai_model_name', modelName);
    const settings = storage.getSettings();
    storage.setSettings({ ...settings, modelName });
  },
}));

export default useSettingsStore;

