import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getLoginInfo } from '@/utils/login'
import { fetchImageList } from '@/service/map';
import { fetchLikeImages , fetchLikeUpdate } from '@/service/like'

import UserAvatar from '@/assets/user-avatar.png'
import Heart from '@/assets/hear.png'
import HeartFull from '@/assets/hear-full.png'

import './index.less'

type PageStateProps = {
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

class Index extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      list: [],
      listAll: [],
      currentPage: 1,
      limit: 10,
      recommend: {
        bestPhotos: [
          'cloud://prod-4gxykas5f6c2f40a.7072-prod-4gxykas5f6c2f40a-1307661713/exif/1647175484736-ocZME0R_lXuI2jVyTQUGbz7BW8dQ.jpg'
        ],
        bestScience: [
          'cloud://prod-4gxykas5f6c2f40a.7072-prod-4gxykas5f6c2f40a-1307661713/exif/1647175397766-ocZME0R_lXuI2jVyTQUGbz7BW8dQ.jpg',
          'cloud://prod-4gxykas5f6c2f40a.7072-prod-4gxykas5f6c2f40a-1307661713/exif/1647175580964-ocZME0R_lXuI2jVyTQUGbz7BW8dQ.jpg'
        ]
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    
  }

  componentWillUnmount () { }

  async componentDidShow () { 
    const { list } = this.state
    if (list.length === 0) {
      this.getList()
    }
  }

  componentDidHide () { }

  onPreview = (url) => {
    Taro.previewMedia({
      sources: [{
        url
      }]
    })
  }

  getList = async () => {
    const { limit } = this.state 
    let list = await fetchImageList()
   
    const listAll = list.sort((a, b) => b.likeNum - a.likeNum)
    list = listAll.slice(0, limit)
    
    this.setState({
      list,
      listAll,
      currentPage: 1
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

  onReachBottom = () => {
    const { listAll, currentPage, list, limit } = this.state
    const list2 = [...list, ...listAll.slice(limit * currentPage, limit * (currentPage + 1))]
    this.setState({
      list: list2
    })
  }

  render () {
    const { list, recommend } = this.state
    const list1 = list.filter((_, index) => index % 2 === 0)
    const list2 = list.filter((_, index) => index % 2 === 1)

    return (
      <View className='index'>
        <Swiper
          className='swiper'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          autoplay
        >
          { recommend.bestPhotos.map((item, index) => (
            <SwiperItem key={item} onClick={() => this.onPreview(item)}>
              <View className='img-wrapper'>
                <View className='tag'>最佳科研</View>
                <Image src={item} className='img' mode='aspectFill' />
              </View>
            </SwiperItem>
          )) }
          { recommend.bestScience.map((item, index) => (
            <SwiperItem key={item} onClick={() => this.onPreview(item)}>
              <View className='img-wrapper'>
                <View className='tag'>最佳摄影</View>
                <Image src={item} className='img' mode='aspectFill' />
              </View>
            </SwiperItem>
          )) }
        </Swiper>

        <View className='title'>照片鉴赏</View>

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

export default Index

