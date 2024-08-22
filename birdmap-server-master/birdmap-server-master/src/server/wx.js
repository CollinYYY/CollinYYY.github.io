const { 
  APP_ID,
  APP_SECRET,
} = require("../../config/wx");
const koa2Req = require('koa2-request');
const { User } = require('../../db');

const wxLogin = async (ctx) => {
  const { code } = ctx.request.body
  let url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+APP_ID+'&secret='+APP_SECRET+'&js_code='+code+'&grant_type=authorization_code'
  let res = await koa2Req(url);
  const {session_key,openid} = JSON.parse(res.body);

  const user = await User.findOne({
    where: {
      openid
    }
  })

  if (!user) {
    await User.create({ openid: openid });
  }

  return {
    session_key,
    openid,
    avatar: user.dataValues.avatar,
    nickName: user.dataValues.nickName,
    watermark: user.dataValues.watermark
  }
}

const updateUserInfo = async (ctx) => {
  const { openid } = ctx.request.headers
  const { avatar, nickName, watermark } = ctx.request.body

  await User.update({ avatar, nickName, watermark }, {
    where: {
      openid
    }
  });
}

module.exports = {
  wxLogin,
  updateUserInfo
}
