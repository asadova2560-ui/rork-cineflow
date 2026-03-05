export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  category: 'film' | 'serial' | 'multfilm' | 'multserial';
  rating?: string;
  duration?: string;
  description: string;
  poster: string;
  isFHD: boolean;
  isAdult: boolean;
  isFree: boolean;
  episodes?: number;
}

export interface Genre {
  id: string;
  name: string;
  image: string;
}

export interface TVChannel {
  id: string;
  name: string;
  logo: string;
  isFree: boolean;
  category: 'sport' | 'entertainment' | 'news' | 'kids' | 'movie' | 'music';
}

export interface UserProfile {
  id: number;
  name: string;
  avatar?: string;
  balance: number;
  subscription: string;
  subscriptionExpiry: string;
  isSubscribed: boolean;
}

export type MovieCategory = 'barchasi' | 'film' | 'serial' | 'multfilm' | 'multserial';
export type TVTab = 'barchasi' | 'tavsiya' | 'saqlangan';
