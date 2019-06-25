'use strict';

const Service = require('egg').Service;

class AdminUserService extends Service {
  async login(body) {
    const user = await this.ctx.model.Admin.findOne({ username: body.username });
    if (user) {
      const password = this.service.tools.md5(body.password);
      if (password === user.password) {
        const userJson = user.toJSON();
        delete userJson.password;
        return userJson;
      }
      return { status: 401, error: '账号/密码错误' };
    }
    return null;
  }

  async create(body) {
    const model = this.ctx.model.Admin;
    const findOne = await model.findOne({ username: body.username });
    if (findOne) {
      return { status: 500, error: '用户名重复' };
    }
    const userJson = body;
    userJson.password = this.service.tools.md5(body.password);
    const admin = await model.create(userJson);
    return admin;
  }

  async getUsers() {
    const model = this.ctx.model.Admin;
    const users = await model.find({ username: { $ne: 'admin' } });
    return users;
  }

  async updateUser(id, body) {
    const model = this.ctx.model.Admin;
    const _body = body;
    if (body.password) {
      _body.password = this.service.tools.md5(body.password);
    }
    await model.findByIdAndUpdate(id, _body);
  }

  async delUser(id) {
    const model = this.ctx.model.Admin;
    await model.findByIdAndRemove(id);
  }
}

module.exports = AdminUserService;
