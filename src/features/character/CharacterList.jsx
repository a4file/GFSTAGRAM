/**
 * 캐릭터 목록 컴포넌트
 */

import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import useCharacterStore from './characterStore.js';
import CharacterForm from './CharacterForm.jsx';

export default function CharacterList({ onSelectCharacter, onClose }) {
  const { characters, deleteCharacter } = useCharacterStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);

  const handleAdd = () => {
    setEditingCharacter(null);
    setShowForm(true);
  };

  const handleEdit = (character) => {
    setEditingCharacter(character);
    setShowForm(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('이 캐릭터를 삭제하시겠습니까?')) {
      deleteCharacter(id);
    }
  };

  const handleFormSubmit = (formData) => {
    const { addCharacter, updateCharacter } = useCharacterStore.getState();
    
    if (editingCharacter) {
      updateCharacter(editingCharacter.id, formData);
    } else {
      addCharacter(formData);
    }
    
    setShowForm(false);
    setEditingCharacter(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 safe-area-inset">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90dvh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">캐릭터 관리</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAdd}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="캐릭터 추가"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
            {characters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>캐릭터가 없습니다.</p>
                <p className="text-sm mt-2">+ 버튼을 눌러 캐릭터를 추가하세요.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {characters.map(character => (
                  <div
                    key={character.id}
                    onClick={() => {
                      if (onSelectCharacter) {
                        onSelectCharacter(character);
                        onClose();
                      }
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100"
                  >
                    <div className="relative">
                      {character.image ? (
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full ${character.color} flex items-center justify-center text-white font-bold`}>
                          {character.name[0]}
                        </div>
                      )}
                      {character.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{character.name}</p>
                      <p className="text-xs text-gray-500 truncate">@{character.username}</p>
                      <p className="text-xs text-gray-400 truncate">{character.category}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(character);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded-full"
                        title="편집"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(character.id, e)}
                        className="p-1.5 hover:bg-red-100 rounded-full"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <CharacterForm
          character={editingCharacter}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCharacter(null);
          }}
        />
      )}
    </>
  );
}

