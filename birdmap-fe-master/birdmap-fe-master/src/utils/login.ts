import Taro from '@tarojs/taro';
import { postWxLogin } from '@/constants/api';
import { EnumReqCode, host } from '@/constants/index';

const __STORE_LOGIN__ = '__STORE_LOGIN__';

export const getLoginInfo = async () => {
  if (checkLogin()) {
    const loginInfo = Taro.getStorageSync(__STORE_LOGIN__);
    return loginInfo;
  }

  const res = await Taro.login();

  const { data: { code, data } } = await Taro.request({
    url: host + postWxLogin, //仅为示例，并非真实的接口地址
    data: {
      code: res.code,
    },
    header: {
      'content-type': 'application/json'
    },
    method: "POST",
  })

  if (code === EnumReqCode.Success) {
    const { openid, avatar, nickName, watermark } = data || {};
    Taro.setStorageSync(__STORE_LOGIN__, {
      openid,
      avatar,
      nickName,
      watermark
    })
    return {
      openid,
      avatar,
      nickName,
      watermark
    }
  }
}

export const setUserInfo = ({ openid, avatar, nickName, watermark }: {
  openid?: string,
  avatar?: string,
  nickName?: string,
  watermark?: string
}) => {
  const loginInfo = Taro.getStorageSync(__STORE_LOGIN__);

  Taro.setStorageSync(__STORE_LOGIN__, {
    openid: openid ?? loginInfo.openid,
    avatar: avatar ?? loginInfo.avatar,
    nickName: nickName ?? loginInfo.nickName,
    watermark: watermark ?? loginInfo.watermark,
  })
}

export const checkLogin = () => {
  const loginInfo = Taro.getStorageSync(__STORE_LOGIN__);
  
  if (loginInfo) {
    return true;
  }
  return false;
}

export const logout = () => {
  Taro.removeStorageSync(__STORE_LOGIN__)
}