/**
 * 프로필 뷰 컴포넌트
 */

import React, { useState } from 'react';
import { ArrowLeft, MoreHorizontal, CheckCircle2, User, Heart, MessageCircle, X } from 'lucide-react';

// 게시물 데이터는 임시로 여기에 포함 (나중에 별도 스토어로 분리 가능)
const defaultPostsData = {
  jieun: [
    { id: 1, image: '/images/posts/jieun/post6.jpg', gradient: 'from-pink-200 via-pink-300 to-pink-400', caption: '오늘도 평범한 하루였지만, 작은 행복들을 모아봤어 🌿', likes: 23, comments: 5, time: '2일 전' },
    { id: 2, image: '/images/posts/jieun/post5.jpg', gradient: 'from-purple-200 via-pink-300 to-rose-300', caption: '영화관에서 혼자 본 영화가 생각보다 좋았어', likes: 18, comments: 3, time: '5일 전' },
    { id: 3, image: '/images/posts/jieun/post4.jpg', gradient: 'from-blue-200 via-indigo-300 to-purple-300', caption: '비 오는 날엔 이런 분위기가 좋아', likes: 31, comments: 7, time: '1주 전' },
    { id: 4, image: '/images/posts/jieun/post3.jpg', gradient: 'from-rose-200 via-pink-300 to-pink-400', caption: '음악 들으면서 산책하는 게 최고야', likes: 27, comments: 4, time: '1주 전' },
    { id: 5, image: '/images/posts/jieun/post2.jpg', gradient: 'from-pink-300 via-rose-300 to-pink-400', caption: '오늘 하루도 수고했어', likes: 19, comments: 2, time: '2주 전' },
    { id: 6, image: '/images/posts/jieun/post1.jpg', gradient: 'from-indigo-200 via-purple-300 to-pink-300', caption: '천천히, 하지만 꾸준히', likes: 25, comments: 6, time: '2주 전' },
  ],
  mina: [
    { id: 1, image: '/images/posts/mina/post6.jpg', gradient: 'from-purple-300 via-purple-400 to-purple-500', caption: '오늘도 재밌게 놀았어!', likes: 45, comments: 8, time: '1일 전' },
    { id: 2, image: '/images/posts/mina/post5.jpg', gradient: 'from-pink-300 via-purple-400 to-indigo-400', caption: 'T1이 이겼다! 승리!', likes: 38, comments: 5, time: '3일 전' },
    { id: 3, image: '/images/posts/mina/post4.jpg', gradient: 'from-purple-400 via-pink-400 to-purple-500', caption: '운동하고 나니까 기분 최고', likes: 42, comments: 9, time: '5일 전' },
    { id: 4, image: '/images/posts/mina/post3.jpg', gradient: 'from-indigo-300 via-purple-400 to-pink-400', caption: '요리 도전! 맛있게 나왔어', likes: 35, comments: 6, time: '1주 전' },
    { id: 5, image: '/images/posts/mina/post2.jpg', gradient: 'from-purple-300 via-pink-300 to-purple-400', caption: '친구들과 만나서 즐거웠어', likes: 29, comments: 4, time: '1주 전' },
    { id: 6, image: '/images/posts/mina/post1.jpg', gradient: 'from-pink-400 via-purple-400 to-indigo-400', caption: '오늘도 에너지 넘치는 하루!', likes: 33, comments: 7, time: '2주 전' },
  ],
  jisoo: [
    { id: 1, image: '/images/posts/jisoo/post6.jpg', gradient: 'from-blue-300 via-blue-400 to-cyan-400', caption: '밥 잘 챙겨먹고 있어? 건강이 최고야', likes: 28, comments: 4, time: '1일 전' },
    { id: 2, image: '/images/posts/jisoo/post5.jpg', gradient: 'from-cyan-300 via-blue-400 to-blue-500', caption: '오늘 읽은 책이 인상 깊었어', likes: 22, comments: 3, time: '3일 전' },
    { id: 3, image: '/images/posts/jisoo/post4.jpg', gradient: 'from-blue-400 via-cyan-400 to-blue-500', caption: '요리하면서 마음이 편안해져', likes: 26, comments: 5, time: '5일 전' },
    { id: 4, image: '/images/posts/jisoo/post3.jpg', gradient: 'from-sky-300 via-blue-400 to-cyan-400', caption: '여행 계획 세우는 중! 기대돼', likes: 31, comments: 6, time: '1주 전' },
    { id: 5, image: '/images/posts/jisoo/post2.jpg', gradient: 'from-blue-300 via-sky-400 to-blue-400', caption: '잘 쉬는 것도 중요해', likes: 24, comments: 3, time: '1주 전' },
    { id: 6, image: '/images/posts/jisoo/post1.jpg', gradient: 'from-cyan-400 via-blue-400 to-sky-400', caption: '천천히 가도 괜찮아. 우리 함께', likes: 27, comments: 5, time: '2주 전' },
  ],
};

