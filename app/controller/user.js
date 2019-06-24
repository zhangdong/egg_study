'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const user = await this.service.adminUser.login(this.ctx.request.body);
    if (!user) {
      this.ctx.status = 404;
      this.ctx.body = { error: '用户不存在' };
    } else {
      if (user.status && user.error) {
        this.ctx.status = user.status;
        this.ctx.body = { error: user.error };
      } else {
        this.ctx.rotateCsrfSecret();
        this.ctx.status = 200;
        this.ctx.session.userinfo = user;
        this.ctx.body = user;
      }
    }
  }
  async logout() {
    this.ctx.session = null;
    this.ctx.status = 200;
  }

  async unbind() {
    const user = await this.service.user.unbind(this.ctx.params.id);
    if (user) {
      this.ctx.status = 200;
    } else {
      this.ctx.status = 404;
      this.ctx.body = { error: '用户不存在' };
    }
  }

  async createAdminUser() {
    const admin = await this.service.adminUser.create(this.ctx.request.body);
    if (admin.status && admin.error) {
      this.ctx.status = admin.status;
      this.ctx.body = { error: admin.error };
    } else {
      this.ctx.status = 201;
    }
  }

  async getUsers() {
    const result = await this.service.user.getUsers(this.ctx.query);
    this.ctx.status = 200;
    this.ctx.body = result;
  }

  async getUser() {
    const user = await this.service.user.getUser(this.ctx.params.tel);
    if (user.status && user.error) {
      this.ctx.status = user.status;
      this.ctx.body = { error: user.error };
    } else {
      this.ctx.status = 200;
      this.ctx.body = user;
    }
  }

  async addChannel() {
    const user = await this.service.user.addChannel(this.ctx.request.body);
    if (user.status && user.error) {
      this.ctx.status = user.status;
      this.ctx.body = { error: user.error };
    } else {
      this.ctx.status = 200;
    }
  }

  async getChannels() {
    const result = await this.service.user.getChannels(this.ctx.query);
    this.ctx.status = 200;
    this.ctx.body = result;
  }

  async track() {
    const user = await this.service.user.track(this.ctx.params, this.ctx.request.body);
    if (!user) {
      this.ctx.status = 404;
      this.ctx.body = { error: '用户不存在' };
    } else {
      this.ctx.status = 200;
    }
  }

  async getUserHistory() {

    const result = await this.service.user.getUserHistory(this.ctx.params);
    if (result.status && result.error) {
      this.ctx.status = result.status;
      this.ctx.body = { error: result.error };
    } else {
      this.ctx.status = 200;
      this.ctx.body = result;
    }
  }

  async deleteUser() {
    await this.service.user.deleteUser(this.ctx.params.id);
    this.ctx.status = 200;
  }

  async deleteUserMessage() {
    const result = await this.service.user.deleteUserMessage(this.ctx.params);
    if (result.status && result.error) {
      this.ctx.status = result.status;
      this.ctx.body = { error: result.error };
    } else {
      this.ctx.status = 200;
    }
  }

  async getAdminUsers() {
    const users = await this.service.adminUser.getUsers();
    this.ctx.status = 200;
    this.ctx.body = users;
  }

  async updateAdminUser() {
    await this.service.adminUser.updateUser(this.ctx.params.id, this.ctx.request.body);
    this.ctx.status = 200;
  }

  async deleteAdminUser() {
    await this.service.adminUser.delUser(this.ctx.params.id);
    this.ctx.status = 200;
  }

  async getCollectionList() {
    const result = await this.service.message.getCollectionList(this.ctx.params.tel, this.ctx.query.page);
    this.ctx.status = 200;
    this.ctx.body = result;
  }

  async collectionMessage() {
    await this.service.message.collectionMessage(this.ctx.request.body, this.ctx.params.tel);
    this.ctx.status = 200;
  }

  async unCollectionMessage() {
    await this.service.message.unCollectionMessage(this.ctx.request.body, this.ctx.params.tel);
    this.ctx.status = 200;
  }
}

module.exports = UserController;
