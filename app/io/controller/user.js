'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async auth() {
    const { app } = this;
    // const nsp = app.io.of('/');
    const contains = this.config.socketKeys;
    const data = this.ctx.args[0] || {};
    const socket = this.ctx.socket;
    const result = await this.service.user.createUser(data);
    if (result.success === 0) { // error
      console.log(result.error);
      socket.emit(contains.authenticationResult, {
        isAuthed: false,
        changeDevice: false,
        error: 'create user error',
      });
    } else {
      const user = result.user;
      if (typeof data.device.uuid === 'undefined' || data.device.uuid == null) {
        socket.emit(contains.authenticationResult, {
          isAuthed: false,
          changeDevice: false,
          error: 'uuid can not be null',
        });
        return;
      }
      if (typeof data.device.os === 'undefined' || data.device.os == null) {
        socket.emit(contains.authenticationResult, {
          isAuthed: false,
          changeDevice: false,
          error: "type 'os' can not be null",
        });
        return;
      }
      const addNew = await user.updateDevice(data.device, data.changeDevice, data.jpushId);
      if (addNew === true && data.changeDevice === false) {
        socket.emit(contains.authenticationResult, {
          isAuthed: false,
          changeDevice: true,
          error: 'change new device',
        });
        return;
      }
      if (addNew === true && data.changeDevice === true) {
        const oldSocketId = this.service.socketCache.get(user.tel);
        const oldSocket = app.io.to(oldSocketId);
        if (oldSocket != null) {
          oldSocket.emit(contains.userLoginFromOtherDevice, { message: 'userLoginFromOtherDevice' });
          oldSocket.disconnect();
        } else {
          // 通知不实现了
        }
      }
      const newuser = user.toJSON();
      delete newuser.newsHistory;
      socket.emit(contains.authenticationResult, {
        isAuthed: true,
        changeDevice: false,
        user: newuser,
      });

      // 向缓存绑定socketid 和 tel
      socket.tmptel = data.tel;
      this.service.socketCache.set(socket.tmptel, socket.id);
      const pendingMessages = await this.service.message.getPendingNews(data.tel);
      if (pendingMessages && pendingMessages.length > 0) {
        socket.emit(contains.chatMessageReceived, pendingMessages);
      }
    }
  }

  async messageDidReceived() {
    const data = this.ctx.args[0] || {};
    const socket = this.ctx.socket;
    await this.service.message.changeMessageStatus(socket.tmptel, data.ids);
  }

  // async test() {
  //   const { ctx, app } = this;
  //   const socket = ctx.socket;
  //   const message = this.ctx.args[0] || {};
  //   let to;
  //   if (socket.tmptel === '18201060094') {
  //     to = '18610353005';
  //   } else {
  //     to = '18201060094';
  //   }
  //   const toSocket = this.service.socketCache.get(to);
  //   if (toSocket) {
  //     app.io.to(toSocket).emit('chat-message-received', message);
  //   }
  // }
}

module.exports = UserController;
