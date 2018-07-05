const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const resolve = file => path.resolve(__dirname, file)

const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
const branchName = require('child_process')
  .execSync(
    'git rev-parse --abbrev-ref HEAD | grep -v ^HEAD$ || git rev-parse HEAD'
  )
  .toString()

module.exports = {
  devtool: isProd ? false : '#cheap-module-source-map',
  output: {
    path: resolve('../public/assets'),
    publicPath: '/assets/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['*', '.js', '.json', '.vue'],
    alias: {
      api: resolve('../api'),
      assets: resolve('../assets'),
      components: resolve('../components'),
      service: resolve('../service'),
      filters: resolve('../filters'),
      examples: resolve('../pages/examples'),
      layouts: resolve('../layouts'),
      mixins: resolve('../mixins'),
      views: resolve('../views'),
      public: resolve('../public'),
      router: resolve('../router'),
      store: resolve('../store'),
      vue$: 'vue/dist/vue.common.js'
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: isProd
    ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      }),
      new ExtractTextPlugin({
        filename: 'common.[chunkhash].css'
      }),
      new webpack.DefinePlugin({
        __COMMIT_HASH__: JSON.stringify(commitHash),
        __BRANCH_NAME__: JSON.stringify(branchName),
        __BUILD_DATE__: JSON.stringify(new Date())
      })
    ]
    : [
      new FriendlyErrorsPlugin(),
      new webpack.DefinePlugin({
        __COMMIT_HASH__: JSON.stringify(commitHash),
        __BRANCH_NAME__: JSON.stringify(branchName),
        __BUILD_DATE__: JSON.stringify(new Date())
      })
    ]
}
