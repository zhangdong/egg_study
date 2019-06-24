'use strict';

const Service = require('egg').Service;


// 人数过多考虑用redis存储
const sockets = {};

// 使用临时内存缓存 socketid对应的tel
class SocketCacheService extends Service {
  get(tel) {
    if (tel) { return sockets[tel.toString()]; }
    return null;
  }
  set(tel, socketid) {
    if (tel && socketid) { sockets[tel.toString()] = socketid; }
  }
  remove(tel) {
    if (tel) { delete sockets[tel.toString()]; }
  }
  all() {
    console.log(sockets);
    return sockets;
  }
}

module.exports = SocketCacheService;

