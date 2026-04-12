# TRD: Guilty Bite — Technical Requirements Document

> **문서 버전:** v1.0  
> **작성일:** 2026-04-12  
> **기반 문서:** PRD v1.0  
> **대상:** 개발팀

---

## 1. 기술 스택

### 1.1 프론트엔드

| 항목 | 기술 | 버전 | 선정 사유 |
|------|------|------|-----------|
| 프레임워크 | Next.js (App Router) | 15.x | SSR/SSG 지원, API Route 내장, 이미지 최적화 |
| 언어 | TypeScript | 5.x | 타입 안전성, DX 향상 |
| 스타일링 | Tailwind CSS | 4.x | 유틸리티 퍼스트, 빠른 UI 개발, 디자인 시스템 토큰화 용이 |
| 상태 관리 | Zustand | 5.x | 경량, 보일러플레이트 최소, React 외부에서도 접근 가능 |
| HTTP 클라이언트 | fetch (내장) | — | Next.js 캐싱과 통합 |
| 서버 상태 관리 | TanStack Query (React Query) | 5.x | 캐싱, 낙관적 업데이트, 자동 재검증 |
| 날짜 처리 | date-fns | 4.x | 트리 셰이킹 친화적, 경량 |
| 애니메이션 | Framer Motion | 12.x | 선언적 애니메이션, 레이아웃 애니메이션 지원 |
| 폰트 | Pretendard (본문), 기타 웹폰트 (제목) | — | PRD 디자인 가이드 준수 |

### 1.2 백엔드 & 인프라

| 항목 | 기술 | 선정 사유 |
|------|------|-----------|
| BaaS | Supabase | PostgreSQL 기반, Auth/Storage/Realtime 통합, Row Level Security |
| 데이터베이스 | PostgreSQL (Supabase 내장) | 관계형 데이터, RLS, 인덱싱, JSON 지원 |
| 인증 | Supabase Auth | Google OAuth, 이메일/비밀번호, 세션 관리 내장 |
| API 프록시 | Next.js Route Handlers (App Router) | Kakao API 키 서버사이드 보호 |
| 호스팅 | Vercel | Next.js 최적 배포, Edge Network, 자동 HTTPS |
| 도메인 | guiltybite.com (예정) | — |

### 1.3 외부 API

| API | 용도 | 인증 방식 |
|-----|------|-----------|
| Kakao Daum 이미지 검색 | 음식 이미지 검색 | REST API Key (서버사이드) |
| Google OAuth 2.0 | 소셜 로그인 | Supabase Auth 위임 |

### 1.4 개발 도구

| 항목 | 기술 |
|------|------|
| 패키지 매니저 | pnpm |
| 린터 | ESLint + Prettier |
| Git 호스팅 | GitHub |
| CI/CD | Vercel 자동 배포 (GitHub 연동) |

---

## 2. 시스템 아키텍처

