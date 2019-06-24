'use strict';

const Service = require('egg').Service;

class MessageService extends Service {
  async getPendingNews(tel) {
    const model = this.ctx.model.Message;
    const messages = await model.find({ tel, isReceived: false });
    return messages;
  }

  async changeMessageStatus(tel, messageIds) {
    const model = this.ctx.model.Message;
    const messages = await model.find({ mid: { $in: messageIds }, tel });
    for (const i in messages) {
      const message = messages[i];
      message.isReceived = true;
      await message.save();
    }
  }

  async getCollectionList(tel, page) {
    const model = this.ctx.model.Message;
    const result = await model.find({ tel }).skip(parseInt(page * 20)).limit(20);
    return result;
  }

  async collectionMessage(body, tel) {
    const model = this.ctx.model.Message;
    const result = await model.find({ mid: { $in: body }, tel });
    for (const i in result) {
      const message = result[i];
      message.isCollection = true;
      message.collectionDate = new Date();
      await message.save();
    }
  }

  async unCollectionMessage(body, tel) {
    const model = this.ctx.model.Message;
    const result = await model.find({ mid: { $in: body }, tel });
    for (const i in result) {
      const message = result[i];
      message.isCollection = false;
      await message.save();
    }
  }

  async createAndSendMessage(mid, body) {
    const model = this.ctx.model.Message;
    const tels = body.handphones;
    const message = body;
    delete message.handphones;
    const contains = this.config.socketKeys;
    for (const i in tels) {
      const tel = tels[i];
      const msg = {};
      msg.content = message;
      msg.timestamp = parseInt(new Date().getTime() / 1000);
      msg.mid = mid;
      msg.tel = tel;
      await model.create(msg);
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
  }
}

module.exports = MessageService;
