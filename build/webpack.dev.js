const path = require('path');
module.exports = {
  mode: 'development',
  devServer: { // 开发服务器的配置
    port: 8081,
    compress: true, // gzip 可以提升返回页面的速度
    contentBase: path.resolve(__dirname, '../dist') // webpack 启动服务会在dist目录下
  }
}