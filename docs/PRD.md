# Invoice Web MVP PRD

## 1. 개요 (Overview)

### 1.1 프로젝트 배경
노션(Notion)에 입력한 견적서 데이터를 클라이언트가 웹에서 쉽게 확인하고 PDF로 다운로드할 수 있는 웹앱

### 1.2 목표
- 노션 데이터베이스와 연동하여 견적서 정보를 실시간으로 조회
- 클라이언트 친화적인 견적서 뷰 제공
- PDF 다운로드 기능으로 견적서 공유 간소화

### 1.3 범위
| 포함 | 제외 |
|------|------|
| 노션 데이터 조회 및 표시 | 견적서 작성/수정 기능 |
| 견적서 목록 및 상세 페이지 | 사용자 관리 시스템 |
| PDF 다운로드 | 결제 연동 |
| 기본 URL 토큰 인증 | 고급 권한 관리 |

---

## 2. 기능 요구사항 (Functional Requirements)

### 2.1 MVP 핵심 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|-------------|------------|
| **F001** | 노션 데이터 연동 | Notion API로 견적서 데이터 조회 | 핵심 데이터 소스 | 모든 페이지 |
| **F002** | 견적서 목록 조회 | 테이블/카드 형태로 견적서 목록 표시 | 클라이언트 진입점 | 견적서 목록 페이지 |
| **F003** | 견적서 상세 조회 | 개별 견적서 상세 내용 표시 | 핵심 가치 제공 | 견적서 상세 페이지 |
| **F004** | PDF 다운로드 | react-to-print로 PDF 생성/다운로드 | 클라이언트 핵심 니즈 | 견적서 상세 페이지 |
| **F005** | 상태별 필터링 | "작성중/발행됨/승인됨/거절됨" 필터 | 사용성 향상 | 견적서 목록 페이지 |
| **F006** | 검색 기능 | 고객명/프로젝트명 검색 | 사용성 향상 | 견적서 목록 페이지 |
| **F007** | 페이지네이션 | 10개 단위 페이지 분할 | 성능 최적화 | 견적서 목록 페이지 |
| **F008** | URL 토큰 인증 | 간단한 접근 제어 | 기본 보안 | 인증 페이지 |

### 2.2 기능 상세 명세

#### F001: 노션 데이터 연동
```typescript
// 서버사이드에서만 실행
const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

// 데이터베이스 쿼리 with 캐싱
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID!,
  filter: { property: '상태', select: { does_not_equal: '작성중' } }
}, {
  next: { revalidate: 60 } // 60초 캐싱
});
```

#### F002: 견적서 목록 조회
- 테이블 형태로 표시 (데스크톱)
- 카드 형태로 표시 (모바일)
- 컬럼: 견적번호, 고객명, 프로젝트명, 총액, 발행일, 상태
- 최신 발행일 기준 정렬

#### F003: 견적서 상세 조회
- 레이아웃:
  - 헤더: 견적번호, 발행일, 유효기간, 상태 배지
  - 클라이언트 정보: 고객명
  - 프로젝트명
  - 품목 테이블: No, 항목명, 단가, 수량, 금액
  - 합계 섹션: 소계, 세금, 총액
  - 비고 섹션
  - 푸터: 회사 정보

#### F004: PDF 다운로드
```typescript
'use client';
import { useReactToPrint } from 'react-to-print';

const handlePrint = useReactToPrint({
  content: () => printRef.current,
  documentTitle: `견적서_${invoiceNumber}`,
  onAfterPrint: () => console.log('PDF 생성 완료'),
});
```

#### F005: 상태별 필터링
- 상태 옵션: "전체", "작성중", "발행됨", "승인됨", "거절됨"
- URL query parameter로 상태 유지: `?status=발행됨`

#### F006: 검색 기능
- 검색 대상: 고객명, 프로젝트명
- 실시간 필터링 (디바운스 300ms)
- URL query parameter로 검색어 유지: `?search=프로젝트명`

#### F007: 페이지네이션
- 페이지당 10개 항목
- 페이지 번호 또는 "더 보기" 방식
- URL query parameter로 페이지 유지: `?page=2`

#### F008: URL 토큰 인증
- 접근 URL: `/invoices?token=SECRET_TOKEN`
- 토큰 불일치 시 인증 페이지로 리다이렉트
- 미들웨어에서 토큰 검증

