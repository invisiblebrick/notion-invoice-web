# Invoice Web

노션(Notion)에 입력한 견적서 데이터를 웹에서 확인하고 PDF로 다운로드할 수 있는 웹앱입니다.

## 주요 기능

- **노션 연동** - Notion API를 통해 견적서 데이터를 실시간으로 동기화
- **견적서 조회** - 목록/상세 페이지에서 견적서 내용 확인
- **PDF 다운로드** - react-to-print를 활용한 PDF 생성 및 다운로드
- **필터링/검색** - 상태별 필터링, 고객명/프로젝트명 검색 지원
- **반응형 디자인** - 모바일/태블릿/데스크톱 지원

## 기술 스택

- **Next.js 16** - App Router 기반
- **React 19** - 최신 React 버전
- **TypeScript 5** - 타입 안전한 개발
- **TailwindCSS v4** - CSS 기반 설정
- **shadcn/ui** - New York 스타일 UI 컴포넌트
- **@notionhq/client** - Notion API 클라이언트
- **react-to-print** - PDF 출력

## 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일에 다음 값을 설정하세요:

```env
NOTION_API_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
ACCESS_TOKEN=your_access_token_for_clients
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열기

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API Routes
│   │   ├── invoices/        # 견적서 페이지
│   │   ├── globals.css      # TailwindCSS v4 설정
│   │   ├── layout.tsx       # 루트 레이아웃
│   │   └── page.tsx         # 인증 페이지
│   ├── components/
│   │   ├── ui/              # shadcn/ui 컴포넌트
│   │   └── invoices/        # 견적서 컴포넌트
│   ├── lib/
│   │   ├── notion.ts        # Notion API 클라이언트
│   │   ├── mapper.ts        # 데이터 매핑
│   │   └── utils.ts         # 유틸리티
│   └── types/
│       └── invoice.ts       # TypeScript 타입
├── docs/
│   └── PRD.md               # 프로젝트 PRD 문서
├── public/                  # 정적 파일
└── components.json          # shadcn 설정
```

## Notion 데이터베이스 설정

필수 속성:

| 속성명 | 타입 | 설명 |
|--------|------|------|
| 견적번호 | Title | 고유 식별자 |
| 고객명 | Rich Text | 클라이언트 이름 |
| 프로젝트명 | Rich Text | 프로젝트 이름 |
| 발행일 | Date | ISO 8601 형식 |
| 유효기간 | Date | ISO 8601 형식 |
| 품목 | Rich Text | JSON 문자열로 저장 |
| 소계 | Number | 세전 금액 |
| 세율 | Number | 기본 10% |
| 세액 | Number | 세금 금액 |
| 총액 | Number | 최종 금액 |
| 비고 | Rich Text | 추가 메모 |
| 상태 | Select | 작성중/발행됨/승인됨/거절됨 |

## 주의사항

- Notion API Token은 서버사이드에서만 사용됩니다 (보안)
- Rate Limiting (분당 3회)을 고려하여 캐싱이 적용되어 있습니다
- URL 토큰 인증은 기본적인 접근 제어용입니다

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항 및 설계 문서

## 라이선스

MIT
