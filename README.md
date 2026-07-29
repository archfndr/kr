# ARCHFNDR v1

## GitHub Pages 업로드
1. ZIP 압축 해제
2. 저장소에서 Add file → Upload files
3. 파일 전부 업로드 후 Commit changes
4. Settings → Pages → Deploy from a branch
5. main / root 선택

## 새 곡 추가
1. 커버 이미지를 assets 폴더에 업로드
2. songs.js 배열 맨 위에 아래 형식으로 추가

```js
{
  date: "2026-07-30",
  title: "곡 제목",
  artist: "아티스트",
  album: "앨범명",
  released: "발매연도",
  cover: "assets/new-cover.jpg",
  comment: "한 줄 코멘트",
  description: `추가 코멘트`,
  spotify: "Spotify 링크",
  apple: "Apple Music 링크",
  youtube: "YouTube 링크"
},
```

맨 위 곡이 Today's Pick, 이전 곡은 Archive에 자동 표시됩니다.
