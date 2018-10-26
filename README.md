# Hashwatcher-webpack-plugin
用于webpack打包到生产环境后，客户端无刷新的情况下通知用户版本变更信息。

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
module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
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
