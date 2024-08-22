import { Component } from 'react'
import { View, Button, Input, Image, Map as MapComponent, CoverView, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { fetchImageList, fetchAddressDataUpdate } from '@/service/map';
import { LAYER_ID, MAP_KEY } from '@/constants/index';
import { unique } from '@/utils/array';

import Dot from '@/assets/dot.png'

import './index.less'

class Map extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      isHeatmap: false,
      markers: [],
      markersStore: [],
      cache: {},
      list: [],
      mapCtx: null
    }
  }

  componentWillReceiveProps (nextProps) {
    
  }

  componentWillUnmount () { }

  async componentDidShow () {     
    const mapCtx = Taro.createMapContext('mapId')
    this.setState({
      mapCtx: mapCtx
    })

    try {
      await this.getList()
    } catch {

    }
    
    setTimeout(() => {
      const { isHeatmap } = this.state
      if (isHeatmap) {
        this.onAddVisualLayer()
      }
    }, 500)
  }

  getList = async () => {
    const res = await fetchImageList()
    const markers = []
    if (res.length) {
      let cache = {}
      res.forEach((item, index) => {
        if (!cache[item.address]) {
          cache[item.address] = item.name ? [item.name] : [item.enName];
          markers.push({
            id: index,
            latitude: item.lat,
            longitude: item.lng,
            iconPath: Dot,
            width: 30,
            height: 30,
            customCallout: {
              display: 'BYCLICK',
              anchorX: 0,
              anchorY: 0
            },
          })
        } else {
          cache[item.address] = unique([...cache[item.address], item.name ? item.name : item.enName]);
        }
      })

      const params = {
        data: Object.keys(cache).map(key => {
          const info = res.find(item => item.address === key);
          return [info.lat,info.lng,cache[key].length]
        })
      }

      await fetchAddressDataUpdate({
        ...params
      })

      this.setState({
        markers,
        markersStore: markers,
        cache,
        list: res
      })
    }
  }

  onAddMarkers = () => {
    this.onShowLoading()
    const { mapCtx, markers, markersStore } = this.state
    mapCtx.removeVisualLayer({
      layerId:LAYER_ID
    })

    this.setState({
      isHeatmap: false,
      markers: markersStore
    })
  }

  onAddVisualLayer = () => {
    this.onShowLoading()
    const { mapCtx, markers } = this.state
    this.setState({
      markers: []
    })
    mapCtx.addVisualLayer({
      layerId: LAYER_ID,
      interval: 30,
      zIndex: 100,
      success: e => {
        console.log(e)
      }
    })
    
    this.setState({
      isHeatmap: true
    })
  }

  onShowLoading = () => {
    Taro.showLoading({
      title: '加载中'
    })
    setTimeout(() => {
      Taro.hideLoading()
    }, 2000)
  }

  onMarkerTap = (e) => {
    const { markerId } = e.detail;
  }

  onGetAddress = (index) => {
    const { list } = this.state
    return list[index].address
  }

  onGetBirds = (index) => {
    const address = this.onGetAddress(index)
    const { cache } = this.state
    
    return cache[address] ? cache[address]?.filter(item => !item.includes('?'))?.join('、') : null
  }

  onToList = (e) => {
    const { markerId } = e.detail
    const address = this.onGetAddress(markerId)

    Taro.navigateTo({
      url: `/pages/map/list/index?address=${address}`
    })
  }

  componentDidHide () { }

  render () {
    const { markers, isHeatmap } = this.state

    return (
      <View className='container'>
        <MapComponent id='mapId' longitude={121.472412} markers={markers} latitude={31.230053} onCalloutTap={this.onToList} onMarkerTap={this.onMarkerTap} subkey={MAP_KEY} scale={12.5} className='map'>
          <CoverView slot='callout'>
            { markers && markers.length ? markers.map(item => (
              <CoverView markerId={item.id} key={item.id} className='popover'>
                  <CoverView className='title'>观鸟点</CoverView>
                  <CoverView className='popover-desc'>{ this.onGetAddress(item.id) }</CoverView>
                  <CoverView className='title'>主要鸟类</CoverView>
                  <CoverView className='popover-desc'>{ this.onGetBirds(item.id) }</CoverView>
                  <CoverView className='show-more' onClick={this.onToList}>
                    查看更多
                  </CoverView>
              </CoverView>
            )) : null }
          </CoverView>
        </MapComponent>
        <View className='btn' onClick={isHeatmap ? this.onAddMarkers : this.onAddVisualLayer}>切换至{ isHeatmap ? '标记图' : '热力图'}</View>
      </View>
    )
  }
}

export default Map