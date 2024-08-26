import Taro from '@tarojs/taro';

const __CERTIFICATE_KEY__ = '__CERTIFICATE_KEY__'

export const setCertificate = () => {
  Taro.setStorageSync(__CERTIFICATE_KEY__, 1)
}

export const checkCertificate = () => {
  return Taro.getStorageSync(__CERTIFICATE_KEY__) || false
}