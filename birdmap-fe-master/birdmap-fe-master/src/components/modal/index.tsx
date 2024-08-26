import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.less'

class Modal extends Component {
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  async componentDidShow () { 
    
  }

  componentDidHide () { }

  render () {
    const { show, title = '提示', desc = '登录密码为初始密码，请尽快修改', onConfirm, onCancel, cancelText, confirmText } = this.props
    return (
      <View>
        { show? (
          <View className='modal'>
            <View className='content'>
              <View className='title'>{title}</View>
              <View className='desc'>{desc}</View>
              <View className='bottom'>
                <View className='left' onClick={onCancel}>{ cancelText || '取消' }</View>
                <View className='right' onClick={onConfirm}>{ confirmText || '确认' }</View>
              </View>
            </View>
          </View>
        ): null }
      </View>
    )
  }
}

export default Modal