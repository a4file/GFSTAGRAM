# 게시글 이미지 폴더

이 폴더에 각 프로필의 게시글 이미지를 저장하세요.

## 폴더 구조:
```
posts/
  ├── jieun/     # 송지은의 게시글 이미지
  │   ├── post1.jpg
  │   ├── post2.jpg
  │   └── ...
  ├── mina/      # 신민아의 게시글 이미지
  │   ├── post1.jpg
  │   ├── post2.jpg
  │   └── ...
  └── jisoo/     # 한지수의 게시글 이미지
      ├── post1.jpg
      ├── post2.jpg
      └── ...
```

## 사용 방법:

1. 이미지 파일을 해당 프로필 폴더에 저장하세요.
   - 예: `public/images/posts/jieun/post1.jpg`

2. `src/App.jsx` 파일의 `postsData`에서 이미지 경로를 설정하세요:
   ```javascript
   { 
     id: 1, 
     image: '/images/posts/jieun/post1.jpg',  // 이미지 경로 설정
     gradient: 'from-pink-200 via-pink-300 to-pink-400',
     caption: '게시글 내용...',
     likes: 23,
     comments: 5,
     time: '2일 전'
   }
   ```

3. `image: null`로 설정하면 그라데이션 배경이 표시됩니다.

## 이미지 권장 사양:
- 형식: JPG, PNG
- 크기: 정사각형 권장 (예: 1080x1080px)
- 용량: 500KB 이하 권장

