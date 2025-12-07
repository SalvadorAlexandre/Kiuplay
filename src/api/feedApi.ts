// src/api/feedApi.ts

import apiClient from './apiClient';
import { BeatStoreFeedItem } from '@/src/types/contentType';
import { LibraryFeedItem } from '@/src/types/contentType';

// Feed da BeatStore
export const getBeatStoreFeed = async (page = 1, limit = 20): Promise<{ data: BeatStoreFeedItem[], total: number }> => {
  const response = await apiClient.get(`/feed/beatstore?page=${page}&limit=${limit}`);
  return response.data; // já contém { data, total }
};

// Feed da Library
export const getLibraryFeed = async (page = 1, limit = 20): Promise<{ data: LibraryFeedItem[], total: number }> => {
  const response = await apiClient.get(`/feed/library?page=${page}&limit=${limit}`);
  return response.data; // já contém { data, total }
};


{/** import apiClient from './apiClient';
import { BeatStoreFeedItem } from '@/src/types/contentType';
import { LibraryFeedItem } from '@/src/types/contentType';

// Feed da BeatStore
export const getBeatStoreFeed = async (page = 1, limit = 20): Promise<BeatStoreFeedItem[]> => {
  const { data } = await apiClient.get(`/feed/beatstore?page=${page}&limit=${limit}`);
  return data;
};

// Feed da Library
export const getLibraryFeed = async (page = 1, limit = 20): Promise<LibraryFeedItem[]> => {
  const { data } = await apiClient.get(`/feed/library?page=${page}&limit=${limit}`);
  return data;
};*/}






