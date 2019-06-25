'use strict';

const Service = require('egg').Service;

class RecordNewsService extends Service {
  async getRecords(query) {
    const model = this.ctx.model.RecordNews;
    const count = await model.find().countDocuments();
    const pageSize = query.size ? query.size : 10;
    const page = query.page ? query.page : 0;
    const items = await model.find().skip(parseInt(page * pageSize))
      .limit(pageSize);
    return { count, items };
  }

  async create(mid, body) {
    const model = this.ctx.model.RecordNews;
    await model.create({ mid, content: body, timestamp: new Date() });
  }
}

module.exports = RecordNewsService;
