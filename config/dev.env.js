'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://10.10.10.165:8888"',
  WEB_SOCKET: '"ws://10.10.10.165:8888/web/socket"'
})
