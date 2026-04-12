# SRD: Guilty Bite — Software Requirements Document

> **문서 버전:** v1.0  
> **작성일:** 2026-04-12  
> **기반 문서:** PRD v1.0, TRD v1.0  
> **대상:** 개발팀

---

## 1. 프로젝트 구조

### 1.1 디렉토리 구조

```
guilty-bite/
├── public/
│   ├── fonts/                    # 웹폰트 파일
│   ├── images/
│   │   ├── placeholder-food.svg  # 이미지 로딩 실패 시 대체 이미지
│   │   └── empty-plate.svg       # 기록 없는 날 일러스트
│   └── favicon.ico
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── page.tsx              # 메인 페이지 (→ 달력 또는 로그인 리다이렉트)
│   │   ├── globals.css           # 글로벌 스타일
│   │   ├── (auth)/               # 인증 관련 라우트 그룹
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # 로그인 페이지
│   │   │   └── callback/
│   │   │       └── route.ts      # OAuth 콜백 핸들러
│   │   ├── (main)/               # 인증 필요 라우트 그룹
│   │   │   ├── layout.tsx        # 인증 검증 레이아웃
│   │   │   └── calendar/
│   │   │       └── page.tsx      # 달력 메인 페이지
│   │   └── api/
│   │       └── image-search/
│   │           └── route.ts      # Kakao 이미지 검색 프록시
│   ├── components/
│   │   ├── ui/                   # 범용 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ImageGrid.tsx
│   │   ├── calendar/             # 달력 관련 컴포넌트
│   │   │   ├── Calendar.tsx
│   │   │   ├── CalendarHeader.tsx
│   │   │   ├── CalendarGrid.tsx
│   │   │   ├── CalendarCell.tsx
│   │   │   └── FoodThumbnail.tsx
│   │   ├── record/               # 기록 관련 컴포넌트
│   │   │   ├── RecordAddForm.tsx
│   │   │   ├── RecordEditForm.tsx
│   │   │   ├── RecordList.tsx
│   │   │   ├── RecordItem.tsx
│   │   │   ├── FoodSearch.tsx
│   │   │   ├── ImageSearchResult.tsx
│   │   │   ├── PortionSelector.tsx
│   │   │   └── MemoInput.tsx
│   │   ├── auth/                 # 인증 관련 컴포넌트
│   │   │   ├── LoginForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   └── layout/               # 레이아웃 컴포넌트
│   │       ├── Header.tsx
│   │       └── FAB.tsx
│   ├── hooks/                    # 커스텀 훅
│   │   ├── useRecords.ts         # 기록 CRUD 훅 (TanStack Query)
│   │   ├── useImageSearch.ts     # 이미지 검색 훅
│   │   ├── useCalendar.ts        # 달력 네비게이션 훅
│   │   └── useAuth.ts            # 인증 상태 훅
│   ├── lib/                      # 유틸리티 & 설정
│   │   ├── supabase/
│   │   │   ├── client.ts         # 브라우저용 Supabase 클라이언트
│   │   │   ├── server.ts         # 서버용 Supabase 클라이언트
│   │   │   └── middleware.ts     # 미들웨어용 Supabase 클라이언트
│   │   ├── kakao.ts              # Kakao API 유틸리티
│   │   ├── date.ts               # 날짜 유틸리티 함수
│   │   └── constants.ts          # 상수 정의
│   ├── stores/                   # Zustand 스토어
│   │   └── uiStore.ts            # UI 상태 (모달, 바텀시트 등)
│   └── types/                    # TypeScript 타입 정의
│       ├── record.ts             # Record 관련 타입
│       ├── kakao.ts              # Kakao API 응답 타입
│       └── database.ts           # Supabase 자동 생성 타입
├── middleware.ts                  # Next.js 미들웨어 (인증 검증)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                    # 환경 변수 (git 제외)
```

---

## 2. 페이지 라우팅

### 2.1 라우트 맵

