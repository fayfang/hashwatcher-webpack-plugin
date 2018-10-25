const JsonRender = require('./utils/jsonRender');
const path = require('path');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const fs = require('fs');
const version = '0.1.4.'

const defaultConfig = {
  path: '',
  hashPath: '',
  duration: 60000
}

class HashwatcherWebpackPlugin {
  constructor (config = {}) {
    this.config = Object.assign({}, defaultConfig, config);
    if (!/^\d+$/.test(this.config.duration + '')) {
      console.error('duration must be number or numberString');
    }
  }
  apply (compiler) {
    let childCompiler;
    let chunk = {};
    const filename = this.config.path + version + 'webpackHashWatcher.js';
    const publicPath = compiler.options.output.publicPath || '';
    const outputName = publicPath + filename;
    const template = path.join(__dirname, './utils/webpackHashWatcher.js');

    // create the watcher.js for browser
    (compiler.hooks ?
      compiler.hooks.make.tapAsync.bind(compiler.hooks.make, 'HashwatcherWebpackPlugin') :
      compiler.plugin.bind(compiler, 'make'))((compilation, callback) => {
      const outputOptions = {
        filename: filename,
        publicPath: compilation.outputOptions.publicPath
      }
      childCompiler = compilation.createChildCompiler(outputOptions.filename, outputOptions);
      childCompiler.context = compiler.context;
      // change the duration
      var fsContent = fs.readFileSync(template).toString();
      fs.writeFileSync(template, fsContent.replace(/timer\s=\s(.*?);/, 'timer = ' + this.config.duration + ';'));
      
      new SingleEntryPlugin(undefined, template, undefined).apply(childCompiler);

      childCompiler.runAsChild((err, entries, childCompilation) => {
        chunk = {
          size: 0,
          hash: childCompilation.chunks[0].hash,
          entry: outputName,
          css: []
        }
        callback();
      });

      // when html-webpack-plugin is used, inject the asset
      (compilation.hooks ?
        compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync.bind(compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration, 'HashwatcherWebpackPlugin'):
        compilation.plugin.bind(compilation, 'html-webpack-plugin-before-html-generation'))((result, callback) => {
        result.assets.chunks['webpackHashManager'] = chunk;
        result.assets.js.push(outputName);
        callback(null, result);
      })
    });

    // create the hash.js when chunk hash been calculated
    (compiler.hooks ?
      compiler.hooks.emit.tapAsync.bind(compiler.hooks.emit, 'HashwatcherWebpackPlugin') :
      compiler.plugin.bind(compiler, 'emit'))((compilation, callback) => {
      let json = JsonRender(compilation);
      let hashPath = this.config.hashPath + 'webpackHash.js'
  
      compilation.assets[hashPath] = {
        source: function() {
          return json;
        },
        size: function() {
          return json.length;
        }
      }

      callback();
    });
  }
}

module.exports = HashwatcherWebpackPlugin