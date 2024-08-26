import { Component } from 'react'
import { View, Button, Input, Text, Image, Canvas } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { uploadImage, randomFileName, getImageExif, getUrl, getImageInfo, getImageMainColor, drawWaterMarker } from '@/utils/file';
import ForceLogin from '@/components/force-login';
import { checkLogin } from '@/utils/login'
import { titleMap, EnumSelectNum, BirdSizeList, EnumBirdSize, EnumBirdColor, BirdSizeMap, BirdColorMap, EnumBirdBehaviour, BirdBehaviourList, BirdBehaviourMap, UploadError, UploadErrorMsg } from '@/constants/index';
import { fetchAddressInfo } from '@/service/map';
import { fetchAIClassify, fetchAIInfo, fetchImageAdd, fetchAIRecords } from '@/service/image';
import { dateConvert } from '@/utils/date';
import { arraySome, arrayAll } from  '@/utils/array';
import Modal from '@/components/modal/index';
import Certificate from '@/components/certificate/index';
import { checkCertificate, setCertificate } from '@/utils/certificate';

import cameraIcon from '@/assets/camera.png'
import arrRightIcon from '@/assets/arr-right.png'
import bird1 from '@/assets/bird-1.png'
import bird2 from '@/assets/bird-2.png'
import bird3 from '@/assets/bird-3.png'
import bird4 from '@/assets/bird-4.png'
import gouWhite from '@/assets/gou-white.png'
import gouBlack from '@/assets/gou-black.png'
import nextIcon from '@/assets/next.png'

import './index.less'

class Upload extends Component {
  constructor (props) {
    super(props)
    this.state = { 
      isLogin: false,
      fileID: "",
      isShowSelect: false,
      selectNum: EnumSelectNum.First,
      selectBirdSize: null,
      selectBirdBehaviour: null,
      selectBirdColors: [],
      error: null,
      imgInfo: {
        name: '',
        address: '',
        imageId: '',
        feature: '',
        habit: '',
        enName: '',
        lat: '',
        lng: '',
        createTime: '',
        spread: ''
      },
      isShowModal: false,
      refused: false,
      currentLocation: {
        latitude: null,
        longitude: null
      },
      isNoExifAddress: false,
      canvas: {
        width: 0,
        height: 0
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    
  }

  componentWillUnmount () { }

  async componentDidShow () {
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        this.setState({
          currentLocation: {
            latitude,
            longitude
          }
        })
      }
     })
     
