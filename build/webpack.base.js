const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const AddAssetHtmlCdnPlugin = require('add-asset-html-cdn-webpack-plugin');
const DllReferencePlugin = require('webpack').DllReferencePlugin;
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

module.exports = (env) => { // env 是环境变量
  const isDev = env.development;
  const base = {
    // entry 有三种写法 字符串 数组 对象
    entry: {
      "a": "./src/a.js",
      "b": "./src/b.js"
    },
    // entry: path.resolve(__dirname, '../src/index.js'),
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
    externals: {
      'jquery': '$' // 不去打包代码中的jquery
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist')
    },
    optimization: {
      usedExports: true // 告诉我们使用了哪个模块
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'),
        filename: 'index.html',
        minify: !isDev && { // 生产环境压缩
          removeAttributeQuotes: true, // 去除双引号
          collapseWhitespace: true // 将 html 压缩成一行
        },
        chunks: ['a']
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'),
        filename: 'login.html',
        minify: !isDev && { // 生产环境压缩
          removeAttributeQuotes: true, // 去除双引号
          collapseWhitespace: true // 将 html 压缩成一行
        },
        chunksSortMode: 'manual', // 手动按照我的顺序来执行
        chunks: ['b', 'a'] // 打包的顺序 按照我自己排列的
      }),
      !isDev && new MiniCssExtractPlugin({
        filename: 'css/main.css'
      }),
      new CleanWebpackPlugin(), // **/* 意思是所有目录下的所有文件
      new VueLoaderPlugin(),
      // new AddAssetHtmlCdnPlugin(true, {
      //   jquery: '//cdn.bootcss.com/jquery/3.4.1/jquery.min.js'
      // }) // 有问题
      // 打包的时候会配置 clean-webpack-plugin 会清空dist 所以不放在dist下面， 而是放在dll下面
      new DllReferencePlugin({
        manifest: path.resolve(__dirname, '../dll/manifest.json')
      }),
      new AddAssetHtmlWebpackPlugin({
        filepath: path.resolve(__dirname, '../dll/react.dll.js')
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
