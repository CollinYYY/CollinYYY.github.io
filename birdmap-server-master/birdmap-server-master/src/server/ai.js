const koa2Req = require('koa2-request');
const urlencode = require('urlencode');
const { Op } = require("sequelize");
const { Record } = require('../../db');

const getImageAI = async (ctx) => {
  const { ImageURL } = ctx.request.body

  const options = {
    method: 'post',
    url: 'http://47.100.215.210:1323/classify',
    json: {
      ImageURL
    },
    headers: {
      'Content-Type': 'application/json',
    }
  }

  const res = await koa2Req(options)

  if (res.body && res.body.includes('is most likely')) {
    const resList = res.body.split('\n')
    if (resList.length >= 2) {
      const nameList = resList.slice(1, 6).filter(item => {
        const itemArr = item.split(':')
        if (parseFloat(itemArr[1]) < 30) {
          return false
        }
        return true
      }).map(item => {
        return item.split('.')[1]
      })
      return nameList
    }
    return []
  }

  return []
}

const getBirdInfo = async (ctx) => {
  const { keyword } = ctx.request.body

  const url = `http://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_key=${urlencode(keyword)}&bk_length=600`
  const res = await koa2Req(url)

  const resObj = JSON.parse(res.body)
  
  if (resObj.id) {
    return {
      feature: resObj.abstract
    }
  }

  const record = await Record.findOne({
    where: {
      enName: keyword,
    }
  })

  if (record && record.dataValues) {
    const { spread, feature, habit, name } = record.dataValues;
    return {
      spread,
      feature,
      habit,
      name
    }
  } 

  return null
}

const getRecords = async (ctx) => {
  const records = await Record.findAll()

  if (records.length) {
    return records.map(item => {
      const { name, enName, spread, feature, habit, category, noColors, colors, size } = item.dataValues;
      return {
        name,
        enName,
        spread,
        feature,
        habit,
        category,
        noColors, 
        colors, 
        size
      }
    })
  }

  return []
}

module.exports = {
  getImageAI,
  getBirdInfo,
  getRecords
}