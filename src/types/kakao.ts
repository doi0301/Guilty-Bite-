export interface KakaoImageDocument {
  image_url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  display_sitename: string;
  doc_url: string;
  collection: string;
  datetime: string;
}

export interface KakaoImageSearchResponse {
  documents: KakaoImageDocument[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

export interface ImageSearchResult {
  image_url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  display_sitename: string;
}

export interface ImageSearchResponse {
  documents: ImageSearchResult[];
  meta: {
    total_count: number;
    is_end: boolean;
  };
}
