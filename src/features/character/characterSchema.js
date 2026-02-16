/**
 * 캐릭터 데이터 스키마 및 검증
 */

/**
 * 기본 캐릭터 데이터
 */
export const defaultCharacters = [
  { 
    id: 'jieun', 
    name: '송지은', 
    username: 'jieun_love', 
    lastMsg: '오늘 하루는 어땠어?', 
    time: '1분', 
    online: true, 
    color: 'bg-pink-500', 
    posts: 6, 
    followers: '125', 
    following: '89', 
    bio: '괜찮지 않아도 괜찮은 하루 🌿\n 영화처럼, 음악처럼, 천천히', 
    category: '공감형',
    personality: 'warm',
    age: 25,
    interests: ['영화', '음악', '산책'],
    image: '/images/profiles/jieun.jpg'
  },
  { 
    id: 'mina', 
    name: '신민아', 
    username: 'mina_cute', 
    lastMsg: '헤이! 오늘 뭐해?', 
    time: '5분', 
    online: true, 
    color: 'bg-purple-500', 
    posts: 6, 
    followers: '311', 
    following: '156', 
    bio: '재밌는 거 좋아해 😄',
    category: '활발형',
    personality: 'playful',
    age: 23,
    interests: ['게임', '운동', '요리'],
    image: '/images/profiles/mina.jpg'
  },
  { 
    id: 'jisoo', 
    name: '한지수', 
    username: 'jisoo_care', 
    lastMsg: '밥은 제대로 먹었어?', 
    time: '10분', 
    online: true, 
    color: 'bg-blue-400', 
    posts: 6, 
    followers: '67', 
    following: '67', 
    bio: '잘 먹고 잘 쉬는 게 제일 중요해\n같이 천천히 가자',
    category: '배려형',
    personality: 'caring',
    age: 26,
    interests: ['독서', '요리', '여행'],
    image: '/images/profiles/jisoo.jpg'
  },
];

/**
 * 캐릭터 생성 시 기본값
 */
export function createDefaultCharacter() {
  return {
    id: `character_${Date.now()}`,
    name: '',
    username: '',
    lastMsg: '',
    time: '방금',
    online: true,
    color: 'bg-gray-500',
    posts: 0,
    followers: '0',
    following: '0',
    bio: '',
    category: '',
    personality: 'warm',
    age: 25,
    interests: [],
    image: null
  };
}

/**
 * 캐릭터 유효성 검사
 * @param {Object} character - 캐릭터 객체
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateCharacter(character) {
  const errors = [];
  
  if (!character.name || character.name.trim().length === 0) {
    errors.push('이름을 입력해주세요.');
  }
  
  if (!character.username || character.username.trim().length === 0) {
    errors.push('사용자명을 입력해주세요.');
  }
  
  if (!character.personality || !['warm', 'playful', 'caring'].includes(character.personality)) {
    errors.push('올바른 성격을 선택해주세요.');
  }
  
  if (!character.age || character.age < 1 || character.age > 100) {
    errors.push('올바른 나이를 입력해주세요.');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

