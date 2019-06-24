'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {
  async sendMessage() {
    const nid = this.service.tools.nanoid();
    const id = nid + new Date().getTime();
    const mid = this.service.tools.md5(id);

    await this.service.recordNews.create(mid, this.ctx.request.body);
    await this.service.message.createAndSendMessage(mid, this.ctx.request.body);
    this.ctx.status = 200;
  }

  async getRecords() {
    const result = await this.service.recordNews.getRecords(this.ctx.query);
    this.ctx.status = 200;
    this.ctx.body = result;
  }
}

module.exports = MessageController;
