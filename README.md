# GFSTAGRAM

Instagram 스타일의 메시징 앱으로, Grok AI와 채팅할 수 있는 기능을 제공합니다.

## 주요 기능

- 📱 인박스 뷰: 친구 목록 및 메시지 관리
- 💬 채팅 뷰: 실시간 메시징 인터페이스
- 👤 프로필 뷰: 사용자 프로필 정보
- 📸 카메라: 사진 촬영 및 공유
- 🎤 음성 녹음: 음성 메시지 전송
- 🖼️ 이미지 공유: 갤러리에서 이미지 선택
- 😊 이모지 피커: 빠른 이모지 입력
- ⚙️ 설정: xAI API 키 설정

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 기술 스택

- React 18
- Vite
- Tailwind CSS
- Lucide React (아이콘)
- Zustand (상태 관리)
- xAI API (Grok AI)

## 주요 기능 (상세)

- 📱 **인박스 뷰**: 친구 목록 및 메시지 관리
- 💬 **채팅 뷰**: 실시간 메시징 인터페이스 (스트리밍 응답)
- 👤 **프로필 뷰**: 사용자 프로필 정보 및 게시물
- 📸 **카메라**: 사진 촬영 및 공유
- 🎤 **음성 녹음**: 음성 메시지 전송
- 🖼️ **이미지 공유**: 갤러리에서 이미지 선택
- 😊 **이모지 피커**: 빠른 이모지 입력
- ⚙️ **설정**: xAI API 키 설정
- ➕ **캐릭터 관리**: 캐릭터 추가/편집/삭제 기능
- 🔍 **RAG 기반 토큰 최적화**: 관련 메시지만 선택적으로 포함하여 토큰 사용량 최적화

## 사용 방법

1. 인박스에서 친구를 선택하여 채팅 시작
2. 설정 아이콘을 클릭하여 xAI API 키 입력 (Grok AI 사용 시)
3. 카메라, 음성, 이미지, 텍스트 메시지 전송 가능
4. 프로필 아이콘을 클릭하여 사용자 정보 확인
5. "+" 버튼을 클릭하여 새 캐릭터 추가

## 배포

이 프로젝트는 [Vercel](https://vercel.com)을 통해 배포됩니다.

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 배포 상태

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/a4file/GFSTAGRAM)

## 프로젝트 구조

```
src/
├── ai/                    # AI 관련 모듈
│   ├── api.js            # xAI API 통신
│   ├── promptBuilder.js  # 프롬프트 생성
│   ├── memoryManager.js  # 대화 히스토리 관리 (RAG 통합)
│   └── rag.js            # RAG 검색 (하이브리드 방식)
├── features/              # 기능별 모듈
│   ├── character/        # 캐릭터 관리
│   ├── chat/             # 채팅 기능
│   ├── inbox/            # 인박스 뷰
│   └── profile/          # 프로필 뷰
├── hooks/                # 커스텀 훅
├── stores/               # 상태 관리 (Zustand)
└── utils/                # 유틸리티 함수
```

## 라이선스

MIT License

