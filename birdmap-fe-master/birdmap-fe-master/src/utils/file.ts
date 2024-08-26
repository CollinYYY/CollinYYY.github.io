import Taro from '@tarojs/taro'
import ExifReader from 'exifreader';
import colorThief from "miniapp-color-thief";

import { getLoginInfo } from './login';
import { cloudInit } from './cloud';

export const uploadImage = (folder = 'imgs', isCompressed = true) => {

  return new Promise(async (resolve, reject) => {
    const name = await randomFileName()

    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: isCompressed ? ['compressed'] : ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: async function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths        
        
        const c1 = await cloudInit();
        c1.uploadFile({
          cloudPath: `${folder}/${name}.png`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
          filePath: tempFilePaths?.[0], // 微信本地文件，通过选择图片，聊天文件等接口获取
          config: {
            env: 'prod-4gxykas5f6c2f40a' // 微信云托管环境ID
          },
          success: resolve,
          fail: reject
        })
      }
    })
  })
}

export const uploadFilePromise = (folder, filePath) => {
  return new Promise(async (resolve, reject) => {
    const c1 = await cloudInit();
    const name = await randomFileName()

    c1.uploadFile({
      cloudPath: `${folder}/${name}.jpg`, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
      filePath: filePath, // 微信本地文件，通过选择图片，聊天文件等接口获取
      config: {
        env: 'prod-4gxykas5f6c2f40a' // 微信云托管环境ID
      },
      success: resolve,
      fail: reject
    })
  })
}

export const getExitPromise = (filePath) => {
  return new Promise(async (resolve, reject) => {
    Taro.getFileSystemManager().readFile({
      filePath: filePath,
      success: (res) => {
         const fileBuffer = res.data;
         
         let tags = ExifReader.load(fileBuffer, {
          expanded: true
        })

        resolve(tags)
      },
      fail: e => {
        reject(e.message)
      }
    })
  })
}

export const getImageInfo = () => {
  return new Promise((resolve, reject) => {
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: async function (res) {
        const tempFilePath = res.tempFilePaths[0]
        Taro.getImageInfo({
          src: tempFilePath,
          success: info => {
            const { width, height } = info ?? {}
            resolve({
              width,
              height,
              tempFilePath
            })
          },
          fail: reject
        })
      },
      fail: reject
    })
  })
}

export const getImageMainColor = ({
  width,
  height,
  tempFilePath
}) => {
  return new Promise(async (resolve, reject) => {
    const ctx = Taro.createCanvasContext('canvas')
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(tempFilePath, 0, 0, width, height)
    ctx.draw()
    
    setTimeout(() => {
      Taro.canvasGetImageData({
        canvasId: "canvas",
        x: width - 100,
        y: height - 100,
        width: 100,
        height: 100,
        success: res => {
          const palette = colorThief(res.data)
            .palette()
            .get();
          const [rgb] = palette;
          const bright = Math.round(((rgb[0]*299) + (rgb[1]*587) + (rgb[2]*114)) / 1000)
          if (bright > 125) {
            resolve('#000')
          } else {
            resolve('#fff')
          }
        }
      });
    }, 1000)
  })
}

export const drawWaterMarker = ({
  width,
  height,
  tempFilePath,
  color
}) => {
  return new Promise(async (resolve, reject) => {
    const ctx = Taro.createCanvasContext('canvas')
    const { watermark } = await getLoginInfo()
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(tempFilePath, 0, 0, width, height)
    ctx.setFillStyle(color)
    ctx.font = 'normal bold 16px san-serif'
    ctx.fillText(`『 寻鸟 寻心 』 ${watermark}`, width - (100 + 16 * watermark.length), height - 20)
    ctx.draw()

    setTimeout(() => {
      Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        width,
        height,
        fileType: 'jpg',
        quality: 0.8,
        canvasId: 'canvas',
        success: e => {
          const { tempFilePath } = e ?? {};
          resolve(tempFilePath)
        },
        fail: reject
      })
    }, 1000)
  })
}

export const getImageExif = ({
  width,
  height,
  tempFilePath,
  path
}) => {
  return new Promise(async (resolve, reject) => {

    let uploadInfo
    try {
      Taro.showLoading({
        title: '上传中'
      })
      uploadInfo = await uploadFilePromise('exif', path)
      
      Taro.hideLoading()
    } catch (e) {
      console.log('__________err',e)
    }
    const { fileID } = uploadInfo ?? {}

    let exif
    try {
      exif = await getExitPromise(tempFilePath)
    } catch {}
    
    resolve({
      fileID,
      exif
    })
  })
}

export const randomFileName = async () => {
  const timestamp = Date.now();
  const { openid } = await getLoginInfo();
  return `${timestamp}-${openid}`;
}

export const getUrl = async (url) => {
  const c1 = await cloudInit();
  return new Promise((resolve) => {
    if(/^http/.test(url)) {
      resolve([url])
      return
    }
    c1.getTempFileURL({
      fileList: [url],
      success: res => {
        resolve(res.fileList || [])
      },
      fail: err => {
        resolve([])
      }
    })
  })
}



