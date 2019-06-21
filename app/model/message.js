'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    tel: {
      type: 'String',
      required: true,
      index: true,
    },
    mid: {
      type: 'String',
      required: true,
      index: true,
    },
    type: {
      type: 'String',
      enum: [ 'text', 'picture', 'url' ],
      default: 'text',
    },
    timestamp: {// 时间
      type: 'Number',
      required: true,
    },
    isReceived: {
      type: 'Boolean',
      default: false,
    },
    isCollection: {
      type: 'Boolean',
      default: false,
    },
    collectionDate: {
      type: 'Date',
      default: new Date(),
    },
    content: {// 内容

    },
  });
  return mongoose.model('Message', schema, 'message');
};