| 경로 | 페이지 | 인증 필요 | 설명 |
|------|--------|-----------|------|
| `/` | 루트 | X | 인증 상태에 따라 `/calendar` 또는 `/login` 리다이렉트 |
| `/login` | 로그인 | X | 로그인/회원가입 페이지 |
| `/callback` | OAuth 콜백 | X | 소셜 로그인 콜백 처리 |
| `/calendar` | 달력 메인 | O | 월별 달력 + 음식 기록 썸네일 |
| `/api/image-search` | API | O | Kakao 이미지 검색 프록시 |

### 2.2 미들웨어 인증 검증

```
요청 진입
    │
    ▼
middleware.ts
    │
    ├─ /login, /callback, /api/* → 패스스루
    │
    ├─ /calendar (인증 필요 경로)
    │   ├─ 세션 있음 → 통과
    │   └─ 세션 없음 → /login 리다이렉트
    │
    └─ / (루트)
        ├─ 세션 있음 → /calendar 리다이렉트
        └─ 세션 없음 → /login 리다이렉트
```

---

## 3. 컴포넌트 명세

### 3.1 달력 컴포넌트

#### 3.1.1 Calendar (최상위 컨테이너)

| 속성 | 설명 |
|------|------|
| 역할 | 달력 전체를 감싸는 컨테이너. 월별 데이터 로딩 및 자식 컴포넌트에 전달 |
| 상태 | `currentMonth: Date` (현재 표시 월) |
| 데이터 | `useRecords(currentMonth)` 훅으로 해당 월 기록 조회 |
| 자식 | `CalendarHeader`, `CalendarGrid` |

#### 3.1.2 CalendarHeader

| 속성 | 설명 |
|------|------|
| 역할 | 월 네비게이션, 현재 월 표시, 이번 달 기록 건수 표시 |
| Props | `currentMonth`, `recordCount`, `onPrevMonth`, `onNextMonth` |
| 동작 | 이전/다음 월 버튼 클릭 시 `currentMonth` 변경 |

#### 3.1.3 CalendarGrid

| 속성 | 설명 |
|------|------|
| 역할 | 7x(4~6) 그리드로 날짜 셀 렌더링 |
| Props | `currentMonth`, `records` |
| 로직 | 해당 월의 시작 요일, 총 일수 계산 후 `CalendarCell` 배열 생성 |

#### 3.1.4 CalendarCell

| 속성 | 설명 |
|------|------|
| 역할 | 개별 날짜 셀. 해당 날짜의 음식 썸네일 표시 |
| Props | `date`, `records: Record[]`, `isToday`, `onClick` |
| 표시 로직 | 기록 0건: 빈 셀 / 1~3건: 썸네일 표시 / 4건 이상: 3개 + "+N" 뱃지 |
| 클릭 | 일별 상세 바텀시트 열기 |

#### 3.1.5 FoodThumbnail

| 속성 | 설명 |
|------|------|
| 역할 | 음식 썸네일 이미지 렌더링 (lazy loading, 에러 폴백) |
| Props | `thumbnailUrl`, `foodName`, `size` |
| 에러 처리 | 이미지 로드 실패 시 `placeholder-food.svg` 표시 |

### 3.2 기록 컴포넌트

#### 3.2.1 RecordAddForm (모달/바텀시트)

| 속성 | 설명 |
|------|------|
| 역할 | 새 기록 추가 폼. 음식 검색 → 이미지 선택 → 양/메모 입력 → 저장 |
| Props | `date`, `onClose`, `onSaved` |
| 상태 | `step: 'search' | 'confirm'` (2단계 플로우) |
| 검증 | 음식명 필수, 이미지 선택 필수 |

**사용자 플로우:**

```
1. 음식 키워드 입력 (FoodSearch)
          │
          ▼
2. 이미지 검색 결과 표시 (ImageSearchResult)
          │
          ▼
3. 이미지 선택
          │
          ▼
4. 양 선택 (PortionSelector) + 메모 입력 (MemoInput)
          │
          ▼
5. 저장 → 달력 갱신 → 모달 닫기
```

