/**
 * 캐릭터 추가/편집 폼 컴포넌트
 */

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { validateCharacter, createDefaultCharacter } from './characterSchema.js';

const PERSONALITY_OPTIONS = [
  { value: 'warm', label: '공감형 (따뜻함)' },
  { value: 'playful', label: '활발형 (장난기)' },
  { value: 'caring', label: '배려형 (세심함)' }
];

const COLOR_OPTIONS = [
  { value: 'bg-pink-500', label: '핑크' },
  { value: 'bg-purple-500', label: '퍼플' },
  { value: 'bg-blue-400', label: '블루' },
  { value: 'bg-red-500', label: '레드' },
  { value: 'bg-green-500', label: '그린' },
  { value: 'bg-yellow-500', label: '옐로우' },
  { value: 'bg-indigo-500', label: '인디고' },
  { value: 'bg-gray-500', label: '그레이' }
];

export default function CharacterForm({ character, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(character || createDefaultCharacter());
  const [errors, setErrors] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (character) {
      setFormData(character);
      if (character.image) {
        setImagePreview(character.image);
      }
    }
  }, [character]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 초기화
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setImagePreview(dataUrl);
        handleChange('image', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateCharacter(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    
    onSubmit(formData);
  };

  const handleInterestsChange = (value) => {
    const interests = value.split(',').map(i => i.trim()).filter(i => i);
    handleChange('interests', interests);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {character ? '캐릭터 편집' : '새 캐릭터 추가'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 프로필 이미지 */}
          <div>
            <label className="block text-sm font-semibold mb-2">프로필 이미지</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full ${formData.color} flex items-center justify-center text-white text-2xl font-bold`}>
                    {formData.name[0] || '?'}
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
            </div>
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-semibold mb-2">이름 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
              placeholder="예: 송지은"
              required
            />
          </div>

          {/* 사용자명 */}
          <div>
            <label className="block text-sm font-semibold mb-2">사용자명 *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
              placeholder="예: jieun_love"
              required
            />
          </div>

          {/* 나이 */}
          <div>
            <label className="block text-sm font-semibold mb-2">나이 *</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
              min="1"
              max="100"
              required
            />
          </div>

          {/* 성격 */}
          <div>
            <label className="block text-sm font-semibold mb-2">성격 *</label>
            <select
              value={formData.personality}
              onChange={(e) => handleChange('personality', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
              required
            >
              {PERSONALITY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold mb-2">카테고리</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
              placeholder="예: 공감형"
            />
          </div>

          {/* 소개 */}
          <div>
            <label className="block text-sm font-semibold mb-2">소개</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
              rows="3"
              placeholder="캐릭터 소개를 입력하세요"
            />
          </div>

          {/* 관심사 */}
          <div>
            <label className="block text-sm font-semibold mb-2">관심사 (쉼표로 구분)</label>
            <input
              type="text"
              value={formData.interests?.join(', ') || ''}
              onChange={(e) => handleInterestsChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
              placeholder="예: 영화, 음악, 산책"
            />
          </div>

          {/* 색상 */}
          <div>
            <label className="block text-sm font-semibold mb-2">프로필 색상</label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('color', opt.value)}
                  className={`h-10 rounded-lg ${opt.value} ${formData.color === opt.value ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                  title={opt.label}
                />
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

