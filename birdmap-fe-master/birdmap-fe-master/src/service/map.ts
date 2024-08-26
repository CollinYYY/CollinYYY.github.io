import { postImageList, postAddressDataUpdate, postAddressInfo } from '@/constants/api';
import { request } from '@/utils/request';

export const fetchImageList = (params = {}) => request(postImageList, params);

export const fetchAddressDataUpdate = (params = {}) => request(postAddressDataUpdate, params);

export const fetchAddressInfo = (params = {}) => request(postAddressInfo, params);