    this.setState({
      isLogin: checkLogin()
    })
  }

  componentDidHide () { }

  onUpload = async () => {
    let { width, height, tempFilePath } = await getImageInfo() || {}
    const ratio = Math.max(width, height) / 500
    width = width / ratio;
    height =  height / ratio;

    this.setState({
      canvas: {
        width,
        height
      }
    }, async () => {
      let path
      try {
        Taro.showLoading({
          title: '图片处理中'
        })
        const color = await getImageMainColor({
          width, 
          height, 
          tempFilePath
        })
        path = await drawWaterMarker({
          width, 
          height, 
          tempFilePath,
          color
        })
        Taro.hideLoading()
      } catch {}
      
      const info = await getImageExif({
        width,
        height,
        tempFilePath,
        path: path || tempFilePath
      });
      const { fileID, exif } = info || {};
      this.setState({
        fileID
      })
      if (exif && exif?.exif?.DateTime?.description) {
        const createTime = exif?.exif?.DateTime?.description;
  
        const { gps: { Latitude, Longitude } = {} } = exif || {};
        let addressFull;
        if (Latitude && Longitude) {
          const addressInfo = await fetchAddressInfo({
            latitude: Latitude,
            longitude: Longitude
          })
          const { address, address_reference: { landmark_l2: { title } } } = addressInfo;
          addressFull = address + title;
        }
  
        // 获取ai识别结构
        const urls = await getUrl(fileID);
        const { tempFileURL } = urls?.[0] ?? {};
        const aiInfo = await fetchAIClassify({
          ImageURL: tempFileURL
        })
  
        if (!aiInfo || !aiInfo.length) {
          this.setState({
            error: UploadError.aiError,
            imgInfo: {
              address: addressFull,
              createTime: dateConvert(createTime)
            }
          })
          return
        }
  
        let enName
        if (aiInfo && aiInfo.length) {
          enName = aiInfo[0];
        }
  
        const { spread, feature, habit, name } = fetchAIInfo({
          keyword: enName
        })
        
        this.setState({
          imgInfo: {
            name: name || '',
            address: addressFull,
            imageId: fileID,
            feature: feature,
            spread,
            habit: habit,
            enName: enName,
            lat: Latitude,
            lng: Longitude,
            createTime: dateConvert(createTime)
          }
        })
      } else {
        this.setState({
          error: UploadError.exifError
        })
      }
    })
  }

  onSelectSize = (item: EnumBirdSize) => {
    const { low, high } = BirdSizeMap[item];
    Taro.showToast({
      icon: 'none',
      title: `选择的大小范围为${low}cm-${high}cm`
    })
    this.setState({
      selectBirdSize: item
    })
  }

  onSelectBirdBehaviour = (item: EnumBirdBehaviour) => {
    this.setState({
      selectBirdBehaviour: item
    })
  }

  onSelectBirdColor = (item: EnumBirdColor) => {
    let { selectBirdColors } = this.state;
    if (selectBirdColors.includes(item)) {
      selectBirdColors = selectBirdColors.filter(color => color !== item)
    } else if (selectBirdColors.length < 3) {
      selectBirdColors.push(item)
    }
    this.setState({
      selectBirdColors: selectBirdColors
    })
  }

  checkSelect = async () => {
    const { selectBirdSize, selectBirdBehaviour, selectBirdColors, imgInfo } = this.state
    if (!selectBirdSize || !selectBirdBehaviour || !selectBirdColors.length) return;

    Taro.showLoading({
      title: '识别中...'
    })

    const range = BirdSizeMap[selectBirdSize];
    const colorList = selectBirdColors.map(item => BirdColorMap[item]);
    const behaviour = BirdBehaviourMap[selectBirdBehaviour];

    const records = await fetchAIRecords();
    
    let res = records.filter(item => {
      const { colors, noColors, size, category } = item;
      const colorsArr  = colors.split('');
      const noColorsArr  = noColors.split('');

      if (arraySome(noColorsArr, colorList)) {
        return false;
      }

      if (arrayAll(colorsArr, colorList) && Number(size) >= range.low && Number(size) <= range.high && behaviour === category) {
        return true;
      }

      return false;
    })

    if (res.length === 0) {
      res = records.filter(item => {
        const { colors, noColors, size, category } = item;
        const colorsArr  = colors.split('');
        const noColorsArr  = noColors.split('');
  
        if (arraySome(noColorsArr, colorList)) {
          return false;
        }
  
        if (arrayAll(colorsArr, colorList) && Number(size) >= range.low && Number(size) <= range.high) {
          return true;
        }
  
        return false;
      })
    }

    if (res.length === 0) {
      res = records.filter(item => {
        const { colors, noColors, size, category } = item;
        const colorsArr  = colors.split('');
        const noColorsArr  = noColors.split('');
  
        if (arraySome(noColorsArr, colorList)) {
          return false;
        }
  
        if (arraySome(colorsArr, colorList) && Number(size) >= range.low && Number(size) <= range.high) {
          return true;
        }
  
        return false;
      })
    }

    if (res.length === 0) {
      res = records.filter(item => {
        const { colors, noColors, size, category } = item;
        const colorsArr  = colors.split('');
  
        if (arraySome(colorsArr, colorList) || (Number(size) >= range.low && Number(size) <= range.high)) {
          return true;
        }
  
        return false;
      })
    }

    const info = res[0];
    this.setState({
      imgInfo: {
        ...imgInfo,
        name: info.name,
        feature: info.feature,
        habit: info.habit,
        spread: info.spread,
        enName: info.enName,
      },
      isShowSelect: false
    })    
  }

  reset = () => {
    this.setState({
      fileID: "",
      isShowSelect: false,
      selectNum: EnumSelectNum.First,
      selectBirdSize: null,
      selectBirdBehaviour: null,
      selectBirdColors: [],
      error: null,
      imgInfo: {
        name: '',
        address: '',
        imageId: '',
        feature: '',
        habit: '',
        enName: '',
        lat: '',
        lng: '',
        createTime: '',
        spread: ''
      },
      isShowModal: false,
      refused: false,
      showCertificate: false,
      isNoExifAddress: false
    })
  }

  onAddImage = async () => {
    const { imgInfo, isNoExifAddress } = this.state;
    try {
      const res = await fetchImageAdd({
        ...imgInfo,
        noExif: isNoExifAddress
      })
      this.setState({
        isShowModal: res
      })
    } catch {
      Taro.showToast({
        icon: 'none',
        title: '未知错误，发布失败'
      })
      setTimeout(() => {
        this.reset()
      }, 1000)
    }
  }

  onShowSelect = (isShowSelect: boolean) => {
    this.setState({
      isShowSelect,
      refused: true,
      error: null
    })
  }

  onSwitchBirdMap = () => {
    this.setState({
      isShowModal: false
    })
    this.reset()
    Taro.switchTab({
      url: '/pages/map/index'
    })
  }

  onSelectNext = () => {
    const { selectNum } = this.state;

    let nextNum

    if (selectNum === EnumSelectNum.First) {
      nextNum = EnumSelectNum.Second
    } else if (selectNum === EnumSelectNum.Second) {
      nextNum = EnumSelectNum.Third
    } else {
      this.checkSelect()
    }

    this.setState({
      selectNum: nextNum
    })
  }

  onCertificateCallback = () => {
    this.setState({
      showCertificate: false
    })
    setCertificate()
    this.onUpload()
  }

  onCheckCertificate = () => {
    const show = !checkCertificate()
    if (show) {
      this.setState({
        showCertificate: true
      })
    } else {
      this.onUpload()
    }
  }

  onChooseLocation = () => {
    const { currentLocation, imgInfo } = this.state
    if (imgInfo.address) return

    const { latitude, longitude } = currentLocation ?? {}
    Taro.chooseLocation({
      latitude: latitude || 31.230053,
      longitude: longitude || 121.472412,
      success: (e) => {
        const { latitude: lat, longitude: lng, address } = e ?? {}
        const { imgInfo } = this.state
        this.setState({
          imgInfo: {
            ...imgInfo,
            lat: lat,
            lng: lng,
            address
          },
          isNoExifAddress: true
        })
      }
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
    const { isLogin, fileID, isShowSelect, selectNum, selectBirdSize, selectBirdBehaviour, selectBirdColors, error, imgInfo, isShowModal, refused, showCertificate, canvas } = this.state;
    const isShowNext = (selectNum === EnumSelectNum.First && selectBirdSize) || (selectNum === EnumSelectNum.Second && selectBirdColors.length) || (selectNum === EnumSelectNum.Third && selectBirdBehaviour)

    return (
      <View className={`upload ${fileID ? 'no-padding' : ''}`}>
        <Certificate show={showCertificate} onCallback={this.onCertificateCallback} />
        <Canvas canvasId='canvas'  className='canvas' style={`width:${canvas.width}px;height:${canvas.height}px;`} />
        <Modal desc={refused ? '照片已保存到数据库，等待后续人工核验' : '发布成功'} show={isShowModal} cancelText='前往观鸟地图' confirmText='继续发布' onCancel={this.onSwitchBirdMap} onConfirm={this.reset} />
        { !fileID ? (
          <ForceLogin isLogin={isLogin} >
            <View className='camera-wrapper' onClick={this.onCheckCertificate}>
              <Image
                className='camera'
                src={cameraIcon}
              />
            </View>
            <View className='upload-title'>点击相框选择观鸟照片</View>
          </ForceLogin>
        ) : (
          <View className='content'>
            <Image
              className='content-img'
              mode='aspectFill'
              src={fileID}
              onClick={() => this.onPreview(fileID)}
            />
            { isShowSelect ? (
              <View className='select-wrapper'>
                <View className='select-title'>
                  <Text>{titleMap[selectNum]}</Text>
                  { isShowNext ? (
                    <View className='next-btn' onClick={this.onSelectNext}>
                      <Text>NEXT</Text>
                      <Image src={nextIcon} className='icon' />
                    </View>
                  ) : null }
                </View>
                {selectNum === EnumSelectNum.First ? (
                  <View className='select-body'>
                    <View className='select-body-birds'>
                      <Image src={bird1} className='bird-1' mode='aspectFit' />
                      <Image src={bird2} className='bird-2' mode='aspectFit' />
                      <Image src={bird3} className='bird-3' mode='aspectFit' />
                      <Image src={bird4} className='bird-4' mode='aspectFit' />
                    </View>
                    <View className='select-body-birds-size'>
                      <View className='size1'>
                        <View>麻雀</View>
                        <View>(14cm)</View>
                      </View>
                      <View className='size2'>
                        <View>八哥</View>
                        <View>(24cm)</View>
                      </View>
                      <View className='size3'>
                        <View>乌鸦</View>
                        <View>(50cm)</View>
                      </View>
                      <View className='size4'>
                        <View>天鹅</View>
                        <View>(140cm)</View>
                      </View>
                    </View>
                    <View className='selects'>
                      { BirdSizeList ? BirdSizeList.map(item => (
                        <View className={`select-circle ${selectBirdSize === item ? 'active' : ''}`} key={item} onClick={() => this.onSelectSize(item)}></View>
                      )) : null }
                    </View>
                  </View>
                ) : null}
                {selectNum === EnumSelectNum.Second ? (
                  <View className='select-body'>
                    <View className='select-colors'>
                      <View className='select-colors-item' onClick={() => this.onSelectBirdColor(EnumBirdColor.black)}>
                        <View style={`background:${EnumBirdColor.black}`} className='select-color-circle'>
                          { selectBirdColors.includes(EnumBirdColor.black) ? (
                            <Image src={gouWhite} className='gou-icon' />
                          ) : '' }
                        </View>
                        <Text>{BirdColorMap[EnumBirdColor.black]}色</Text>
                      </View>
                      <View className='select-colors-item' onClick={() => this.onSelectBirdColor(EnumBirdColor.grey)}>
                        <View style={`background:${EnumBirdColor.grey}`} className='select-color-circle'>
                          { selectBirdColors.includes(EnumBirdColor.grey) ? (
                            <Image src={gouWhite} className='gou-icon' />
                          ) : '' }
                        </View>
                        <Text>{BirdColorMap[EnumBirdColor.grey]}色</Text>
                      </View>
                      <View className='select-colors-item' onClick={() => this.onSelectBirdColor(EnumBirdColor.white)}>
                        <View style={`background:${EnumBirdColor.white}`} className='select-color-circle'>
                          { selectBirdColors.includes(EnumBirdColor.white) ? (
                            <Image src={gouBlack} className='gou-icon' />
                          ) : '' }
                        </View>
                        <Text>{BirdColorMap[EnumBirdColor.white]}色</Text>
                      </View>
                    </View>
                    <View className='select-colors'>
                      <View className='select-colors-item' onClick={() => this.onSelectBirdColor(EnumBirdColor.red)}>
                        <View style={`background:${EnumBirdColor.red}`} className='select-color-circle'>
                          { selectBirdColors.includes(EnumBirdColor.red) ? (
                            <Image src={gouWhite} className='gou-icon' />
                          ) : '' }
                        </View>
                        <Text>{BirdColorMap[EnumBirdColor.red]}色</Text>
                      </View>
                      <View className='select-colors-item' onClick={() => this.onSelectBirdColor(EnumBirdColor.brown)}>
                        <View style={`background:${EnumBirdColor.brown}`} className='select-color-circle'>
                          { selectBirdColors.includes(EnumBirdColor.brown) ? (
                            <Image src={gouWhite} className='gou-icon' />
                          ) : '' }
                        </View>
                        <Text>{BirdColorMap[EnumBirdColor.brown]}色</Text>
                      </View>
                      <View className='select-colors-item' onClick={() => this.onSelectBirdColor(EnumBirdColor.yellow)}>
                        <View style={`background:${EnumBirdColor.yellow}`} className='select-color-circle'>
                          { selectBirdColors.includes(EnumBirdColor.yellow) ? (
                            <Image src={gouBlack} className='gou-icon' />
                          ) : '' }
                        </View>
                        <Text>{BirdColorMap[EnumBirdColor.yellow]}色</Text>
                      </View>
                    </View>
                    <View className='select-colors'>
                      <View className='select-colors-item' onClick={() => this.onSelectBirdColor(EnumBirdColor.green)}>
                        <View style={`background:${EnumBirdColor.green}`} className='select-color-circle'>
                          { selectBirdColors.includes(EnumBirdColor.green) ? (
                            <Image src={gouWhite} className='gou-icon' />
                          ) : '' }
                        </View>
                        <Text>{BirdColorMap[EnumBirdColor.green]}色</Text>
                      </View>
                      <View className='select-colors-item' onClick={() => this.onSelectBirdColor(EnumBirdColor.blue)}>
                        <View style={`background:${EnumBirdColor.blue}`} className='select-color-circle'>
                          { selectBirdColors.includes(EnumBirdColor.blue) ? (
                            <Image src={gouWhite} className='gou-icon' />
                          ) : '' }
                        </View>
                        <Text>{BirdColorMap[EnumBirdColor.blue]}色</Text>
                      </View>
                      <View className='select-colors-item' onClick={() => this.onSelectBirdColor(EnumBirdColor.orange)}>
                        <View style={`background:${EnumBirdColor.orange}`} className='select-color-circle'>
                          { selectBirdColors.includes(EnumBirdColor.orange) ? (
                            <Image src={gouWhite} className='gou-icon' />
                          ) : '' }
                        </View>
                        <Text>{BirdColorMap[EnumBirdColor.orange]}色</Text>
                      </View>
                    </View>
                  </View>
                ): null}
                {selectNum === EnumSelectNum.Third ? (
                  <View className='select-body'>
                    { BirdBehaviourList.length && BirdBehaviourList.map(item => (
                      <View className='select-body-eat' key={item.value}>
                        <View className={`select-eai-circle ${item.value === selectBirdBehaviour ? 'active' : ''}`} onClick={() => this.onSelectBirdBehaviour(item.value)}></View>
                        <Text>{item.label}</Text>
                      </View>
                    )) }
                  </View>
                ) : null}
              </View>
            ) : (
              <View className='res-info'>
                <View className='info-title'>AI识别结果</View>
                { error == UploadError.exifError ? (
                  <View>
                    <View className='info-error'>{ UploadErrorMsg[error] }</View>
                    <View className='info-reset' onClick={this.reset}>重新上传</View>
                  </View>
                ) : (
                  <View className='info-text-wrapper'>
                    <View className='info-text bold'>种类：{ error === UploadError.aiError ? UploadErrorMsg[error] : `${imgInfo.name} ${imgInfo.enName}` }</View>
                    <View className='info-text'>拍摄时间：{ imgInfo.createTime }</View>
                    <View className='info-text'>拍摄地点：<Text className={imgInfo.address ? '' : 'active'} onClick={this.onChooseLocation}>{ !imgInfo.address && imgInfo.createTime ? '点击选择拍摄地址' : imgInfo.address }</Text></View>
                    { error === UploadError.aiError && imgInfo.address ? (
                      <View className='info-btns-error' onClick={() => this.onShowSelect(true)}>无法自动识别鸟类，请进一步识别 ></View>
                    ) : imgInfo.address ? (
                      <View className='info-btns'>
                        <View className='info-btn' onClick={refused ? this.onAddImage : () => this.onShowSelect(true)}>不匹配</View>
                        <View className='info-btn active' onClick={this.onAddImage}>发布</View>
                      </View>
                    ) : null }
                    <View className='info-desc'>
                      { imgInfo.habit ? (
                        <View className='info-desc-item'>
                          <View className='title'>习性</View>
                          <View>{ imgInfo.habit }</View>
                        </View>
                      ) : '' }
                      { imgInfo.feature ? (
                        <View className='info-desc-item'>
                          <View className='title'>特征</View>
                          <View>{ imgInfo.feature }</View>
                        </View>
                      ) : '' }
                      { imgInfo.spread ? (
                        <View className='info-desc-item'>
                          <View className='title'>分布</View>
                          <View>{ imgInfo.spread }</View>
                        </View>
                      ) : '' }
                    </View>
                  </View>
                ) }  
              </View>
            ) }
            
          </View>
        ) }
        
      </View>
    )
  }
}

export default Upload