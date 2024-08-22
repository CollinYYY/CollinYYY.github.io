const { Like, sequelize } = require('../../db');
// const { Sequelize, DataTypes } = require("sequelize");

const updateLike = async (ctx) => {
  const { openid } = ctx.request.headers
  const { imageId, isLike } = ctx.request.body

  const like = await Like.findOne({
    where: {
      openid,
      imageId
    }
  })

  if (!like) {
    await Like.create({ openid: openid, imageId: imageId, isLike: true });
  } else {
    await Like.update({ isLike: isLike }, {
      where: {
        openid,
        imageId
      }
    });
  }
}

const getLike = async (ctx) => {
  const likes = await Like.findAll() || []
  const likeList = likes.map(item => item.dataValues)

  return likeList
}

const getLikeImages = async (ctx) => {
  const { limit } = ctx.request.body
  
  const images = await Like.findAll({
    attributes: [
      'imageId',
      [sequelize.fn('COUNT', sequelize.col('Like.imageId')), 'n_image_id'],
    ],
    group: ['Like.imageId'],
    where: {
      isLike: true
    },
  })

  return images.map(item => item.dataValues)
}

module.exports = {
  updateLike,
  getLike,
  getLikeImages
}