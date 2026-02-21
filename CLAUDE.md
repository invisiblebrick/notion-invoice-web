# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code(claude.ai/code)에 지침을 제공합니다.

## 개발 명령어

- `npm run dev` - 개발 서버 시작 (http://localhost:3000)
- `npm run build` - 프로덕션 애플리케이션 빌드
- `npm start` - 프로덕션 서버 시작 (빌드 필요)
- `npm run lint` - ESLint 실행 (Next.js 설정)

## 기술 스택

- **Next.js 16** - App Router 사용
- **React 19**
- **TypeScript 5**
- **TailwindCSS v4** - CSS 기반 설정 (tailwind.config.ts 없음)
- **shadcn/ui** - New York 스타일의 컴포넌트 라이브러리
- **lucide-react** - 아이콘 라이브러리

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # 루트 레이아웃 (Geist 폰트 설정)
│   ├── page.tsx      # 홈페이지
│   ├── globals.css   # 전역 스타일 및 Tailwind v4 설정
│   └── favicon.ico
├── components/
│   └── ui/           # shadcn/ui 컴포넌트
└── lib/
    └── utils.ts      # 유틸리티 함수 (cn)
```

## MCP 서버

프로젝트는 `.mcp.json`에 다음 MCP 서버가 구성되어 있습니다:

- **context7** - 라이브러리 문서 검색 및 최신 코드 예제 조회
- **playwright** - 브라우저 자동화 및 E2E 테스트
- **sequential-thinking** - 복잡한 문제 해결을 위한 순차적 사고

## 아키텍처 참고사항

### TailwindCSS v4 설정

v3와 다르게 TailwindCSS v4는 CSS 기반 설정을 사용합니다. 설정은 `src/app/globals.css`에서 이루어집니다:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... 색상 및 폰트 변수 정의 ... */
}
```

**주요 특징:**
- 테마 커스터마이징은 `@theme inline` 블록에서 CSS 변수를 사용하여 설정
- 색상은 CSS 변수를 참조함 (예: `--color-primary: var(--primary)`)
- `:root`와 `.dark` 선택자가 CSS 변수 값을 정의
- **oklch 색상 형식** 사용
- `tailwind.config.ts` 파일이 없음
- **tw-animate-css** import로 애니메이션 유틸리티 사용 가능

### 경로 별칭

프로젝트는 `@/` 접두사를 사용한 소스 임포트를 사용합니다:

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks` (설정됨, 디렉토리는 아직 없음)

### shadcn/ui 컴포넌트

**설정 (`components.json`):**
- 스타일: `new-york`
- RSC (React Server Components): 활성화
- 아이콘 라이브러리: `lucide`
- 베이스 컬러: `neutral`
- CSS 변수: 사용

**설치된 컴포넌트** (`src/components/ui/`):
- `badge` - 상태/라벨 배지
- `button` - 인터랙티브 버튼 (variants 포함)
- `card` - 콘텐츠 컨테이너
- `dialog` - 모달 다이얼로그
- `dropdown-menu` - 드롭다운 메뉴
- `input` - 폼 입력 필드
- `label` - 폼 레이블
- `separator` - 시각적 구분선
- `sheet` - 사이드 패널/다이얼로그

**새 컴포넌트 추가:**

```bash
npx shadcn@latest add [컴포넌트-이름]
```

### 유틸리티 함수

`src/lib/utils.ts`의 `cn()` 유틸리티는 `clsx`와 `tailwind-merge`를 사용하여 Tailwind 클래스를 병합합니다:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 폰트

`next/font/google`의 Geist Sans와 Geist Mono를 CSS 변수와 함께 사용합니다:

```typescript
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

CSS 변수:
- `--font-geist-sans` - 기본 sans-serif 폰트
- `--font-geist-mono` - monospace 폰트

### 테마 시스템

**라이트 모드 (`:root`):**
- 배경: 흰색 (`oklch(1 0 0)`)
- 전경: 어두운 회색 (`oklch(0.145 0 0)`)
- 주요색: 어두운 회색 (`oklch(0.205 0 0)`)
- 반경: `0.625rem`

**다크 모드 (`.dark`):**
- 배경: 어두운 회색 (`oklch(0.145 0 0)`)
- 전경: 흰색 (`oklch(0.985 0 0)`)
- 주요색: 밝은 회색 (`oklch(0.922 0 0)`)

테마 전환은 `.dark` 클래스를 HTML 요소에 추가/제거하여 수행합니다.
