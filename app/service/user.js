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

}

module.exports = UserService;
