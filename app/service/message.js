'use strict';

const Service = require('egg').Service;
const UMeng = require('../lib/upush');
const async = require('async');

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

  sendios(list, body) {
    const contains = this.config.upush;
    const umeng = new UMeng({
      appKey: contains.iosAppKey,
      appMasterSecret: contains.iosappSecret,
    });
    umeng.pushList({
      title: '系统通知',
      content: body,
      list,
      finish(r) { console.log(r); },
    });
  }

  sendandriod(list, body) {
    const contains = this.config.upush;
    const umeng = new UMeng({
      appKey: contains.andriodAppKey,
      appMasterSecret: contains.andriodappSecret,
    });
    umeng.pushList({
      title: '系统通知',
      content: body,
      list,
    });
  }

  async createAndSendMessage(mid, body) {
    const model = this.ctx.model.Message;
    const tels = body.handphones;
    const message = body;
    delete message.handphones;
    const contains = this.config.socketKeys;
    const umTokens_andriod = [];
    const umTokens_ios = [];
    const self = this;

    const q = async.queue(async function(msg) {
      const tel = msg.tel;

      await model.create(msg);
      let user;
      const result = await self.service.user.createUser({ tel });
      if (result.success !== 0) {
        user = result.user;
      }

      const toSocket = self.service.socketCache.get(tel);
      if (toSocket) {
        const socket = self.app.io.to(toSocket);
        if (socket) {
          socket.emit(contains.chatMessageReceived, msg);
        }
      }

      if (user) {
        if (user.device.umeng.length > 0) {
          if (user.device.os.toLowerCase() === 'ios') {
            umTokens_ios.push(user.device.umeng);
          } else if (user.device.os.toLowerCase() === 'android') {
            umTokens_andriod.push(user.device.umeng);
          }
        }
      }
      return true;
    }, 11);
    q.drain(function() {
      if (umTokens_andriod.length > 0) {
        self.sendandriod(umTokens_andriod, message.smsbody);
      }
      if (umTokens_ios.length > 0) {
        self.sendios(umTokens_ios, message.smsbody);
      }
    });
    for (const i in tels) {
      const tel = tels[i];
      const msg = {};
      msg.content = message;
      msg.timestamp = parseInt(new Date().getTime() / 1000);
      msg.mid = mid;
      msg.tel = tel;
      q.push(msg);
    }

  }
}

module.exports = MessageService;
