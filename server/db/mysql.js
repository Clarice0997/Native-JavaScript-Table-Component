// 定义数据库连接对象
var dbConfig = {};

// 为数据库连接对象赋值
dbConfig = {
  host: "localhost",
  port: "3306",
  user: "root",
  password: "123456",
  database: "tb",
};

// 导出模块
module.exports = { dbConfig };
