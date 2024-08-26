import { Component } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Modal from '@/components/modal/index'

import './index.less'

class ForceLogin extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      isShowModal: false,
    }
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  async componentDidShow () { 
    
  }

  componentDidHide () { }

  onClick = () => {
    
  }

  onShowModal = (show) => {
    this.setState({
      isShowModal: show
    })
  }

  onConfirm = () => {
    Taro.switchTab({
      url: '/pages/user/index'
    })
    this.onShowModal(false)
  }

  render () {
    const { children, isLogin } = this.props
    const { isShowModal } = this.state

    return (
      <View style='width: 100%;height: 100%;position: relative;' onClick={this.onClick}>
        <Modal desc='请在登录之后使用' show={isShowModal} onCancel={() => this.onShowModal(false)} onConfirm={this.onConfirm} />
        { !isLogin ? (
          <View className='login-modal' style='width: 100%;height: 100%;position: absolute;' onClick={() => this.onShowModal(true)}></View>
        ) : null }
        { children }
      </View>
    )
  }
}

export default ForceLogin