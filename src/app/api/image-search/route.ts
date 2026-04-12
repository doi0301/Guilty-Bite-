import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED', message: '로그인이 필요합니다' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();
  const size = Math.min(Number(searchParams.get('size') || 8), 20);
  const page = Math.max(1, Math.min(Number(searchParams.get('page') || 1), 50));

  if (!query || query.length === 0) {
    return NextResponse.json(
      { error: 'INVALID_QUERY', message: '검색어를 입력해주세요' },
      { status: 400 }
    );
  }

  if (query.length > 50) {
    return NextResponse.json(
      { error: 'INVALID_QUERY', message: '검색어는 50자 이내로 입력해주세요' },
      { status: 400 }
    );
  }

  const enhancedQuery = `${query} 음식`;

  try {
    const kakaoResponse = await fetch(
      `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(enhancedQuery)}&size=${size}&page=${page}&sort=accuracy`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );

    if (!kakaoResponse.ok) {
      const errorBody = await kakaoResponse.text();
      console.error(`Kakao API error: status=${kakaoResponse.status}, body=${errorBody}`);
      if (kakaoResponse.status === 429) {
        return NextResponse.json(
          { error: 'RATE_LIMITED', message: '잠시 후 다시 시도해주세요' },
          { status: 429 }
        );
      }
      throw new Error(`Kakao API responded with ${kakaoResponse.status}: ${errorBody}`);
    }

    const data = await kakaoResponse.json();

    const filtered = {
      documents: data.documents.map((doc: Record<string, unknown>) => ({
        image_url: doc.image_url,
        thumbnail_url: doc.thumbnail_url,
        width: doc.width,
        height: doc.height,
        display_sitename: doc.display_sitename,
      })),
      meta: {
        total_count: data.meta.total_count,
        is_end: data.meta.is_end,
      },
    };

    return NextResponse.json(filtered);
  } catch (err) {
    console.error('Image search error:', err);
    return NextResponse.json(
      { error: 'UPSTREAM_ERROR', message: '이미지 검색 서비스에 일시적인 문제가 있습니다' },
      { status: 502 }
    );
  }
}
