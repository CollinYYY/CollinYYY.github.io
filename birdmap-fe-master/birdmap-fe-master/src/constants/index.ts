export enum EnumReqCode {
  Fail = -1,
  Success = 0
}

export enum EnumSelectNum {
  First = 1,
  Second = 2,
  Third = 3
}

export enum EnumBirdSize {
  Size1 = 1,
  Size2 = 2,
  Size3 = 3,
  Size4 = 4,
  Size5 = 5,
  Size6 = 6,
  Size7 = 7,
  Size8 = 8,
}

export const BirdSizeList = [
  EnumBirdSize.Size1,
  EnumBirdSize.Size2,
  EnumBirdSize.Size3,
  EnumBirdSize.Size4,
  EnumBirdSize.Size5,
  EnumBirdSize.Size6,
  EnumBirdSize.Size7,
  EnumBirdSize.Size8,
]

export const BirdSizeMap = {
  [EnumBirdSize.Size1]: {
    low: 5,
    high: 15
  },
  [EnumBirdSize.Size2]: {
    low: 10,
    high: 25
  },
  [EnumBirdSize.Size3]: {
    low: 20,
    high: 35
  },
  [EnumBirdSize.Size4]: {
    low: 25,
    high: 50
  },
  [EnumBirdSize.Size5]: {
    low: 40,
    high: 65
  },
  [EnumBirdSize.Size6]: {
    low: 50,
    high: 100
  },
  [EnumBirdSize.Size7]: {
    low: 80,
    high: 140
  },
  [EnumBirdSize.Size8]: {
    low: 120,
    high: Infinity
  },
}

export enum EnumBirdColor {
  black = 'rgb(33,33,33)',
  grey = 'rgb(120,120,120)',
  white = 'rgb(255,255,255)',
  red = 'rgb(180,0,22)',
  brown = 'rgb(133,91,8)',
  yellow = 'rgb(247,230,0)',
  green = 'rgb(55,119,218)',
  blue = 'rgb(23,152,0)',
  orange = 'rgb(246,136,41)',
}

export const BirdColorMap = {
  [EnumBirdColor.black]: '黑',
  [EnumBirdColor.grey]: '灰',
  [EnumBirdColor.white]: '白',
  [EnumBirdColor.red]: '红',
  [EnumBirdColor.brown]: '棕',
  [EnumBirdColor.yellow]: '黄',
  [EnumBirdColor.green]: '蓝',
  [EnumBirdColor.blue]: '绿',
  [EnumBirdColor.orange]: '橙',
}

export enum EnumBirdBehaviour {
  eat = 'eat',
  find = 'find',
  wash = 'wash',
  courtship = 'courtship',
  fly = 'fly'
}

export const BirdBehaviourMap = {
  [EnumBirdBehaviour.eat] : '陆禽',
  [EnumBirdBehaviour.find] : '攀禽',
  [EnumBirdBehaviour.wash] : '游禽',
  [EnumBirdBehaviour.courtship] : '涉禽',
  [EnumBirdBehaviour.fly] : '猛禽',
}

export const BirdBehaviourList = [
  {
    label: '进食或饮水',
    value: EnumBirdBehaviour.eat
  },
  {
    label: '觅食',
    value: EnumBirdBehaviour.find
  },
  {
    label: '洗澡',
    value: EnumBirdBehaviour.wash
  },
  {
    label: '求偶',
    value: EnumBirdBehaviour.courtship
  },
  {
    label: '飞行',
    value: EnumBirdBehaviour.fly
  },
]

// export const host = 'http://localhost:80/'
export const host = 'https://api.yqbirdmp.com/'
//bird.march1993.com
export const LAYER_ID = '44805de1bcd9';
//245f1e1ebe31
export const MAP_KEY = 'I22BZ-D7ZKL-DL7P4-EHW6M-YMZYF-OZFKZ';
//EXIBZ-INWWW-BCZRS-ONVZC-KRZA6-BYFLH

export const titleMap = {
  [EnumSelectNum.First]: '这只鸟的尺寸大概多大？',
  [EnumSelectNum.Second]: '请选择这只鸟的主要颜色（1-3种）',
  [EnumSelectNum.Third]: '请选择这只鸟正在做什么',
}

export enum UploadError {
  exifError = 'exifError',
  aiError = 'aiError'
}

export const UploadErrorMsg = {
  [UploadError.exifError] : '图片exif信息获取失败，请检查图片是否为原图（友情提示：图片经过微信传输之后会丢失gps信息导致识别失败）',
  [UploadError.aiError] : '无法识别'
}

export const CertificateList = [
  {
    label: '没有调整巢穴的位置'
  },
  {
    label: '没有在近距离拍摄时使用闪光灯'
  },
  {
    label: '没有播放鸟鸣声吸引鸟类'
  },
  {
    label: '没有转移幼鸟以便于拍摄'
  },
  {
    label: '没有制造动静拍摄飞鸟'
  },
  {
    label: '没有拍摄被饲养的鸟（动物园除外）'
  },
  {
    label: '没有奖诱拍的痕迹ps掉'
  },
]
