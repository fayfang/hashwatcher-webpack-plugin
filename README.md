# Hashwatcher-webpack-plugin
用于webpack打包到生产环境后，客户端无刷新的情况下通知用户版本变更信息。依赖createEvent，用addEventListener接受事件。

## install
``` node
  npm install hashwatcher-webpack-plugin --save-dev
```

## options
| key | type | default | description |
|-----|------|---------| ----------- |
| duration | Number | 60000 | interval duration for getting jsonRender.js |
| path | String | '' | 'webpackHashWatcher.js' output path |
| hashPath | hashPath | '' | 'jsonRender.js' output path |

## example
webpack.config.js
``` javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HashwatcherWebpackPlugin = require('hashwatcher-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new HashwatcherWebpackPlugin({
      duration: 10000
    })
  ]
}
```
index.js
``` javascript
// wehn then hash change, it will receive a 'webpackHashChange' event
document.addEventListener('webpackHashChange', (e) => {
  console.log(e.diffArr)
})
```
