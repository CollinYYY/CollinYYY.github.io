import { postUserUpdate } from '@/constants/api';
import { request } from '@/utils/request';

export const fetchUserUpdate = (params) => request(postUserUpdate, params);