---

## 3. 비기능 요구사항 (Non-functional Requirements)

### 3.1 성능
| 항목 | 요구사항 | 측정 방법 |
|------|---------|----------|
| 초기 로딩 | 3초 이내 | Lighthouse |
| TTFB | 1.5초 이내 | Vercel Analytics |
| API 응답 | 500ms 이내 | Notion API 캐싱 |
| PDF 생성 | 2초 이내 | react-to-print |

### 3.2 보안
- Notion API Token은 서버사이드에서만 사용
- 환경변수로 민감 정보 관리
- URL 토큰은 기본적인 접근 제어용 (완전한 보안 아님)

### 3.3 호환성
- Chrome, Safari, Firefox 최신 버전
- 모바일 Safari, Chrome
- IE 미지원

### 3.4 가용성
- Vercel Edge Network 활용
- 99.9% 가용성 목표

---

## 4. 데이터 모델 (Data Model)

### 4.1 TypeScript 인터페이스

```typescript
// src/types/invoice.ts

export interface InvoiceItem {
  no: number;
  name: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

export type InvoiceStatus = '작성중' | '발행됨' | '승인됨' | '거절됨';

export interface Invoice {
  id: string;                    // Notion page id
  invoiceNumber: string;         // 견적번호
  clientName: string;            // 고객명
  projectName: string;           // 프로젝트명
  issueDate: string;             // 발행일 (ISO 8601)
  validUntil: string;            // 유효기간 (ISO 8601)
  items: InvoiceItem[];          // 품목 목록
  subtotal: number;              // 소계
  taxRate: number;               // 세율 (기본 10%)
  taxAmount: number;             // 세액
  totalAmount: number;           // 총액
  notes: string;                 // 비고
  status: InvoiceStatus;         // 상태
  createdAt: string;             // 생성일
  updatedAt: string;             // 수정일
}

// 목록용 간소화 타입
export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  totalAmount: number;
  issueDate: string;
  status: InvoiceStatus;
}
```

### 4.2 Notion 데이터베이스 매핑

| Notion 속성명 | Notion 타입 | 앱 필드명 | 변환 로직 |
|--------------|------------|----------|----------|
| 견적번호 | title | invoiceNumber | title[0].plain_text |
| 고객명 | rich_text | clientName | rich_text[0].plain_text |
| 프로젝트명 | rich_text | projectName | rich_text[0].plain_text |
| 발행일 | date | issueDate | date.start |
| 유효기간 | date | validUntil | date.start |
| 품목 | rich_text | items | JSON.parse(rich_text[0].plain_text) |
| 소계 | number | subtotal | number |
| 세율 | number | taxRate | number (기본 0.1) |
| 세액 | number | taxAmount | number |
| 총액 | number | totalAmount | number |
| 비고 | rich_text | notes | rich_text[0].plain_text |
| 상태 | select | status | select.name |

### 4.3 품목 JSON 구조
```json
[
  {
    "no": 1,
    "name": "웹사이트 개발",
    "unitPrice": 5000000,
    "quantity": 1,
    "amount": 5000000
  },
  {
    "no": 2,
    "name": "디자인 작업",
    "unitPrice": 2000000,
    "quantity": 1,
    "amount": 2000000
  }
]
```

---

## 5. API 명세 (API Specification)

### 5.1 엔드포인트 목록

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| GET | /api/invoices | 견적서 목록 조회 | URL 토큰 |
| GET | /api/invoices/[id] | 견적서 상세 조회 | URL 토큰 |

### 5.2 API 상세

#### GET /api/invoices
**Query Parameters:**
```typescript
{
  status?: InvoiceStatus;  // 상태 필터
  search?: string;         // 검색어
  page?: number;           // 페이지 (기본 1)
  limit?: number;          // 페이지당 개수 (기본 10)
}
```

