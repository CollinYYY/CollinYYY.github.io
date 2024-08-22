const { MAP_KEY, , LAYER_ID } = require('../../config/map');
const koa2Req = require('koa2-request');
const urlencode = require('urlencode');
const coordtransform = require('coordtransform');
const { Image, Taxon, User } = require('../../db');
const { getLike } = require('./like');

const getAddress = async (ctx) => {
  const { latitude, longitude } = ctx.request.body
  const trans = coordtransform.wgs84togcj02(longitude, latitude);
  const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${trans.reverse().join(',')}&key=${MAP_KEY}&get_poi=1`;
  let res = await koa2Req(url);
  const {result, status} = JSON.parse(res.body);
  if (status === 0) {
    return result;
  }
  return null;
}

const getPoint = async (ctx) => {
  const { address } = ctx.request.body
  
  const url = `https://apis.map.qq.com/ws/geocoder/v1/?address=${urlencode(address)}&key=${MAP_KEY}`;
  let res = await koa2Req(url);
  const {result, status} = JSON.parse(res.body);
  if (status === 0) {
    return result;
  }
  return null;
}

const getImageList = async (ctx) => {
  const { address } = ctx.request.body
  const { openid } = ctx.request.headers
  const taxons = await Taxon.findAll()
  const taxonList = taxons.map(item => item.dataValues)

  const images = address ? await Image.findAll({
    where: {
      address
    }
  }): await Image.findAll()

  const users = await User.findAll()
  const userList = users.map(item => item.dataValues)

  const likeList = await getLike() || []

  const imageList = images.map(item => {
    const { dataValues } = item || {};
    const { taxonId, imageId } = dataValues || {};

    if (taxonId) {
      const taxon = taxonList.find(taxon => {
        return taxon.taxonId.replace(/\r/, '').replace('\r', '').toString() === taxonId.replace(/\r/, '').replace('\r', '').toString()
      }) || {};
      return {
        ...dataValues,
        taxonId: taxonId.replace(/\r/, '').replace('\r', ''),
        name: taxon.name ? taxon.name: '',
        feature: taxon.feature ? taxon.feature: '',
        habit: taxon.habit ? taxon.habit : '',
        enName: taxon.enName ? taxon.enName : '',
        isLike: likeList.find(like => like.imageId === imageId && like.openid === openid) ? likeList.find(like => like.imageId === imageId && like.openid === openid).isLike : false,
        likeNum: likeList.filter(like => like.imageId === imageId && like.isLike).length,
      }
    } else {
      return {
        ...dataValues,
        taxonId: null,
        isLike: likeList.find(like => like.imageId === imageId && like.openid === openid) ? likeList.find(like => like.imageId === imageId && like.openid === openid).isLike : false,
        likeNum: likeList.filter(like => like.imageId === imageId && like.isLike).length,
        nickName: !dataValues.noExif ? userList.find(user => user.openid === item.openid).nickName : '',
        avatar: !dataValues.noExif ? userList.find(user => user.openid === item.openid).avatar : '',
      }
    }
  })

  if (imageList && imageList.length) {
    return imageList
  }
  return null
}

const addImage = async (ctx) => {
  const { address, imageId, name, feature, habit, enName, spread, lat, lng, createTime, noExif } = ctx.request.body
  const { openid } = ctx.request.headers
  const trans = coordtransform.wgs84togcj02(lng, lat);

  Image.create({
    address,
    imageId,
    name,
    feature,
    habit,
    enName,
    lat: trans[1],
    lng: trans[0],
    openid,
    createTime,
    spread,
    noExif
  })
}

const updateData = async (ctx) => {
  const { data } = ctx.request.body
  const url = `https://apis.map.qq.com/mydata/data/create`
  const options = {
    method: 'post',
    url: url,
    json: {
      key: MAP_KEY,
      table_id: TABLE_ID,
      action_type: 2,
      data
    },
    headers: {
      'Content-Type': 'application/json',
    }
  }

  const res = await koa2Req(options)
  const { status } = res.body ? res.body : {};
  return status
}

const publishLayer = async () => {
  const url = `https://apis.map.qq.com/data_layer/v1/publish?layerId=${LAYER_ID}&key=${MAP_KEY}`
  const res = await koa2Req(url)

  console.log('__________________图层发布结果：', res.body)
}

module.exports = {
  getAddress,
  getPoint,
  getImageList,
  updateData,
  publishLayer,
  addImage
}