### 2.1 전체 구조

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
│  Next.js App (React + TypeScript + Tailwind CSS)    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────┐
│                  Vercel Edge Network                 │
│  ┌───────────────────────────────────────────────┐  │
│  │  Next.js Server (App Router)                  │  │
│  │  ├─ Route Handlers (/api/*)                   │  │
│  │  │   └─ Kakao 이미지 검색 프록시              │  │
│  │  ├─ Server Components (SSR)                   │  │
│  │  └─ Static Assets (ISR/SSG)                   │  │
│  └───────────────────────────────────────────────┘  │
└───────────┬─────────────────────┬───────────────────┘
            │                     │
            ▼                     ▼
┌───────────────────┐  ┌──────────────────────┐
│  Supabase Cloud   │  │  Kakao API Server    │
│  ├─ Auth          │  │  (이미지 검색)        │
│  ├─ PostgreSQL DB │  └──────────────────────┘
│  └─ (Storage)*    │
└───────────────────┘
  * Post-MVP에서 이미지 백업 시 활용 가능
```

### 2.2 데이터 흐름

#### 음식 기록 추가 플로우

```
1. 사용자: 키워드 입력 ("치킨")
2. Client → Next.js Route Handler: GET /api/image-search?query=치킨
3. Route Handler → Kakao API: GET https://dapi.kakao.com/v2/search/image?query=치킨+음식&size=8
4. Kakao API → Route Handler: 이미지 결과 반환
5. Route Handler → Client: 이미지 결과 전달
6. 사용자: 이미지 선택, 양/메모 입력 후 저장
7. Client → Supabase: INSERT INTO records (...)
8. Supabase: RLS 검증 후 저장
9. Client: 달력 UI 즉시 갱신 (낙관적 업데이트)
```

#### 달력 데이터 로딩 플로우

```
1. Client: 현재 월의 달력 화면 진입
2. Client → Supabase: SELECT * FROM records WHERE user_id = ? AND date BETWEEN ? AND ?
3. Supabase: RLS 적용 후 결과 반환
4. Client: 달력 셀에 썸네일 배치, lazy loading 적용
```

---

## 3. 데이터베이스 스키마

### 3.1 ERD 개요

```
┌──────────────┐       ┌──────────────────┐
│    users     │       │     records      │
├──────────────┤       ├──────────────────┤
│ id (PK)      │──1:N──│ id (PK)          │
│ email        │       │ user_id (FK)     │
│ nickname     │       │ date             │
│ avatar_url   │       │ food_name        │
│ created_at   │       │ image_url        │
│ updated_at   │       │ thumbnail_url    │
└──────────────┘       │ portion          │
                       │ memo             │
                       │ created_at       │
                       │ updated_at       │
                       └──────────────────┘
```

### 3.2 테이블 상세

#### 3.2.1 profiles 테이블

Supabase Auth의 `auth.users`와 연동되는 공개 프로필 테이블.

```sql
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  nickname    TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 본인 프로필만 조회 가능
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- 본인 프로필만 수정 가능
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### 3.2.2 records 테이블

```sql
CREATE TYPE portion_size AS ENUM ('small', 'medium', 'large');

CREATE TABLE public.records (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  food_name      TEXT NOT NULL,
  image_url      TEXT NOT NULL,
  thumbnail_url  TEXT NOT NULL,
  portion        portion_size NOT NULL DEFAULT 'medium',
  memo           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;

-- 본인 기록만 조회
CREATE POLICY "Users can view own records"
  ON public.records FOR SELECT
  USING (auth.uid() = user_id);

-- 본인 기록만 삽입
CREATE POLICY "Users can insert own records"
  ON public.records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 기록만 수정
CREATE POLICY "Users can update own records"
  ON public.records FOR UPDATE
  USING (auth.uid() = user_id);

-- 본인 기록만 삭제
CREATE POLICY "Users can delete own records"
  ON public.records FOR DELETE
  USING (auth.uid() = user_id);
```

### 3.3 인덱스

```sql
-- 달력 월별 조회 최적화 (가장 빈번한 쿼리)
CREATE INDEX idx_records_user_date ON public.records (user_id, date);

-- 음식명 검색 (향후 통계/필터 기능)
CREATE INDEX idx_records_food_name ON public.records (user_id, food_name);
```

### 3.4 트리거

```sql
-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_records
  BEFORE UPDATE ON public.records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3.5 Supabase Auth 신규 가입 시 프로필 자동 생성

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 4. API 설계

### 4.1 Next.js Route Handlers (서버 API)

#### 4.1.1 Kakao 이미지 검색 프록시

| 항목 | 값 |
|------|------|
| 경로 | `GET /api/image-search` |
| 용도 | Kakao REST API 키를 서버에서 보호하면서 이미지 검색 결과 반환 |

**Request:**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| query | string | O | 검색 키워드 |
| size | number | X | 결과 수 (기본값: 8, 최대: 80) |

**Response (200 OK):**

```json
{
  "documents": [
    {
      "image_url": "https://...",
      "thumbnail_url": "https://...",
      "width": 800,
      "height": 600,
      "display_sitename": "티스토리"
    }
  ],
  "meta": {
    "total_count": 1234,
    "is_end": false
  }
}
```

**에러 응답:**

| 상태 코드 | 설명 |
|-----------|------|
| 400 | query 파라미터 누락 |
| 401 | 미인증 사용자 |
| 429 | Kakao API 쿼터 초과 |
| 500 | Kakao API 서버 오류 |

### 4.2 Supabase Client API

프론트엔드에서 Supabase JS Client를 직접 사용하여 CRUD 수행. RLS가 인증 및 권한을 보장.

#### 4.2.1 Records CRUD

| 동작 | Supabase 호출 |
|------|---------------|
| 월별 기록 조회 | `supabase.from('records').select('*').eq('user_id', uid).gte('date', startDate).lte('date', endDate).order('date')` |
| 일별 기록 조회 | `supabase.from('records').select('*').eq('user_id', uid).eq('date', date).order('created_at')` |
| 기록 추가 | `supabase.from('records').insert({ user_id, date, food_name, image_url, thumbnail_url, portion, memo })` |
| 기록 수정 | `supabase.from('records').update({ food_name, image_url, thumbnail_url, portion, memo }).eq('id', recordId)` |
| 기록 삭제 | `supabase.from('records').delete().eq('id', recordId)` |

---

## 5. 인증 설계

### 5.1 인증 플로우

```
┌──────────┐    1. Google 로그인 클릭    ┌──────────────┐
│  Client  │ ──────────────────────────→ │ Supabase Auth│
└──────────┘                             └──────┬───────┘
     ▲                                          │
     │  4. 세션 토큰 반환                        │ 2. Google OAuth 리다이렉트
     │  (access_token + refresh_token)           ▼
     │                                   ┌──────────────┐
     └───────────────────────────────── │  Google OAuth │
              3. 인증 완료 콜백           └──────────────┘
```

### 5.2 지원 인증 방식

| 방식 | 우선순위 | 구현 |
|------|----------|------|
| Google OAuth | P0 (MVP) | Supabase Auth `signInWithOAuth({ provider: 'google' })` |
| 이메일/비밀번호 | P1 (MVP) | Supabase Auth `signInWithPassword()` |
| Magic Link | P2 (Post-MVP) | Supabase Auth `signInWithOtp()` |

### 5.3 세션 관리

- Supabase JS Client가 자동으로 세션 관리 (localStorage 기반)
- `access_token` 만료 시 `refresh_token`으로 자동 갱신
- Next.js 미들웨어에서 `@supabase/ssr`을 사용하여 서버사이드 세션 검증
- 보호 라우트: 미인증 시 `/login` 페이지로 리다이렉트

---

## 6. Kakao 이미지 검색 API 연동

### 6.1 프록시 구현 상세

```
Client                    Next.js API Route              Kakao API
  │                            │                            │
  │ GET /api/image-search      │                            │
  │ ?query=치킨                │                            │
  │───────────────────────────→│                            │
  │                            │ 1. 인증 확인 (세션)         │
  │                            │ 2. 쿼리 보강 ("치킨" → "치킨 음식") │
  │                            │ 3. Rate limit 확인          │
  │                            │                            │
  │                            │ GET /v2/search/image       │
  │                            │ ?query=치킨+음식&size=8     │
  │                            │ Authorization: KakaoAK ... │
  │                            │───────────────────────────→│
  │                            │                            │
  │                            │◀───── 200 OK ──────────────│
  │                            │                            │
  │◀─── 200 OK (filtered) ────│                            │
```

### 6.2 쿼리 보강 전략

| 사용자 입력 | 서버 전송 쿼리 | 사유 |
|-------------|---------------|------|
| 치킨 | 치킨 음식 | 음식 이미지 정확도 향상 |
| 라면 | 라면 음식 | 제품 사진 아닌 실제 음식 사진 우선 |
| 콜라 | 콜라 음료 | 음료 이미지 정확도 향상 |

기본 전략: 사용자 입력 키워드 뒤에 `" 음식"` 접미사를 추가. 향후 키워드별 최적 접미사 매핑 테이블 관리 가능.

### 6.3 Rate Limiting

- 서버 측에서 사용자별 이미지 검색 요청 제한: **분당 10회**
- Kakao API 일일 쿼터 모니터링: 80% 도달 시 관리자 알림
- 쿼터 초과 시 사용자에게 안내 메시지 표시

### 6.4 이미지 URL 만료 대비

- 외부 이미지 URL은 만료될 수 있으므로 썸네일 로딩 실패 시 대체 이미지(placeholder) 표시
- `<img>` 태그의 `onerror` 핸들러로 폴백 이미지 적용
- Post-MVP: 주기적 URL 유효성 배치 검사 고려

---

## 7. 성능 요구사항 및 최적화

### 7.1 성능 목표

| 지표 | 목표 | 측정 방식 |
|------|------|-----------|
| 달력 화면 초기 로딩 (LCP) | ≤ 2.0초 | Lighthouse |
| 이미지 검색 응답 시간 | ≤ 1.5초 | API 응답 시간 |
| 기록 저장 체감 시간 | ≤ 0.5초 | 낙관적 업데이트 |
| First Input Delay (FID) | ≤ 100ms | Web Vitals |
| Cumulative Layout Shift (CLS) | ≤ 0.1 | Web Vitals |

### 7.2 최적화 전략

| 영역 | 전략 |
|------|------|
| 썸네일 로딩 | `thumbnail_url` 사용 (원본 대비 경량), Intersection Observer 기반 lazy loading |
| 데이터 캐싱 | TanStack Query로 월별 데이터 캐싱, `staleTime: 5분` |
| 이미지 검색 | 검색 입력에 300ms 디바운싱 적용 |
| 번들 최적화 | Next.js 자동 코드 스플리팅, dynamic import (모달/바텀시트) |
| 폰트 최적화 | `next/font`로 Pretendard 최적 로딩, `font-display: swap` |
| 낙관적 업데이트 | 기록 추가/수정/삭제 시 UI 즉시 반영, 서버 응답 후 확정 |

---

## 8. 보안 요구사항

### 8.1 데이터 보호

| 항목 | 대책 |
|------|------|
| 전송 암호화 | HTTPS 필수 (Vercel 자동 적용) |
| 데이터 격리 | Supabase RLS로 사용자별 데이터 완전 격리 |
| API 키 보호 | Kakao REST API 키는 환경 변수로 서버사이드에서만 접근 |
| XSS 방지 | React 기본 이스케이핑 + 사용자 입력 sanitize |
| CSRF 방지 | SameSite 쿠키 정책, Origin 검증 |

### 8.2 환경 변수

| 변수명 | 용도 | 위치 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 클라이언트 노출 가능 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | 클라이언트 노출 가능 (RLS가 보호) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서비스 키 | 서버 전용, 절대 노출 금지 |
| `KAKAO_REST_API_KEY` | Kakao API 인증 키 | 서버 전용, 절대 노출 금지 |

---

## 9. 배포 및 인프라

### 9.1 배포 파이프라인

```
GitHub main 브랜치 Push
        │
        ▼
Vercel 자동 빌드 & 배포
  ├─ Preview: PR별 미리보기 URL 자동 생성
  └─ Production: main 머지 시 자동 배포
```

### 9.2 환경 구성

| 환경 | 용도 | Supabase 프로젝트 |
|------|------|--------------------|
| Development | 로컬 개발 | 개발용 프로젝트 |
| Preview | PR 미리보기 | 개발용 프로젝트 |
| Production | 서비스 운영 | 운영용 프로젝트 |

### 9.3 모니터링

| 항목 | 도구 |
|------|------|
| 프론트엔드 에러 | Vercel Analytics (기본) |
| Web Vitals | Vercel Speed Insights |
| API 에러 로그 | Vercel Function Logs |
| DB 모니터링 | Supabase Dashboard |

---

## 10. 브라우저 호환성

| 브라우저 | 최소 버전 |
|----------|-----------|
| Chrome | 최신 2개 버전 |
| Safari | 최신 2개 버전 |
| Samsung Internet | 최신 2개 버전 |
| Edge | 최신 2개 버전 |
| Firefox | 최신 2개 버전 (베스트 에포트) |

---

## 11. 향후 확장 고려사항 (Post-MVP)

| 항목 | 설명 |
|------|------|
| 이미지 백업 | Supabase Storage에 선택 이미지 복사 저장 (URL 만료 대비) |
| PWA 지원 | Service Worker 기반 오프라인 캐싱, 홈 화면 추가 |
| Push 알림 | Web Push API 또는 FCM 기반 리마인드 알림 |
| 카테고리 시스템 | 태그 테이블 분리, 자동 태깅 (키워드-카테고리 매핑) |
| 월간 통계 | PostgreSQL 집계 함수 활용, 서버사이드 연산 |
| 다국어 지원 | next-intl 도입 |

---

*이 문서는 PRD v1.0을 기반으로 작성되었으며, 개발 진행 중 변경될 수 있습니다.*
