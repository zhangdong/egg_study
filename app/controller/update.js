'use strict';
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const Controller = require('egg').Controller;

class UpdateController extends Controller {
  async version() {
    const result = await readFile(path.join(__dirname, '../../version.json'), { encoding: 'utf8' });
    this.ctx.status = 200;
    this.ctx.body = result;
  }
}

module.exports = UpdateController;
