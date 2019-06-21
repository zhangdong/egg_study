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
}

module.exports = MessageService;
