import { postLikeUpdate, postLikeImages } from '@/constants/api';
import { request } from '@/utils/request';

export const fetchLikeUpdate = (params = {}) => request(postLikeUpdate, params, { isLoading: false });

export const fetchLikeImages = (params = {}) => request(postLikeImages, params, { isLoading: true });
