const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = (env) => { // env 是环境变量
  const isDev = env.development;
  const base = {
    entry: path.resolve(__dirname, '../src/index.ts'),
    module: {
      // 解析css的时候 就不能渲染dom
      // css 可以并行和 js 一同加载 mini-css-extract-plugin

      // 转化什么文件 用什么去转，使用哪些loader
      rules: [
        {
          // 解析 vue
          test: /\.vue$/,
          use: 'vue-loader'
        },
        { // 解析 react
          test: /\.tsx$/,
          use: 'babel-loader'
        },
        { // 解析 es6
          test: /\.js$/,
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 如果是开发环境就用 style-loader
            {
              loader: 'css-loader',
              options: { // 给 loader 传递参数
                importLoaders: 2 // 解决 css 文件里面存在引入别的文件 @import （现在已经不需要配置）
              }
            }, 
            'postcss-loader', 
            'sass-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        { // 图标字体的转化
          test: /\.(woff|ttf|eot|svg)$/,
          use: 'file-loader'
        },
        { // 图片的转化
          test: /\.(jpe?g|png|gif)$/,
          use: {
            loader: 'url-loader',
            // 如果大于 100k 的图片 会使用file-loader
            options: {
              name: 'image/[contentHash].[ext]',
              limit: 1024 // 100k 以下的图片转成base64
            }
          } // file-loader 默认的功能是拷贝的作用
          // 我希望比较小的图片可以转化为base64，比以前大，好处就是不用发送http请求
        }
      ]
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, '../dist')
    },
    plugins: [
      !isDev && new MiniCssExtractPlugin({
        filename: 'css/main.css'
      }),
      new CleanWebpackPlugin(), // **/* 意思是所有目录下的所有文件
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'),
        filename: 'index.html',
        minify: !isDev && { // 生产环境压缩
          removeAttributeQuotes: true, // 去除双引号
          collapseWhitespace: true // 将 html 压缩成一行
        }
      })
    ].filter(Boolean)
  }
  // 函数要返回配置文件，没返回会采用默认配置
  if (isDev) {
    return merge(base, dev);
  } else {
    return merge(base, prod);
  }
}
