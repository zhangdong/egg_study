'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async createUser(userData) {
    const model = this.ctx.model.User;
    try {
      const user = await model.findOne({ tel: userData.tel });
      if (user) {
        return { success: 1, user };
      }
      const newUser = await model.create(userData);
      if (!newUser) {
        return { success: 0, error: '用户创建失败' };
      }
      return { success: 1, user: newUser };
    } catch (error) {
      return { success: 0, error };
    }
  }

  async unbind(id) {
    const model = this.ctx.model.User;
    const user = await model.findById(id);
    if (user) {
      user.device.logDate.push({ timestamp: new Date(), type: 'unbind' });
      user.device.uuids = [];
      await user.save();
    }
    return user;
  }

  async getUsers(query) {
    const model = this.ctx.model.User;
    const count = await model.find({}).countDocuments();
    const pageSize = query.size ? query.size : 10;
    const page = query.page ? query.page : 0;
    const items = await model.find({}).select('tel _id device').sort({ _id: -1 })
      .skip(parseInt(page * pageSize))
      .limit(pageSize);
    return {
      count,
      items,
    };
  }

  async getUser(tel) {
    const model = this.ctx.model.User;
    const user = await model.findOne({ tel });
    if (!user) {
      return { status: 404, error: '用户不存在' };
    }
    const userJson = user.toJSON();
    delete userJson.newsHistory;
    return userJson;
  }

  async addChannel(body) {
    const model = this.ctx.model.User;
    const user = await model.findOne({ tel: body.tel });
    if (!user) {
      return { status: 404, error: '用户不存在' };
    }
    let add = true;
    for (const i in user.channel.data) {
      const channel = user.channel.data[i];
      if (channel.id === body.id) {
        add = false;
        break;
      }
    }
    if (add === false) {
      return user;
    }
    const data = body;
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
    return user;
  }

  async getChannels(query) {
    const model = this.ctx.model.User;
    const count = await model.find().exists('product', true).countDocuments();
    const pageSize = query.size ? query.size : 10;
    const page = query.page ? query.page : 0;
    const items = await model.find().exists('product', true).skip(parseInt(page * pageSize))
      .limit(pageSize)
      .sort({ channelTimestamp: '-1' })
      .populate('trackUser');
    return { count, items };
  }

  async track(params, body) {
    const model = this.ctx.model.User;
    const user = await model.findById(params.id);
    if (user) {
      user.channel.isTrack = true;
      user.trackUser = body.userid;
      user.isTrack = true;
      await user.save();
    }
    return user;
  }

  async getUserHistory(params) {
    const model = this.ctx.model.User;
    const user = await model.findById(params.id);
    if (!user) {
      return { status: 404, error: '用户不存在' };
    }
    const messageModel = this.ctx.model.Message;
    const result = await messageModel.find({ tel: user.tel }).sort({ timestamp: -1 });
    return {
      tel: user.tel,
      newsHistory: result,
    };
  }

  async deleteUser(id) {
    const model = this.ctx.model.User;
    await model.findByIdAndRemove(id);
  }

  async deleteUserMessage(params) {
    const model = this.ctx.model.User;
    const user = await model.findById(params.id);
    if (!user) {
      return { status: 404, error: '用户不存在' };
    }
    const messageModel = this.ctx.model.Message;
    const result = await messageModel.find({ tel: user.tel });
    for (const i in result) {
      await result[i].remove();
    }
    return null;
  }
}

module.exports = UserService;