export default function ProfileView({ character, onBack, onOpenChat, onPostClick }) {
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const postsData = defaultPostsData[character?.id] || [];

  if (!character) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">캐릭터를 선택해주세요.</p>
      </div>
    );
  }

  return (
    <>
      {/* 프로필 이미지 확대 뷰 */}
      {showProfileImage && selectedProfileImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 safe-area-inset"
          onClick={() => {
            setShowProfileImage(false);
            setSelectedProfileImage(null);
          }}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedProfileImage}
              alt="프로필 확대"
              className="max-w-full max-h-[80dvh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => {
                setShowProfileImage(false);
                setSelectedProfileImage(null);
              }}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full w-full max-w-md mx-auto bg-white border-x border-gray-200 shadow-xl font-sans text-gray-900 overflow-hidden overflow-y-auto">
        <header className="px-4 py-3 flex items-center justify-between sticky top-0 bg-white border-b z-10 safe-area-top">
          <div className="flex items-center gap-8">
            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <div className="flex items-center gap-1">
              <h1 className="text-lg font-bold">{character.username}</h1>
              <CheckCircle2 className="w-4 h-4 text-blue-500 fill-current" />
            </div>
          </div>
          <MoreHorizontal className="w-6 h-6" />
        </header>
        <main className="p-4">
          <div className="flex items-center justify-between mb-4">
            {character.image ? (
              <img
                src={character.image}
                alt={character.name}
                className="w-20 h-20 rounded-full object-cover shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                style={{ imageRendering: 'high-quality', minWidth: '80px', minHeight: '80px' }}
                onClick={() => {
                  setSelectedProfileImage(character.image);
                  setShowProfileImage(true);
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className={`w-20 h-20 rounded-full ${character.color} flex items-center justify-center text-white text-3xl font-bold shadow-md ${character.image ? 'hidden' : ''}`}>
              {character.name[0]}
            </div>
            <div className="flex flex-1 justify-around text-center ml-4">
              <div><p className="font-bold">{character.posts || 0}</p><p className="text-xs text-gray-500">게시물</p></div>
              <div><p className="font-bold">{character.followers || '0'}</p><p className="text-xs text-gray-500">팔로워</p></div>
              <div><p className="font-bold">{character.following || '0'}</p><p className="text-xs text-gray-500">팔로잉</p></div>
            </div>
          </div>
          <div className="space-y-0.5 mb-6">
            <p className="text-sm font-bold">{character.name}</p>
            <p className="text-sm text-gray-400">{character.category || ''}</p>
            <p className="text-sm leading-snug whitespace-pre-line">{character.bio || ''}</p>
          </div>
          <div className="flex gap-2 mb-8">
            <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-sm font-bold">팔로잉</button>
            <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-sm font-bold" onClick={onOpenChat}>
              메시지
            </button>
            <button className="bg-gray-100 px-2 rounded-lg">
              <User className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {postsData.map(post => (
              <div
                key={post.id}
                className="aspect-square cursor-pointer hover:opacity-90 transition-opacity relative group overflow-hidden"
                onClick={() => {
                  if (onPostClick) {
                    onPostClick({ ...post, friend: character });
                  }
                }}
              >
                {post.image ? (
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${post.gradient || character.color} flex items-center justify-center`}>
                    <div className="text-white/30 text-4xl font-bold">
                      {character.name[0]}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-4 text-white transform group-hover:scale-100 scale-90 transition-all">
                    <div className="flex items-center gap-1">
                      <Heart className="w-5 h-5 fill-current" />
                      <span className="text-sm font-semibold">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5 fill-current" />
                      <span className="text-sm font-semibold">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

