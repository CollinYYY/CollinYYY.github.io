import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { fetchImageList } from '@/service/map';
import { fetchLikeUpdate } from '@/service/like';

import UserAvatar from '@/assets/user-avatar.png'
import Heart from '@/assets/hear.png'
import HeartFull from '@/assets/hear-full.png'

import './index.less'

class MapList extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      list: [],
      $instance: Taro.getCurrentInstance(),
      isHotOrder: true
    }
  }

  async componentDidMount () {  
    this.getList()
  }

  getList = async () => {
    const { $instance, isHotOrder } = this.state
    const { address } = $instance.router.params
    let list = await fetchImageList({
      address
    })
    if (isHotOrder) {
      list = list.sort((a, b) => b.likeNum - a.likeNum)
    } else {
      list = list.sort((a, b) => (new Date(b.createTime)) - (new Date(a.createTime)))
    }
    this.setState({
      list
    })
  }

  onUpdateLike = async (isLike: boolean, imageId: string) => {
    await fetchLikeUpdate({
      isLike,
      imageId
    })
    const { list } = this.state;
    const index = list.findIndex(item => item.imageId === imageId)
    list[index].isLike = isLike
    list[index].likeNum = isLike ? list[index].likeNum + 1 : list[index].likeNum - 1

    this.setState({
      list
    })
  }

  onIsHot = (isHotOrder) => {
    this.setState({
      isHotOrder
    }, () => {
      this.getList()
    })
  }

  onPreview = (url) => {
    Taro.previewMedia({
      sources: [{
        url
      }]
    })
  }

  render () {
    const { list, isHotOrder } = this.state;
    const list1 = list.filter((_, index) => index % 2 === 0)
    const list2 = list.filter((_, index) => index % 2 === 1)

    return (
      <View className='container'>
        <View className='selectors'>
          <View className={`selector ${isHotOrder ? 'active' : ''}`} onClick={() => this.onIsHot(true)}>按热度排序</View>
          <View className={`selector ${!isHotOrder ? 'active' : ''}`} onClick={() => this.onIsHot(false)}>按时间排序</View>
        </View>
        <View className='body'>
          <View className='body-left'>
            { list1.length ? list1.map((item, index) => (
              <View className='card' key={index}>
                <Image className='image' mode='aspectFill' onClick={() => this.onPreview(item.imageId.includes('cloud://') ? item.imageId : `cloud://prod-4gxykas5f6c2f40a.7072-prod-4gxykas5f6c2f40a-1307661713/Shanghai/${item.imageId}.jpg`)} src={item.imageId.includes('cloud://') ? item.imageId : `cloud://prod-4gxykas5f6c2f40a.7072-prod-4gxykas5f6c2f40a-1307661713/Shanghai/${item.imageId}.jpg`} />
                <View className='date'>{item.createTime.split(' ')[0]}</View>
                <View className='info'>
                  <View className='flex'>
                    <Image src={item.avatar ? item.avatar : UserAvatar} className='avatar' />
                    <Text className='nick-name'>{item.nickName || '未命名用户'}</Text>
                  </View>
                  <View className='flex'>
                    <Text className='num'>{item.likeNum}</Text>
                    <Image onClick={() => this.onUpdateLike(!item.isLike, item.imageId)} src={item.isLike ? HeartFull : Heart} className='heart' />
                  </View>
                </View>
              </View>
            )) : null }    
          </View>
          <View className='body-right'>
            { list2.length ? list2.map((item, index) => (
                <View className='card' key={index}>
                  <Image className='image' mode='aspectFill' onClick={() => this.onPreview(item.imageId.includes('cloud://') ? item.imageId : `cloud://prod-4gxykas5f6c2f40a.7072-prod-4gxykas5f6c2f40a-1307661713/Shanghai/${item.imageId}.jpg`)} src={item.imageId.includes('cloud://') ? item.imageId : `cloud://prod-4gxykas5f6c2f40a.7072-prod-4gxykas5f6c2f40a-1307661713/Shanghai/${item.imageId}.jpg`} />
                  <View className='date'>{item.createTime.split(' ')[0]}</View>
                  <View className='info'>
                    <View className='flex'>
                      <Image src={item.avatar ? item.avatar : UserAvatar} className='avatar' />
                      <Text className='nick-name'>{item.nickName || '未命名用户'}</Text>
                    </View>
                    <View className='flex' onClick={() => this.onUpdateLike(!item.isLike, item.imageId)}>
                      <Text className='num'>{item.likeNum}</Text>
                      <Image src={item.isLike ? HeartFull : Heart} className='heart' />
                    </View>
                  </View>
                </View>
              )) : null }  
          </View>
        </View>
      </View>
    )
  }
}

export default MapList