#### 3.2.2 FoodSearch

| 속성 | 설명 |
|------|------|
| 역할 | 음식 키워드 입력 필드 + 자동완성 프리셋 |
| Props | `onSearch` |
| 동작 | 입력 시 300ms 디바운싱 후 검색 트리거 |
| 프리셋 | 자주 검색되는 음식 칩 표시 (치킨, 라면, 피자, 떡볶이, 햄버거, 족발, 콜라, 아이스크림) |

#### 3.2.3 ImageSearchResult

| 속성 | 설명 |
|------|------|
| 역할 | 이미지 검색 결과를 그리드(2x4)로 표시 |
| Props | `images`, `selectedImage`, `onSelect`, `isLoading` |
| 표시 | 로딩 중: 스켈레톤 UI / 결과 없음: 안내 메시지 / 결과 있음: 이미지 그리드 |

#### 3.2.4 PortionSelector

| 속성 | 설명 |
|------|------|
| 역할 | 양 선택 (조금/보통/많이) 토글 그룹 |
| Props | `value`, `onChange` |
| 기본값 | `'medium'` (보통) |
| UI | 3개의 토글 버튼, 선택된 항목 강조 |

| 값 | 레이블 |
|----|--------|
| `small` | 조금 |
| `medium` | 보통 |
| `large` | 많이 |

#### 3.2.5 MemoInput

| 속성 | 설명 |
|------|------|
| 역할 | 선택적 메모 입력 필드 |
| Props | `value`, `onChange` |
| 제한 | 최대 100자 |
| 플레이스홀더 | "간단한 메모를 남겨보세요 (선택)" |

#### 3.2.6 RecordList (일별 상세 바텀시트)

| 속성 | 설명 |
|------|------|
| 역할 | 특정 날짜의 기록 목록 표시 |
| Props | `date`, `records`, `onClose` |
| 자식 | `RecordItem[]`, 기록 추가 버튼 |
| 빈 상태 | "아직 기록이 없어요" + 기록 추가 유도 |

#### 3.2.7 RecordItem

| 속성 | 설명 |
|------|------|
| 역할 | 개별 기록 카드 (이미지 + 음식명 + 양 + 메모) |
| Props | `record`, `onEdit`, `onDelete` |
| 동작 | 편집 → RecordEditForm 열기 / 삭제 → 확인 다이얼로그 후 삭제 |

#### 3.2.8 RecordEditForm

| 속성 | 설명 |
|------|------|
| 역할 | 기존 기록 수정 폼 (RecordAddForm과 유사한 구조) |
| Props | `record`, `onClose`, `onSaved` |
| 차이점 | 기존 값이 미리 채워진 상태로 열림 |

### 3.3 인증 컴포넌트

#### 3.3.1 LoginForm

| 속성 | 설명 |
|------|------|
| 역할 | 로그인/회원가입 통합 폼 |
| UI | Google 소셜 로그인 버튼 + 이메일/비밀번호 폼 |
| 톤 | PRD 디자인 가이드에 따라 친근하고 키치한 스타일 |

#### 3.3.2 AuthGuard

| 속성 | 설명 |
|------|------|
| 역할 | 인증 상태 확인 후 자식 렌더링 또는 로그인 리다이렉트 |
| 위치 | `(main)/layout.tsx`에서 사용 |

### 3.4 레이아웃 컴포넌트

#### 3.4.1 Header

| 속성 | 설명 |
|------|------|
| 역할 | 상단 헤더바. 로고, 사용자 아바타/닉네임, 로그아웃 |
| 위치 | `(main)/layout.tsx` |

#### 3.4.2 FAB (Floating Action Button)

