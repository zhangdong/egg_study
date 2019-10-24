'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const schema = new mongoose.Schema({
    username: {
      type: 'String',
      required: true,
      unique: true,
    },
    password: {
      type: 'String',
      required: true,
    },
    isChannel: {
      type: 'Boolean',
      default: false,
    },
    nickname: {
      type: 'String',
      required: true,
    },
  }, {
    versionKey: false,
    usePushEach: true,
  });
  return mongoose.model('AdminUser', schema);

};
