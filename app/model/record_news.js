'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    mid: {
      type: 'String',
      required: true,
    },
    content: {},
    timestamp: {
      type: 'Date',
      default: new Date(),
    },
  });
  return mongoose.model('RecordNews', schema, 'record_news');

};