| 속성 | 설명 |
|------|------|
| 역할 | "기록하기" 플로팅 버튼 |
| 위치 | 화면 우하단 고정 |
| 클릭 | 오늘 날짜로 RecordAddForm 열기 |
| 스타일 | 코랄 핑크 (#FB7185), 둥근 원형, "+" 아이콘 |

---

## 4. 상태 관리

### 4.1 서버 상태 (TanStack Query)

| 쿼리 키 | 훅 | 데이터 | staleTime |
|---------|-----|--------|-----------|
| `['records', userId, yearMonth]` | `useRecords` | 월별 기록 목록 | 5분 |
| `['records', userId, date]` | `useRecordsByDate` | 일별 기록 목록 | 5분 |
| `['image-search', query]` | `useImageSearch` | 이미지 검색 결과 | 10분 |
| `['profile', userId]` | `useProfile` | 사용자 프로필 | 30분 |

### 4.2 뮤테이션 (TanStack Query)

| 뮤테이션 | 동작 | 낙관적 업데이트 |
|----------|------|-----------------|
| `useAddRecord` | 기록 추가 | 달력에 즉시 반영, 실패 시 롤백 |
| `useUpdateRecord` | 기록 수정 | 해당 기록 즉시 반영, 실패 시 롤백 |
| `useDeleteRecord` | 기록 삭제 | 해당 기록 즉시 제거, 실패 시 롤백 |

### 4.3 클라이언트 상태 (Zustand)

```typescript
interface UIStore {
  // 모달/바텀시트 상태
  isAddFormOpen: boolean;
  isDetailSheetOpen: boolean;
  isEditFormOpen: boolean;

  // 선택된 날짜/기록
  selectedDate: string | null;       // 'YYYY-MM-DD'
  selectedRecord: Record | null;

  // 액션
  openAddForm: (date: string) => void;
  closeAddForm: () => void;
  openDetailSheet: (date: string) => void;
  closeDetailSheet: () => void;
  openEditForm: (record: Record) => void;
  closeEditForm: () => void;
}
```

---

## 5. API 엔드포인트 명세

### 5.1 이미지 검색 API

#### `GET /api/image-search`

**Request:**

```
GET /api/image-search?query=치킨&size=8
Cookie: sb-access-token=...
```

| 파라미터 | 타입 | 필수 | 기본값 | 검증 |
|----------|------|------|--------|------|
| query | string | O | — | 1~50자, 공백만으로 구성 불가 |
| size | number | X | 8 | 1~20 (Kakao 최대 80이지만 서비스 제한) |

**Response (200):**

```typescript
interface ImageSearchResponse {
  documents: {
    image_url: string;
    thumbnail_url: string;
    width: number;
    height: number;
    display_sitename: string;
  }[];
  meta: {
    total_count: number;
    is_end: boolean;
  };
}
```

**에러 응답:**

```typescript
interface ErrorResponse {
  error: string;
  message: string;
}
```

| 상태 코드 | error | message |
|-----------|-------|---------|
| 400 | `INVALID_QUERY` | "검색어를 입력해주세요" |
| 401 | `UNAUTHORIZED` | "로그인이 필요합니다" |
| 429 | `RATE_LIMITED` | "잠시 후 다시 시도해주세요" |
| 502 | `UPSTREAM_ERROR` | "이미지 검색 서비스에 일시적인 문제가 있습니다" |

### 5.2 Route Handler 구현 명세

```typescript
// src/app/api/image-search/route.ts

export async function GET(request: Request) {
  // 1. 인증 검증 (Supabase 세션 확인)
  // 2. 쿼리 파라미터 추출 및 검증
  // 3. Rate limit 확인 (선택적)
  // 4. 쿼리 보강: query + " 음식"
  // 5. Kakao API 호출
  // 6. 응답 필터링 (필요 필드만 반환)
  // 7. 에러 처리 및 적절한 상태 코드 반환
}
```

---

## 6. 커스텀 훅 명세

### 6.1 useRecords

```typescript
function useRecords(yearMonth: string) {
  // yearMonth: 'YYYY-MM' 형식
  // 해당 월의 첫째 날 ~ 마지막 날 범위로 records 조회
  // 반환: { data: Record[], isLoading, error }
}
```

### 6.2 useRecordsByDate

```typescript
function useRecordsByDate(date: string) {
  // date: 'YYYY-MM-DD' 형식
  // 해당 날짜의 records 조회 (created_at 순)
  // 반환: { data: Record[], isLoading, error }
}
```

### 6.3 useAddRecord

```typescript
function useAddRecord() {
  // mutate: (newRecord: RecordInsert) => void
  // 낙관적 업데이트: ['records', userId, yearMonth] 쿼리 캐시에 추가
  // 성공: 캐시 무효화 및 재조회
  // 실패: 캐시 롤백 + 에러 토스트
}
```

### 6.4 useUpdateRecord

```typescript
function useUpdateRecord() {
  // mutate: (params: { id: string; updates: RecordUpdate }) => void
  // 낙관적 업데이트: 해당 기록 즉시 반영
  // 실패: 캐시 롤백 + 에러 토스트
}
```

### 6.5 useDeleteRecord

```typescript
function useDeleteRecord() {
  // mutate: (recordId: string) => void
  // 낙관적 업데이트: 해당 기록 즉시 제거
  // 확인 다이얼로그는 호출하는 컴포넌트에서 처리
  // 실패: 캐시 롤백 + 에러 토스트
}
```

### 6.6 useImageSearch

```typescript
function useImageSearch(query: string) {
  // 300ms 디바운싱 적용
  // query가 비어있으면 비활성화 (enabled: false)
  // 반환: { data: ImageSearchResult[], isLoading, error }
}
```

### 6.7 useCalendar

```typescript
function useCalendar() {
  // 상태: currentMonth (Date)
  // 액션: goToPrevMonth, goToNextMonth, goToToday
  // 파생: daysInMonth, startDayOfWeek, calendarGrid (6주 배열)
  // 반환: { currentMonth, calendarGrid, goToPrevMonth, goToNextMonth, goToToday }
}
```

### 6.8 useAuth

```typescript
function useAuth() {
  // Supabase Auth 상태 구독
  // 반환: { user, session, isLoading, signInWithGoogle, signInWithEmail, signUp, signOut }
}
```

---

## 7. 타입 정의

### 7.1 Record 타입

```typescript
// src/types/record.ts

type PortionSize = 'small' | 'medium' | 'large';

interface Record {
  id: string;
  user_id: string;
  date: string;           // 'YYYY-MM-DD'
  food_name: string;
  image_url: string;
  thumbnail_url: string;
  portion: PortionSize;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

interface RecordInsert {
  date: string;
  food_name: string;
  image_url: string;
  thumbnail_url: string;
  portion: PortionSize;
  memo?: string | null;
}

interface RecordUpdate {
  food_name?: string;
  image_url?: string;
  thumbnail_url?: string;
  portion?: PortionSize;
  memo?: string | null;
}
```

### 7.2 Kakao API 타입

```typescript
// src/types/kakao.ts

interface KakaoImageDocument {
  image_url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  display_sitename: string;
  doc_url: string;
  collection: string;
  datetime: string;
}

interface KakaoImageSearchResponse {
  documents: KakaoImageDocument[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}
```

### 7.3 UI 관련 타입

```typescript
// 달력 관련
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  records: Record[];
}

// 이미지 선택 관련
interface SelectedImage {
  image_url: string;
  thumbnail_url: string;
  width: number;
  height: number;
}
```

---

## 8. 에러 처리 정책

### 8.1 에러 분류

| 레벨 | 유형 | 처리 방식 |
|------|------|-----------|
| 치명적 | 인증 만료/실패 | 로그인 페이지로 리다이렉트 |
| 높음 | 데이터 저장/수정/삭제 실패 | 토스트 알림 + 재시도 유도 |
| 중간 | 이미지 검색 실패 | 인라인 에러 메시지 + 재시도 버튼 |
| 낮음 | 썸네일 로딩 실패 | 대체 이미지 표시 (silent) |

### 8.2 에러 메시지 톤

PRD의 "죄책감 없는 톤" 가이드를 에러 메시지에도 적용.

| 상황 | 메시지 |
|------|--------|
| 기록 저장 실패 | "앗, 저장에 실패했어요. 다시 한번 시도해주세요!" |
| 이미지 검색 실패 | "이미지를 불러오지 못했어요. 다시 검색해볼까요?" |
| 네트워크 오류 | "인터넷 연결을 확인해주세요!" |
| 기록 삭제 실패 | "삭제에 실패했어요. 잠시 후 다시 시도해주세요!" |
| 검색 결과 없음 | "검색 결과가 없어요. 다른 키워드로 시도해보세요!" |

### 8.3 에러 바운더리

```
App
├─ ErrorBoundary (전역 - 예상치 못한 에러 catch)
│   └─ "문제가 발생했어요" + 새로고침 버튼
└─ 각 데이터 영역별 에러 처리 (TanStack Query onError)
```

### 8.4 로딩 상태

| 상황 | UI |
|------|------|
| 달력 초기 로딩 | 달력 그리드 스켈레톤 (셀 크기 유지) |
| 이미지 검색 중 | 이미지 그리드 스켈레톤 (2x4) |
| 기록 저장 중 | 저장 버튼 로딩 스피너 + 비활성화 |
| 기록 삭제 중 | 해당 RecordItem 페이드 아웃 |

---

## 9. 반응형 UI 명세

### 9.1 브레이크포인트

| 이름 | 범위 | Tailwind |
|------|------|----------|
| 모바일 | ~767px | 기본 |
| 태블릿 | 768px~1023px | `md:` |
| 데스크톱 | 1024px~ | `lg:` |

### 9.2 달력 셀 반응형

| 속성 | 모바일 | 태블릿 | 데스크톱 |
|------|--------|--------|----------|
| 셀 최소 크기 | 48x48px | 64x64px | 80x80px |
| 썸네일 크기 | 32x32px | 40x40px | 56x56px |
| 최대 썸네일 수 | 1개 (+N 뱃지) | 2개 (+N 뱃지) | 3개 (+N 뱃지) |

### 9.3 기록 추가/상세 UI

| 디바이스 | UI 형태 |
|----------|---------|
| 모바일 | 바텀시트 (하단에서 올라옴) |
| 태블릿 | 바텀시트 (최대 너비 제한) |
| 데스크톱 | 모달 (중앙 정렬, 최대 너비 480px) |

---

## 10. 디자인 토큰 (Tailwind 설정)

### 10.1 컬러 팔레트

```typescript
// tailwind.config.ts (colors 확장)
{
  colors: {
    // 베이스 파스텔톤
    pastel: {
      pink: '#FFE4E6',
      purple: '#EDE9FE',
      cream: '#FEF9C3',
      mint: '#D1FAE5',
    },
    // 포인트
    coral: {
      DEFAULT: '#FB7185',
      dark: '#F43F5E',
      light: '#FDA4AF',
    },
    // 시맨틱
    bg: {
      primary: '#FFFBFE',
      secondary: '#FFF1F2',
      card: '#FFFFFF',
    },
    text: {
      primary: '#1C1917',
      secondary: '#78716C',
      muted: '#A8A29E',
    },
  }
}
```

### 10.2 양(Portion) 표시

| 값 | 레이블 | 색상 | 아이콘/이모지 |
|----|--------|------|--------------|
| small | 조금 | `pastel-mint` | 🍽️ (작은 접시) |
| medium | 보통 | `pastel-cream` | 🍽️🍽️ |
| large | 많이 | `pastel-pink` | 🍽️🍽️🍽️ |

---

## 11. 마이크로 인터랙션

### 11.1 애니메이션 명세

| 상황 | 애니메이션 | 도구 | 지속 시간 |
|------|-----------|------|-----------|
| 기록 저장 완료 | 음식 이미지가 달력 셀로 날아가는 모션 | Framer Motion `layoutId` | 400ms |
| 모달/바텀시트 열기 | 하단에서 슬라이드 업 + 오버레이 페이드인 | Framer Motion `AnimatePresence` | 300ms |
| 모달/바텀시트 닫기 | 하단으로 슬라이드 다운 + 오버레이 페이드아웃 | Framer Motion `AnimatePresence` | 200ms |
| 이미지 선택 | 선택 이미지에 체크 오버레이 + 스케일 바운스 | Framer Motion `whileTap` | 150ms |
| 기록 삭제 | 해당 카드 왼쪽으로 슬라이드 아웃 + 높이 축소 | Framer Motion `exit` | 300ms |
| 월 전환 | 좌/우 슬라이드 트랜지션 | Framer Motion `AnimatePresence` + `direction` | 300ms |
| FAB 버튼 | 호버 시 약간 확대 + 그림자 증가 | Tailwind `hover:scale-110` | CSS transition |
| 달력 셀 호버 | 배경색 변경 + 약간의 리프트 | Tailwind `hover:bg-pastel-pink/30` | CSS transition |

---

## 12. 접근성 요구사항

| 항목 | 구현 |
|------|------|
| 키보드 네비게이션 | 달력 셀 간 화살표 키 이동, Enter/Space로 선택 |
| 스크린 리더 | 달력 `role="grid"`, 셀 `role="gridcell"`, 적절한 `aria-label` |
| 색상 대비 | 텍스트/배경 WCAG AA (4.5:1) 이상 |
| 터치 영역 | 최소 44x44px |
| 포커스 표시 | 가시적인 포커스 링 (focus-visible) |
| 모달 포커스 트랩 | 모달/바텀시트 열림 시 포커스 트랩, 닫힘 시 원래 위치 복귀 |

---

## 13. 음식 키워드 프리셋

기록 속도 향상을 위한 자주 검색되는 음식 키워드 목록.

```typescript
const FOOD_PRESETS = [
  { keyword: '치킨', emoji: '🍗' },
  { keyword: '라면', emoji: '🍜' },
  { keyword: '피자', emoji: '🍕' },
  { keyword: '떡볶이', emoji: '🌶️' },
  { keyword: '햄버거', emoji: '🍔' },
  { keyword: '족발', emoji: '🍖' },
  { keyword: '콜라', emoji: '🥤' },
  { keyword: '아이스크림', emoji: '🍦' },
  { keyword: '과자', emoji: '🍪' },
  { keyword: '케이크', emoji: '🍰' },
  { keyword: '맥주', emoji: '🍺' },
  { keyword: '소주', emoji: '🍶' },
] as const;
```

---

## 14. 개발 단계별 구현 순서

### Phase 1: 기반 구축

1. Next.js 프로젝트 초기화 (App Router, TypeScript, Tailwind CSS)
2. Supabase 프로젝트 생성 및 DB 스키마 마이그레이션
3. Supabase Auth 설정 (Google OAuth + 이메일)
4. 인증 플로우 구현 (로그인/로그아웃/AuthGuard)
5. 디자인 토큰 설정 (Tailwind 커스텀 컬러, 폰트)

### Phase 2: 핵심 기능 (P0)

6. 달력 컴포넌트 구현 (Calendar → CalendarGrid → CalendarCell)
7. 월별 기록 조회 훅 및 달력 데이터 바인딩
8. Kakao 이미지 검색 프록시 API 구현
9. 기록 추가 폼 구현 (FoodSearch → ImageSearchResult → PortionSelector → 저장)
10. 일별 상세 보기 구현 (RecordList → RecordItem)

### Phase 3: 중요 기능 (P1) + 완성도

11. 기록 편집/삭제 기능
12. 낙관적 업데이트 적용
13. 에러 처리 및 로딩 상태 UI
14. 반응형 UI 최적화
15. 마이크로 인터랙션 & 애니메이션

### Phase 4: 배포 & QA

16. Vercel 배포 설정
17. 환경 변수 설정 (Production)
18. 크로스 브라우저 테스트
19. 성능 최적화 (Lighthouse 기준)
20. 접근성 검증

---

*이 문서는 PRD v1.0, TRD v1.0을 기반으로 작성되었으며, 개발 진행 중 변경될 수 있습니다.*
