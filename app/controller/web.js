'use strict';

const Controller = require('egg').Controller;

class WebController extends Controller {
  async index() {
    await this.ctx.render('login.jade');
  }

  async test() {
    await this.ctx.render('test.jade');
  }

  async userlist() {
    await this.ctx.render('userlist.jade');
  }

  async smslist() {
    await this.ctx.render('smslist.jade');
  }

  async channel() {
    await this.ctx.render('channel.jade');
  }

  async usermanager() {
    await this.ctx.render('usermanager.jade');
  }
  async ad() {
    this.ctx.body = '不想写了';
  }
}

module.exports = WebController;
