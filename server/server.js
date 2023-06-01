// 导入express模块
const express = require('express')

// 创建express应用对象
const app = express()

// 导入封装数据库函数
const { querySelect, queryInsert, queryUpdate, queryDelete } = require('./db/db')

// 端口号
const port = 8001

// 导入中间件 处理request.body
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

// GET请求表格数据接口
app.get('/table-GET', (request, response) => {
  // 计时器 两秒后回传
  setTimeout(() => {
    // 数据库查询函数
    querySelect('select * from tb', (err, data) => {
      // 判断是否出错
      if (err != null) {
        console.log(err)
        return
      }
      response.setHeader('Access-Control-Allow-Origin', '*')
      response.send(data)
    })
  }, 2000)
})

// POST请求复制表格数据
app.post('/tableCopyPost', (request, response) => {
  // 定义变量存储请求数据
  let data = request.body

  // 定义数据库操作语句
  let sql = `insert into tb(id,title,status,username,date) values(null,"${data.title}",${data.status},"${data.username}","${data.date.split('T')[0]}")`
  // 多条复制
  // insert into tb(id,title,status,username,date) values(...arr),(...arr),(...arr)
  console.log(sql)

  // 插入数据
  queryInsert(sql, (err, data) => {
    if (err) console.log(err)
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.send(data)
  })
})

// POST请求删除表格数据
app.post('/tableDeletePost', (request, response) => {
  // 定义变量存储请求数据
  let data = request.body

  // 定义数据库操作语句
  let sql = `delete from tb where id=${data.id}`
  // 多条删除
  // delete from tb where id in (...arr)
  console.log(sql)

  // 删除数据
  queryDelete(sql, (err, data) => {
    if (err) console.log(err)
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.send(data)
  })
})

// POST请求插入表格数据
app.post('/tableInsertPost', (request, response) => {
  // 定义变量存储请求数据
  let data = request.body

  // 定义数据库操作语句
  let sql = `insert into tb(id,title,status,username,date) values(null,"${data.title}",${data.status},"${data.username}","${data.date.split('T')[0]}")`

  // 插入数据
  queryInsert(sql, (err, data) => {
    if (err) console.log(err)
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.send(data)
  })
})

// POST请求更改表格数据
app.post('/tableUpdatePost', (request, response) => {
  // 定义变量存储请求数据
  let data = request.body

  // 定义数据库操作语句
  let sql = `update tb set title='${data.title}',status=${data.status} where id=${data.id}`

  // 插入数据
  queryUpdate(sql, (err, data) => {
    if (err) console.log(err)
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.send(data)
  })
})

// 监听端口启动服务
app.listen(port, () => {
  console.log(port + '端口已启动')
})
