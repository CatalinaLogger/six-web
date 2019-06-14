'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://oa.bdsmc.net:16488"',
  WEB_SOCKET: '"ws://oa.bdsmc.net:16488/web/socket"'
})
