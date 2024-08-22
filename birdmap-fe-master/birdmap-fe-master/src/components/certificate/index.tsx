import { Component } from 'react'
import { View, Image, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Modal from '@/components/modal/index'

import SelectDisable from '@/assets/select-disable.png'
import SelectActive from '@/assets/select-active.png'

import { CertificateList } from '@/constants/index'

import './index.less'

class Certificate extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      list: CertificateList.map(item => ({
        label: item.label,
        value: false
      }))
    }
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  async componentDidShow () { 
    
  }

  componentDidHide () { }

  onSelect = (index: number) => {
    const { list } = this.state;
    const item = list[index];
    list.splice(index, 1, {...item, value: !item.value})
    this.setState({
      list
    })
  }

  onClick = () => {
    const { onCallback } = this.props;
    const { list } = this.state;
    const disable = list.some(item => !item.value);
    if (!disable) {
      onCallback()
    }
  }

  render () {
    const { list } = this.state;
    const { show } = this.props
    const btnDisable = list.some(item => !item.value);

    return <View>
      { show ? (
        <View className='certificate'>
          <View className='content'>
            <View className='content-title'>承诺书</View>
            <View className='content-desc'>本人承诺拍摄即将上传的照片是本人拍摄的，拍摄时并没有采取任何一项下列措施，且本人知晓若经举报发现未如实填写，视情况严重程度会被处以相应的封号时间</View>
            <View className='content-selects'>
              { list.map((item, index) => (
                <View key={item.label} className='content-selects-item' onClick={() => this.onSelect(index)}>
                  <Image className='icon' src={item.value ? SelectActive : SelectDisable} />
                  <Text>{item.label}</Text>
                </View>
              )) }
            </View>
            <View className={`btn ${btnDisable ? 'disabled' : ''}`} onClick={this.onClick}>确认</View>
          </View>
        </View>
      ) : null }
    </View>
  }
}

export default Certificate