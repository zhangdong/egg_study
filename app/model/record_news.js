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
  }, {
    versionKey: false,
    usePushEach: true,
  });
  return mongoose.model('RecordNews', schema);

};
