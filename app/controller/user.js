'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const body = this.ctx.request.body;
    const user = await this.ctx.model.Admin.findOne({ username: body.username });
    if (!user) {
      this.ctx.status = 401;
      this.ctx.body = { error: '用户不存在' };
    } else {
      const password = this.service.tools.md5(body.password);
      if (password === user.password) {
        this.ctx.status = 200;
        const u = user.toJSON();
        delete u.password;
        this.ctx.session.userinfo = u;
        this.ctx.body = u;
      } else {
        this.ctx.status = 401;
        this.ctx.body = { error: '账号/密码错误' };
      }
    }
  }
  async logout() {
    this.ctx.session = null;
    this.ctx.status = 200;
  }

  async unbind() {
    const model = this.ctx.model.User;
    const user = await model.findById(this.ctx.params.id);
    if (user) {
      await user.unbind();
      this.ctx.status = 200;
    } else {
      this.ctx.status = 404;
      this.ctx.body = { error: '用户不存在' };
    }
  }

  async createAdminUser() {
    const model = this.ctx.model.Admin;
    const body = this.ctx.request.body;
    body.password = this.service.tools.md5(body.password);
    const findOne = await model.findOne({ username: body.username });
    if (findOne) {
      this.ctx.status = 500;
      this.ctx.body = { error: '用户名重复' };
      return;
    }
    const admin = new model(body);
    await admin.save();
    this.ctx.status = 201;
  }

  async getUsers() {
    const model = this.ctx.model.User;
    const totalNum = await model.find({}).countDocuments();
    const pageSize = this.ctx.query.size ? this.ctx.query.size : 10;
    const page = this.ctx.query.page ? this.ctx.query.page : 0;
    const users = await model.find({}).select('tel _id device').sort({ _id: -1 })
      .skip(parseInt(page * pageSize))
      .limit(pageSize);
    this.ctx.status = 200;
    this.ctx.body = {
      count: totalNum,
      items: users,
    };
  }

  async getUser() {
    const model = this.ctx.model.User;
    const user = await model.findOne({ tel: this.ctx.params.tel });
    if (!user) {
      this.ctx.status = 404;
      this.ctx.body = { error: '用户不存在' };
      return;
    }
    const u = user.toJSON();
    delete u.newsHistory;
    this.ctx.status = 200;
    this.ctx.body = u;
  }

  async addChannel() {
    const model = this.ctx.model.User;
    const user = await model.findOne({ tel: this.ctx.request.body.tel });
    if (!user) {
      this.ctx.status = 404;
      this.ctx.body = { error: '用户不存在' };
      return;
    }
    let add = true;
    for (const i in user.channel.data) {
      const channel = user.channel.data[i];
      if (channel.id === this.ctx.request.body.id) {
        add = false;
        break;
      }
    }
    if (add === false) {
      this.ctx.status = 200;
      return;
    }
    const data = this.ctx.request.body;
    data.timestamp = new Date();
    user.channel.data.push(data);
    user.channel.isTrack = false;
    user.isTrack = false;
    user.channelTimestamp = data.timestamp;
    if (typeof user.product === 'undefined' || user.product == null || user.product === '') {
      user.product = data.name;
    } else {
      user.product = user.product + ',' + data.name;
    }
    await user.save();
    this.ctx.status = 200;

  }

  async getChannels() {
    const model = this.ctx.model.User;
    const count = await model.find().exists('product', true).countDocuments();
    const pageSize = this.ctx.query.size ? this.ctx.query.size : 10;
    const page = this.ctx.query.page ? this.ctx.query.page : 0;
    const channesl = await model.find().exists('product', true).skip(parseInt(page * pageSize))
      .limit(pageSize)
      .sort({ channelTimestamp: '-1' })
      .populate('trackUser');
    this.ctx.status = 200;
    this.ctx.body = {
      count,
      items: channesl,
    };
  }

  async track() {
    const model = this.ctx.model.User;
    const user = await model.findById(this.ctx.params.id);
    if (!user) {
      this.ctx.status = 404;
      this.ctx.body = { error: '用户不存在' };
      return;
    }
    user.channel.isTrack = true;
    user.trackUser = this.ctx.request.body.userid;
    user.isTrack = true;
    await user.save();
    this.ctx.status = 200;
  }

  async getUserHistory() {
    const model = this.ctx.model.User;
    const user = await model.findById(this.ctx.params.id);// .populate("pendingNews");
    if (!user) {
      this.ctx.status = 404;
      this.ctx.body = { error: '用户不存在' };
      return;
    }
    const model1 = this.ctx.model.Message;
    const result = await model1.find({ tel: user.tel }).sort({ timestamp: -1 });
    this.ctx.status = 200;
    this.ctx.body = {
      tel: user.tel,
      newsHistory: result,
    };
  }

  async deleteUser() {
    const model = this.ctx.model.User;
    await model.findByIdAndRemove(this.ctx.params.id);
    this.ctx.status = 200;
  }

  async deleteUserMessage() {
    const model = this.ctx.model.User;
    const user = await model.findById(this.ctx.params.id);
    if (!user) {
      this.ctx.status = 404;
      this.ctx.body = { error: '用户不存在' };
      return;
    }
    const model1 = this.ctx.model.Message;
    const result = await model1.find({ tel: user.tel });
    for (const i in result) {
      await result[i].remove();
    }
    this.ctx.status = 200;
  }

  async getAdminUsers() {
    const model = this.ctx.model.Admin;
    const users = await model.find({ username: { $ne: 'admin' } });
    this.ctx.status = 200;
    this.ctx.body = users;
  }

  async updateAdminUser() {
    const model = this.ctx.model.Admin;
    const body = this.ctx.request.body;
    if (body.password) {
      body.password = this.service.tools.md5(body.password);
    }
    await model.findByIdAndUpdate(this.ctx.params.id, body);
    this.ctx.status = 200;
  }

  async deleteAdminUser() {
    const model = this.ctx.model.Admin;
    await model.findByIdAndRemove(this.ctx.params.id);
    this.ctx.status = 200;
  }

  async getCollectionList() {
    const model = this.ctx.model.Message;
    const result = await model.find({ tel: this.ctx.params.tel }).skip(parseInt(this.ctx.query.page * 20)).limit(20);
    this.ctx.status = 200;
    this.ctx.body = result;
  }

  async collectionMessage() {
    const model = this.ctx.model.Message;
    const result = await model.find({ mid: { $in: this.ctx.request.body }, tel: this.ctx.params.tel });
    for (const i in result) {
      const message = result[i];
      message.isCollection = true;
      message.collectionDate = new Date();
      await message.save();
    }
    this.ctx.status = 200;
  }

  async unCollectionMessage() {
    const model = this.ctx.model.Message;
    const result = await model.find({ mid: { $in: this.ctx.request.body }, tel: this.ctx.params.tel });
    for (const i in result) {
      const message = result[i];
      message.isCollection = false;
      await message.save();
    }
    this.ctx.status = 200;
  }
}

module.exports = UserController;
