export type PortionSize = 'small' | 'medium' | 'large';

export interface FoodRecord {
  id: string;
  user_id: string;
  date: string;
  food_name: string;
  image_url: string;
  thumbnail_url: string;
  portion: PortionSize;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecordInsert {
  date: string;
  food_name: string;
  image_url: string;
  thumbnail_url: string;
  portion: PortionSize;
  memo?: string | null;
}

export interface RecordUpdate {
  food_name?: string;
  image_url?: string;
  thumbnail_url?: string;
  portion?: PortionSize;
  memo?: string | null;
}
