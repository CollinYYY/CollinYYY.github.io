import { Component } from 'react'
import { View, Button, Input, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { checkLogin, getLoginInfo, setUserInfo, logout } from '@/utils/login';
import { uploadImage } from '@/utils/file';
import { fetchUserUpdate } from '@/service/user';
import Modal from '@/components/modal/index'

import userIcon from '@/assets/user-fill.png'

import './index.less'


// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

class User extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      isLogin: false,
      userInfo: {
        openid: '',
        avatar: '',
        nickName: ''
      },
      isShowModal: false
    }
  }

  componentWillReceiveProps (nextProps) {
    
  }

  componentWillUnmount () { }

  async componentDidShow () { 
    const isLogin = checkLogin();
    this.setState({
      isLogin
    })
    if (isLogin) {
      const userInfo = await getLoginInfo();
      this.setState({
        userInfo
      })
    }
  }

  componentDidHide () { }

  onGetUserInfo = async () => {
    Taro.showLoading({
      title: '加载中',
    })

    const userInfo = await getLoginInfo();
    const isLogin = checkLogin();
    this.setState({
      userInfo,
      isLogin
    })

    Taro.hideLoading()
  }

  onChangeAvatar = async () => {
    const imageInfo = await uploadImage('avatar');
    const { fileID } = imageInfo ?? [];
    const { userInfo } = this.state;
    userInfo.avatar = fileID;

    fetchUserUpdate({
      avatar: fileID,
      nickName: userInfo.nickName,
      watermark: userInfo.watermark
    })

    setUserInfo({
      avatar: fileID
    })

    this.setState({
      userInfo
    })
  }

  onChangeNickName = async (e) => {
    const { value } = e?.detail;
    const { userInfo } = this.state;
    userInfo.nickName = value;

    await fetchUserUpdate({
      avatar: userInfo?.avatar,
      nickName: value,
      watermark: userInfo.watermark
    })

    setUserInfo({
      nickName: value
    })

    this.setState({
      userInfo
    })
  }

  onChangeWaterMark = async (e) => {
    const { value } = e?.detail;
    const { userInfo } = this.state;
    userInfo.watermark = value;

    await fetchUserUpdate({
      avatar: userInfo?.avatar,
      nickName: userInfo?.nickName,
      watermark: value
    })

    setUserInfo({
      watermark: value
    })

    this.setState({
      userInfo
    })
  }

  onLogout = () => {
    logout()
    const isLogin = checkLogin();
    this.setState({
      isLogin,
      isShowModal: false
    })
  }

  onShowLogoutModal = (show: boolean) => {
    this.setState({
      isShowModal: show
    })
  }

  render () {
    const { isLogin, userInfo, isShowModal } = this.state;

    return (
      <View className='user'>
        <Modal desc='是否确认退出登录' show={isShowModal} onCancel={() => this.onShowLogoutModal(false)} onConfirm={this.onLogout} />
        { isLogin ? (
          <View>
            <View className='user-icon' onClick={this.onChangeAvatar}>
              <Image
                style={userInfo?.avatar ? 'width: 100%;height: 100%;': 'width: 60%;height: 60%;'}
                src={userInfo?.avatar || userIcon}
              />
            </View>
            <View className='user-name'>
              <Input type='nickname' placeholder='请输入昵称' value={userInfo?.nickName} onBlur={this.onChangeNickName} />
            </View>
            <View className='water-marker-wrapper'>
              <Text className='water-marker'>自定义签名：</Text>
              <Input placeholder='请输入水印' className='water-input' value={userInfo?.watermark} onBlur={this.onChangeWaterMark} />
            </View>
            <Button className='logout-btn' onClick={() => this.onShowLogoutModal(true)}>退出登录</Button>
          </View>
        ) : (
          <Button className='login-btn' onClick={this.onGetUserInfo}>微信一键登录</Button>
        ) }
      </View>
    )
  }
}

export default User

