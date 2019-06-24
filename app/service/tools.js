'use strict';
const md5 = require('md5');

const Service = require('egg').Service;
const nanoid = require('nanoid');

class ToolsService extends Service {
  md5(str) {
    return md5(str);
  }
  nanoid() {
    return nanoid();
  }
}

module.exports = ToolsService;
