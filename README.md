# Hashwatcher-webpack-plugin
It will create two js-files after webpack build, 'jsonRender.js' records the webpack chunk-hash map, 'webpackHashWatcher.js' used in browser.

## install
``` node
  npm install hashwatcher-webpack-plugin --save-dev
```

## options
| key | type | default | description |
|-----|------|---------| ----------- |
| duration | Number | 60000 | interval duration for getting jsonRender.js |
| path | String| | '' | 'webpackHashWatcher.js' output path |
| hashPath | hashPath | '' | 'jsonRender.js' output path |