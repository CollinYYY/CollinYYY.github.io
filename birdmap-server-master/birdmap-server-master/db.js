const { Sequelize, DataTypes } = require("sequelize");
const { 
  MYSQL_ADDRESS,
  MYSQL_USERNAME,
  MYSQL_PASSWORD
} = require("./config/db");

const [host, port] = MYSQL_ADDRESS.split(":");

const sequelize = new Sequelize("nodejs_demo", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

// 定义数据模型
const Counter = sequelize.define("Counter", {
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

const User = sequelize.define("User", {
  openid: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  nickName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  watermark: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  }
});

const Image = sequelize.define("Image", {
  imageId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  cityName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  districtName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  createTime: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  taxonId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  feature: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  habit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  spread: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  enName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  lat: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  lng: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  openid: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  nickName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  noExif: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
});

const Taxon = sequelize.define("Taxon", {
  taxonId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  enName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  spread: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  feature: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  habit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  }
});

const Record = sequelize.define("Record", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  enName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  noColors: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  colors: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  spread: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  feature: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  habit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  }
})

const Like = sequelize.define("Like", {
  openid: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  imageId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  isLike: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
})

// 数据库初始化方法
async function init() {
  await Counter.sync({ alter: true });
  await User.sync({ alter: true });
  await Image.sync({ alter: true });
  await Taxon.sync({ alter: true });
  await Record.sync({ alter: true });
  await Like.sync({ alter: true });
}

// 导出初始化方法和模型
module.exports = {
  init,
  Counter,
  User,
  Image,
  Taxon,
  Record,
  Like,
  sequelize
};
