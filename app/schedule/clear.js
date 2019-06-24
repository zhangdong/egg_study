'use strict';

const Subscription = require('egg').Subscription;

class Clear extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 4 * * ?', // 凌晨4点定时清理数据
      type: 'worker',
    };
  }

  async subscribe() {
    this.service.garbage.cleanRecordMessage();
    this.service.garbage.cleanUserMessage();
  }
}

module.exports = Clear;

