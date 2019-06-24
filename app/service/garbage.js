'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class GarbageService extends Service {
  async cleanUserMessage() {
    const model = this.ctx.model.Message;
    const overdueDate = parseInt(new Date().getTime() / 1000) - 86400 * 7;
    await model.remove({ timestamp: { $lt: overdueDate } });
  }

  async cleanRecordMessage() {
    const model = this.ctx.model.RecordNews;
    const overdueDate = moment().subtract(7, 'day').toDate();
    await model.remove({ timestamp: { $lt: overdueDate } });
  }
}

module.exports = GarbageService;
