const path = require('path');
module.exports = {
  lintOnSave: false,
  // 输出目录
  outputDir: 'dist',
  // 静态资源存放目录
  assetsDir: 'static',
  productionSourceMap: false,
  configureWebpack: {
    performance: {
      hints: false
    }
  },
  // 多页配置
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
    }
  },
  // 插件选项
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './styles/variable.scss'),
      ]
    }
  },
  // webpack配置项
  chainWebpack: config => {
    config.output
      .set('libraryExport', 'default')
      .set('library', 'VXETable')
    if (process.env.npm_lifecycle_event.indexOf('lib') === 0) {
      const XEUtils = {
        root: 'XEUtils',
        commonjs: 'xe-utils/methods/xe-utils',
        commonjs2: 'xe-utils/methods/xe-utils',
        amd: 'xe-utils'
      }
      if (config.has('externals')) {
        config.externals
          // .set('xe-utils', XEUtils)
          .set('xe-utils/methods/xe-utils', XEUtils)
      } else {
        config
          .set('externals', {
            // 'xe-utils': XEUtils,
            'xe-utils/methods/xe-utils': XEUtils
          })
      }
    }
  }
}