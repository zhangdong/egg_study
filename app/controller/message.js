'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {
  async sendMessage() {
    const nid = this.service.tools.nanoid();
    const id = nid + new Date().getTime();
    const mid = this.service.tools.md5(id);

    const messageModel = this.ctx.model.Message;
    const recordNewsModel = this.ctx.model.RecordNews;
    await recordNewsModel.create({ mid, content: this.ctx.request.body, timestamp: new Date() });
    const tels = this.ctx.request.body.handphones;
    const message = this.ctx.request.body;
    delete message.handphones;

    const contains = this.config.socketKeys;
    for (const i in tels) {
      const tel = tels[i];
      const msg = {};
      msg.content = message;
      msg.timestamp = parseInt(new Date().getTime() / 1000);
      msg.mid = mid;
      msg.tel = tel;
      await messageModel.create(msg);
      const toSocket = this.service.socketCache.get(tel);
      if (toSocket) {
        const socket = this.app.io.to(toSocket);
        if (socket) {
          socket.emit(contains.chatMessageReceived, msg);
        } else {
          // 离线通知 不实现了

        }
      } else {
        // 离线通知 不实现了

      }
    }

    this.ctx.status = 200;

  }

  async getRecords() {
    const model = this.ctx.model.RecordNews;
    const count = await model.find().countDocuments();
    const pageSize = this.ctx.query.size ? this.ctx.query.size : 10;
    const page = this.ctx.query.page ? this.ctx.query.page : 0;
    const result = await model.find().skip(parseInt(page * pageSize))
      .limit(pageSize);
    this.ctx.status = 200;
    this.ctx.body = { count, items: result };
  }

}

module.exports = MessageController;
