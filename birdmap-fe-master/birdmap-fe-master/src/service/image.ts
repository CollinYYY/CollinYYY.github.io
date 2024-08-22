import { postAIClassify, postAIInfo, postImageAdd, postAIRecords } from '@/constants/api';
import { request } from '@/utils/request';

export const fetchAIClassify = (params = {}) => request(postAIClassify, params, { isLoading: true });

export const fetchAIInfo = (params = {}) => request(postAIInfo, params, { isLoading: true });

export const fetchImageAdd = (params = {}) => request(postImageAdd, params, { isLoading: true });

export const fetchAIRecords = () => request(postAIRecords, {})