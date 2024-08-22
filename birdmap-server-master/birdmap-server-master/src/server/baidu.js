const { API_KEY, SECRET_KEY } = require('../../config/baidu');
const koa2Req = require('koa2-request');

const getAccessToken = async () => {
  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`
  var options = {
    method: 'post',
    url: url,
    json: {
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }

  const res = await koa2Req(options)

  return res.body
}

const imageClassifyAnimal = async (ctx) => {
  const { access_token } = await getAccessToken();
  const { imageUrl, top_num = 6, baike_num = 6 } = ctx.request.body
  
  const url = `https://aip.baidubce.com/rest/2.0/image-classify/v1/animal?access_token=${access_token}`
  var options = {
    method: 'post',
    url: url,
    form: {
      url: imageUrl,
      top_num,
      baike_num
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }

  const res = await koa2Req(options)

  const { result } = res.body ? JSON.parse(res.body) : {};

  return result
}

module.exports = {
  imageClassifyAnimal,
}