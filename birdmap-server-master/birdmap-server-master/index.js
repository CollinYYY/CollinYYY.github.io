const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const path = require('path')
const content = require('./util/content')
const mimes = require('./util/mimes')
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const { init: initDB } = require("./db");
const { wxLogin, updateUserInfo } = require('./src/server/wx');
const { getAddress, getPoint, getImageList, updateData, publishLayer, addImage } = require('./src/server/location');
const { imageClassifyAnimal } = require('./src/server/baidu');
const { updateLike, getLike, getLikeImages } = require('./src/server/like');
const { getImageAI, getBirdInfo, getRecords } = require('./src/server/ai');
const { CODE_SUCCESS, CODE_FAIL } = require("./constant/index");
const schedule = require('node-schedule');

const router = new Router();

const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

const staticPath = './static'

// 解析资源类型
function parseMime( url ) {
  let extName = path.extname( url )
  extName = extName ?  extName.slice(1) : 'unknown'
  return  mimes[ extName ]
}

// 首页
router.get("/", async (ctx) => {
  ctx.body = homePage;
});

// 微信登录
router.post('/api/wxlogin',async (ctx, next) => {
  const { session_key, openid, avatar, nickName, watermark } = await wxLogin(ctx);

  if(session_key && openid) {
    ctx.body = {
      code: CODE_SUCCESS,
      data: {
        session_key,
        openid,
        avatar,
        nickName,
        watermark
      }
    };
    return;
  }
  ctx.body = {
    code: CODE_FAIL,
    msg: '登录校验失败'
  }
})

// 更新用户信息
router.post('/api/user/update',async (ctx, next) => {
  await updateUserInfo(ctx);

  ctx.body = {
    code: CODE_SUCCESS,
  }
})

// 获取地址信息
router.post('/api/address/info',async (ctx, next) => {
  const res = await getAddress(ctx);

  if (res) {
    ctx.body = {
      code: CODE_SUCCESS,
      data: res
    }
    return;
  }
  ctx.body = {
    code: CODE_FAIL,
    msg: '地址获取失败'
  }
})

// 获取经纬度
router.post('/api/address/points',async (ctx, next) => {
  const res = await getPoint(ctx);

  if (res) {
    ctx.body = {
      code: CODE_SUCCESS,
      data: res
    }
    return;
  }
  ctx.body = {
    code: CODE_FAIL,
    msg: '经纬度获取失败'
  }
})

// 更新热力图数据表
router.post('/api/address/data_update',async (ctx, next) => {
  const res = await updateData(ctx);

  if (res === CODE_SUCCESS) {
    ctx.body = {
      code: CODE_SUCCESS,
    }
    return;
  }
  ctx.body = {
    code: CODE_FAIL,
    msg: '热力图数据更新失败'
  }
})

// 获取图片列表
router.post('/api/image/list',async (ctx, next) => {
  const res = await getImageList(ctx);

  if (res) {
    ctx.body = {
      code: CODE_SUCCESS,
      data: res
    }
    return;
  }
  ctx.body = {
    code: CODE_FAIL,
    msg: '图片列表获取失败'
  }
})

// 图像识别
router.post('/api/image/animal',async (ctx, next) => {
  const res = await imageClassifyAnimal(ctx);

  if (res) {
    ctx.body = {
      code: CODE_SUCCESS,
      data: res
    }
    return;
  }
  ctx.body = {
    code: CODE_FAIL,
    msg: '图像识别失败'
  }
})

// 图片添加
router.post('/api/image/add',async (ctx, next) => {
  await addImage(ctx)

  ctx.body = {
    code: CODE_SUCCESS,
  }
})

// 更新点赞
router.post('/api/like/update',async (ctx, next) => {
  await updateLike(ctx);

  ctx.body = {
    code: CODE_SUCCESS,
  }
})

// 图片信息获取
router.post('/api/ai/classify',async (ctx, next) => {
  const list = await getImageAI(ctx);

  ctx.body = {
    code: CODE_SUCCESS,
    data: list
  }
})

// 鸟类信息获取
router.post('/api/ai/info',async (ctx, next) => {
  const data = await getBirdInfo(ctx);

  ctx.body = {
    code: CODE_SUCCESS,
    data
  }
})

// record信息
router.post('/api/ai/records',async (ctx, next) => {
  const data = await getRecords(ctx);

  ctx.body = {
    code: CODE_SUCCESS,
    data
  }
})

// 点赞最多的图片
router.post('/api/like/images',async (ctx, next) => {
  const data = await getLikeImages(ctx);

  ctx.body = {
    code: CODE_SUCCESS,
    data
  }
})

let rule = new schedule.RecurrenceRule();
rule.second = [0, 30]; // 每隔 30 秒执行一次

// 启动任务
let job = schedule.scheduleJob(rule, () => {
  publishLayer()
  console.log('定时任务执行完毕');
});

const app = new Koa();
app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use( async (ctx) => {
    // 静态资源目录在本地的绝对路径
    let fullStaticPath = path.join(__dirname, staticPath)

    // 获取静态资源内容，有可能是文件内容，目录，或404
    let _content = await content( ctx, fullStaticPath )

      // 解析请求内容的类型
    let _mime = parseMime( ctx.url )

    // 如果有对应的文件类型，就配置上下文的类型
    if ( _mime ) {
      ctx.type = _mime
    }


    // 输出静态资源内容
    if ( _mime && _mime.indexOf('image/') >= 0 ) {
      // 如果是图片，则用node原生res，输出二进制数据
      ctx.res.writeHead(200)
      ctx.res.write(_content, 'binary')
      ctx.res.end()
    } else {
      // 其他则输出文本
      ctx.body = _content
    }
  });

const port = process.env.PORT || 80;
async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();
