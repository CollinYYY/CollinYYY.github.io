import Taro from '@tarojs/taro'
import { EnumReqCode, host } from '@/constants/index';
import { getLoginInfo, checkLogin } from '@/utils/login';

export const request = async (path: string, params, options = { isLoading: true }) => {
  if (!checkLogin()) {
    Taro.showToast({
      title: '尚未登录，请前往登录',
      icon: 'none'
    })
    setTimeout(() => {
      Taro.switchTab({
        url: '/pages/user/index',
      })
    }, 1000)
    return
  }
  if (options.isLoading) {
    Taro.showLoading({
      title: '加载中',
    })
  }
  
  const { openid } = await getLoginInfo();

  const res = await await Taro.request({
    url: host + path,
    method: "POST",
    header: {
      'content-type': 'application/json',
      'openid': openid
    },
    data:{
      ...params
    }
  });
  const { data: { code, data, msg } } = res || {}
  Taro.hideLoading()
  if(code === EnumReqCode.Fail) {
    Taro.showToast({
      title: msg || '网络错误，请刷新后重试',
      icon: 'none'
    })
    return false
  }
  return data || true
}