# ARCHFNDR

GitHub Pages: `main` / root (`archfndr.kr`).

## 편집 언어
- 메뉴, 카테고리, 버튼은 영어로 유지한다.
- 곡·앨범 이름과 아티스트 이름은 원어를 유지한다.
- 소개, 훅, 큐레이션 본문은 한국어로 작성한다. 번역 버전은 별도로 만들지 않는다.

## 콘텐츠 추가
`songs.js`의 `window.ARCHFNDR_TRACKS` 배열에 고유 id와 slug를 지정한다. `comment`와 `description`은 한국어 문자열, 긴 본문 `story`는 한국어 문자열 배열이다. 장르와 커버, 플랫폼 링크를 지정한다. 앨범은 `kind: 'album'`을 지정한다. 기존 추천 로직은 한국 날짜를 기준으로 순환한다.

## CONTEXT
`/context/`에는 FEATURE(심층 탐구), REVIEW(독자 비평), REFERENCE(외부 자료)를 둔다. 앨범 상세에는 짧은 소개와 `context` 배열로 연결된 글만 표시한다. REVIEW는 작성자가 직접 완성한 비평만 게시한다. 사진과 원문은 출처를 표시하며 사용 권한을 확인한다.
