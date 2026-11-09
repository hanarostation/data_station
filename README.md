# Data Station 홈페이지

AX/DX 데이터 분석 컨설팅 & 교육 — Data Station 공식 홈페이지 소스입니다.
빌드 과정 없이 HTML/CSS/JS 파일 그대로 GitHub Pages에 올려 사용할 수 있습니다.

- 반응형 (PC · 태블릿 · 모바일)
- 주간/야간 모드 (우측 상단 버튼, 기기 설정 자동 반영)
- 커스텀 도메인 `www.data-station.co.kr` 연결용 `CNAME` 포함

## 폴더 구조

```
index.html          Home
about.html          About (이력 · 프로젝트 · 논문 · 자격)
education.html      AX/DX Education (강의 이력·분야 / 커리큘럼 예시)
consulting.html     Consulting (방법론 · 사례 · 국방/정보 분석)
superschool.html    SuperSchool
dsa.html            DSA (Data Station Academy)
contact.html        Contact (문의 폼)
404.html            없는 주소 안내
assets/css/style.css
assets/js/main.js
assets/fonts/pretendard  Pretendard 글꼴 (SIL OFL, 사이트에 직접 포함)
assets/img/brand     로고 · 파비콘 · 공유 이미지(og.png)
assets/img/partners  협력사 로고
assets/img/photos    강의·현장 사진
assets/img/cases     컨설팅 보고서 캡처
CNAME               커스텀 도메인 (www.data-station.co.kr)
.nojekyll           GitHub Pages의 Jekyll 처리 끄기
robots.txt · sitemap.xml
```

## 1. GitHub에 올리기

1. GitHub에서 새 저장소를 만듭니다. (예: `data-station-kor/homepage`)
2. 이 폴더의 **모든 파일**(숨김 파일 `.nojekyll` 포함)을 저장소 최상위에 올립니다.
   ```bash
   git init
   git add .
   git commit -m "Data Station homepage"
   git branch -M main
   git remote add origin https://github.com/<계정>/<저장소>.git
   git push -u origin main
   ```
3. 저장소 **Settings → Pages** 에서
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)` → Save
4. 같은 화면 **Custom domain** 에 `www.data-station.co.kr` 입력 → Save
   (저장소의 `CNAME` 파일과 같은 값이어야 합니다.)

## 2. 가비아 도메인 연결

> 현재 도메인이 다른 홈페이지 제작 서비스에 연결되어 있다면, 먼저 그 서비스에서 도메인 연결을 해제하고
> 네임서버가 가비아 기본값(`ns.gabia.co.kr`, `ns1.gabia.co.kr`, `ns.gabia.net`)인지 확인하세요.
> 네임서버가 다른 곳을 가리키고 있으면 가비아 DNS 설정이 반영되지 않습니다.

**My가비아 → 서비스 관리 → 도메인 → DNS 관리 → DNS 설정** 에서 기존 `@`, `www` 레코드를 지우고 아래처럼 추가합니다.

| 타입 | 호스트 | 값/위치 | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |
| CNAME | www | `<GitHub계정>.github.io.` | 3600 |

- CNAME 값에는 저장소 이름 없이 `계정명.github.io.` 만 입력합니다. (가비아는 끝에 점 `.` 을 붙여 입력)
- A 레코드는 `data-station.co.kr` 로 접속해도 `www` 주소로 넘어가게 해 줍니다.
- 반영까지 보통 수십 분, 길게는 24~48시간이 걸립니다.
- 연결이 확인되면 GitHub **Settings → Pages → Enforce HTTPS** 를 체크합니다.
- (권장) GitHub 계정 **Settings → Pages → Verified domains** 에서 도메인 소유 확인용 TXT 레코드를 가비아에 추가해 두면 도메인 도용을 막을 수 있습니다.

연결 확인:

```bash
nslookup www.data-station.co.kr
```

## 3. 자주 하는 수정

| 하고 싶은 것 | 수정 위치 |
|---|---|
| 문의 메일 받는 주소 변경 | `contact.html` 의 `data-to="..."` 와 이메일 링크 |
| 메뉴 · 푸터 문구 변경 | 각 HTML 파일 상단 `<header>` · 하단 `<footer>` (모든 페이지 동일하게) |
| 협력사 로고 추가 | 로고를 `assets/img/partners/` 에 넣고 `index.html` 의 `.logos` 안에 `logo-tile` 한 줄 추가 |
| 강의 이력 추가 | `education.html` 의 `#lectures` 목록에 `<li data-cat="mfg|fin|pub|univ|kdt">` 추가 후 필터 버튼 숫자 수정 |
| 색상 · 글꼴 | `assets/css/style.css` 맨 위 `:root` (주간) · `[data-theme="dark"]` (야간) 변수 |
| 공유 미리보기 이미지 | `assets/img/brand/og.png` (1200×630) |

문의 폼은 서버 없이 동작하도록 방문자의 메일 앱을 열어 내용을 채워 줍니다.
폼 내용을 바로 받아 보고 싶다면 Formspree, Google Forms 등 외부 폼 서비스로 바꿀 수 있습니다.

## 로컬에서 미리 보기

`index.html` 을 브라우저로 바로 열어도 되고, 아래처럼 띄우면 실제와 같은 환경으로 볼 수 있습니다.

```bash
python -m http.server 8000
# http://localhost:8000
```