**Response:**
```typescript
{
  data: InvoiceListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

#### GET /api/invoices/[id]
**Response:**
```typescript
{
  data: Invoice;
}
```

### 5.3 에러 처리

| 상태코드 | 에러 | 설명 |
|---------|------|------|
| 401 | Unauthorized | 토큰 불일치 |
| 404 | Not Found | 견적서 없음 |
| 429 | Too Many Requests | Notion API Rate Limit |
| 500 | Internal Server Error | 서버 오류 |

**에러 응답 형식:**
```typescript
{
  error: {
    code: string;
    message: string;
  }
}
```

---

## 6. UI/UX 디자인

### 6.1 페이지 구조

```
📱 Invoice Web
├── 🔐 인증 페이지 (/)
│   └── 토큰 입력 폼
│
├── 📋 견적서 목록 페이지 (/invoices)
│   ├── 헤더: 로고, 토큰 표시
│   ├── 필터/검색 바
│   ├── 견적서 테이블/카드 목록
│   └── 페이지네이션
│
└── 📄 견적서 상세 페이지 (/invoices/[id])
    ├── 뒤로 가기 버튼
    ├── PDF 다운로드 버튼
    ├── 견적서 내용 (인쇄 영역)
    └── 회사 정보 푸터
```

### 6.2 컴포넌트 구조

```
src/
├── app/
│   ├── page.tsx              # 인증 페이지 (루트)
│   ├── layout.tsx            # 루트 레이아웃
│   ├── globals.css           # 전역 스타일 + 인쇄 스타일
│   ├── invoices/
│   │   ├── page.tsx          # 견적서 목록
│   │   └── [id]/
│   │       └── page.tsx      # 견적서 상세
│   └── api/
│       └── invoices/
│           ├── route.ts      # 목록 API
│           └── [id]/
│               └── route.ts  # 상세 API
│
├── components/
│   ├── ui/                   # shadcn/ui 컴포넌트
│   ├── invoices/
│   │   ├── InvoiceList.tsx   # 목록 컴포넌트
│   │   ├── InvoiceCard.tsx   # 카드 아이템
│   │   ├── InvoiceTable.tsx  # 테이블 (데스크톱)
│   │   ├── InvoiceDetail.tsx # 상세 컴포넌트
│   │   ├── InvoicePrint.tsx  # 인쇄용 컴포넌트
│   │   ├── StatusBadge.tsx   # 상태 배지
│   │   ├── FilterBar.tsx     # 필터/검색 바
│   │   └── Pagination.tsx    # 페이지네이션
│   └── auth/
│       └── TokenForm.tsx     # 토큰 입력 폼
│
├── lib/
│   ├── notion.ts             # Notion API 클라이언트
│   ├── mapper.ts             # Notion ↔ 앱 타입 변환
│   └── utils.ts              # 유틸리티
│
├── types/
│   └── invoice.ts            # TypeScript 타입
│
└── middleware.ts             # 토큰 검증 미들웨어
```

### 6.3 스타일 가이드

#### 색상 (TailwindCSS v4 변수)
```css
/* 기본 색상 */
--color-primary: var(--primary);           /* 주요 액션 */
--color-secondary: var(--secondary);       /* 보조 배경 */
--color-muted: var(--muted);               /* 비활성 */
--color-destructive: var(--destructive);   /* 에러/거절 */

/* 상태별 색상 */
작성중: bg-muted text-muted-foreground
발행됨: bg-blue-100 text-blue-800
승인됨: bg-green-100 text-green-800
거절됨: bg-red-100 text-red-800
```

#### 타이포그래피
```css
/* 폰트 */
--font-sans: var(--font-geist-sans);   /* 기본 */
--font-mono: var(--font-geist-mono);   /* 코드/숫자 */

