export default {
  pages: [
    'pages/index/index',
    'pages/user/index',
    'pages/upload/index',
    'pages/map/index',
    'pages/map/list/index'
  ],
  permission: {
    "scope.userLocation": {
      "desc": "你的位置信息将用于寻鸟照片位置确认" // 高速公路行驶持续后台定位
    }
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#bfbfbf',
    backgroundColor: '#ffffff',
    selectedColor: '#515151',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/home.png',
        selectedIconPath: './assets/home-active.png'
      },
      {
        pagePath: 'pages/map/index',
        text: '寻鸟地图',
        iconPath: './assets/map.png',
        selectedIconPath: './assets/map-active.png'
      },
      {
        pagePath: 'pages/upload/index',
        text: '上传照片',
        iconPath: './assets/upload.png',
        selectedIconPath: './assets/upload-active.png'
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: './assets/user.png',
        selectedIconPath: './assets/user-active.png'
      },
    ]
  }
}