/* 크기 */
제목: text-2xl font-bold
부제목: text-lg font-semibold
본문: text-base
보조: text-sm text-muted-foreground
```

#### 인쇄 스타일
```css
@media print {
  .no-print { display: none !important; }
  .print-only { display: block !important; }

  body {
    background: white;
    color: black;
  }

  /* A4 크기 */
  @page {
    size: A4;
    margin: 15mm;
  }
}
```

### 6.4 반응형 브레이크포인트
```css
/* TailwindCSS 기본 브레이크포인트 */
sm: 640px   /* 모바일 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크톱 */
```

---

## 7. 개발 로드맵

### Phase 1: 핵심 기능 (1주)
- [ ] 프로젝트 설정 및 의존성 설치
- [ ] Notion API 연동 및 데이터 매핑
- [ ] 견적서 목록 페이지
- [ ] 견적서 상세 페이지
- [ ] 기본 스타일링

### Phase 2: PDF 및 인증 (3일)
- [ ] react-to-print 연동
- [ ] PDF 출력용 스타일
- [ ] URL 토큰 인증
- [ ] 미들웨어 설정

### Phase 3: 고도화 (2일)
- [ ] 필터링/검색 기능
- [ ] 페이지네이션
- [ ] 에러 처리
- [ ] 성능 최적화

### Phase 4: 배포 (1일)
- [ ] 환경변수 설정
- [ ] Vercel 배포
- [ ] 도메인 연결
- [ ] 모니터링 설정

**총 예상 소요시간: 2주**

---

## 8. 기술적 고려사항

### 8.1 TailwindCSS v4 설정
```css
/* src/app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... */
}
```

**주의사항:**
- `tailwind.config.ts` 파일 없음
- CSS 변수 기반 테마 설정
- `@theme inline` 블록에서 커스텀

### 8.2 Notion API 특성

#### Rate Limiting
```typescript
// exponential backoff 구현
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 334 // 334ms = 분당 3회 제한 고려
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(r => setTimeout(r, delay));
    return fetchWithRetry(fn, retries - 1, delay * 2);
  }
}
```

#### 캐싱 전략
```typescript
// Next.js fetch 캐싱
const response = await notion.databases.query({...}, {
  next: { revalidate: 60 } // ISR 60초
});
```

### 8.3 데이터 흐름
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Notion    │────▶│  API Route  │────▶│   Client    │
│  Database   │     │  (Server)   │     │  Component  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Mapper    │     │  react-to-  │
                    │  (Zod 검증) │     │    print    │
                    └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  PDF 출력   │
                                        └─────────────┘
```

### 8.4 보안 고려사항

#### 환경변수
```bash
# .env.local
NOTION_API_TOKEN=secret_xxx
NOTION_DATABASE_ID=xxx-xxx-xxx
ACCESS_TOKEN=your-secret-token
```

#### 미들웨어 토큰 검증
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (token !== process.env.ACCESS_TOKEN) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/invoices/:path*', '/api/invoices/:path*'],
};
```

---

## 9. 리스크 및 완화 방안

| 리스크 | 영향도 | 확률 | 완화 방안 |
|--------|--------|------|----------|
| Notion API Rate Limit | 높음 | 중간 | 캐싱(60초), exponential backoff |
| Notion API 변경 | 중간 | 낮음 | Mapper 함수로 추상화, Zod 검증 |
| 토큰 유출 | 중간 | 낮음 | 환경변수 관리, 주기적 토큰 교체 |
| PDF 출력 오류 | 낮음 | 낮음 | react-to-print 라이브러리, 인쇄 미리보기 테스트 |
| 모바일 호환성 | 낮음 | 중간 | 반응형 디자인, 실기기 테스트 |

---

## 10. 설치 및 실행

### 10.1 의존성 설치
```bash
# Notion 클라이언트
npm install @notionhq/client

# PDF 출력
npm install react-to-print

# 타입 검증
npm install zod

# 날짜 포맷팅 (선택)
npm install date-fns
```

### 10.2 환경변수 설정
```bash
# .env.local
NOTION_API_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
ACCESS_TOKEN=your_access_token_for_clients
```

### 10.3 개발 서버 실행
```bash
npm run dev
```

### 10.4 프로덕션 빌드
```bash
npm run build
npm start
```

---

## 부록: Notion 데이터베이스 설정

### 필수 속성
| 속성명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| 견적번호 | Title | O | 고유 식별자 |
| 고객명 | Rich Text | O | 클라이언트 이름 |
| 프로젝트명 | Rich Text | O | 프로젝트 이름 |
| 발행일 | Date | O | ISO 8601 형식 |
| 유효기간 | Date | O | ISO 8601 형식 |
| 품목 | Rich Text | O | JSON 문자열 |
| 소계 | Number | O | 숫자 |
| 세율 | Number | X | 기본 0.1 (10%) |
| 세액 | Number | O | 숫자 |
| 총액 | Number | O | 숫자 |
| 비고 | Rich Text | X | 추가 메모 |
| 상태 | Select | O | 작성중/발행됨/승인됨/거절됨 |

---

*문서 버전: 1.0*
*작성일: 2026-02-21*
*기술 스택: Next.js 16 + React 19 + TailwindCSS v4 + shadcn/ui*
