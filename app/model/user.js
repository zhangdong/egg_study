'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const userSchema = new mongoose.Schema({
    channel: {
      data: [
        {
          id: 'String',
          name: 'String',
          timestamp: {
            type: 'Date',
            default: new Date(),
          },
        },
      ],
      isTrack: {
        type: 'Boolean',
        default: false,
      },
    },
    appversion: 'Number',
    newsHistory: [],
    channelTimestamp: {
      type: 'Date',
      default: new Date(),
    },
    product: 'String',
    isTrack: {
      type: 'Boolean',
      default: false,
    },
    trackUser: {
      type: 'ObjectId',
      ref: 'Admin',
    },
    tel: {
      type: 'String',
      required: true,
      unique: true,
      index: true,
    },
    device: {
      os: {
        type: 'String',
        enum: [ 'IOS', 'Android' ],
      },
      token: 'String',
      uuids: [{
        type: 'String',
        required: true,
      }],
      umeng: 'String',
      logDate: [
        {
          timestamp: { type: 'Date' },
          type: {
            type: 'String',
            enum: [ 'bind', 'unbind' ],
          },
        },
      ],
    },
  }, {
    versionKey: false,
    usePushEach: true,
  });
  userSchema.methods.updateUMToken = async function(token) {
		this.device.umeng = token;
		await this.save();
  }
  
  userSchema.methods.updateDevice = async function(device, addNew, jpushId) {
    let addNewUUID = false;
    if (typeof jpushId !== 'undefined') {
      this.device.jpushId = jpushId;
    }
    if (this.device.uuids.length === 0) {
      this.device.uuids.push(device.uuid);
      this.device.logDate.push({ timestamp: new Date(), type: 'bind' });
      addNewUUID = false;
    } else {
      if (this.device.uuids[this.device.uuids.length - 1] !== device.uuid) {
        addNewUUID = true;
      }
    }
    if (addNewUUID === true && addNew === true) {
      this.device.logDate.push({ timestamp: new Date(), type: 'bind' });
      this.device.uuids.push(device.uuid);
    }
    this.device.os = device.os;
    if (typeof device.token === 'undefined') { device.token = null; }
    if (typeof device.umeng === 'undefined') { device.umeng = null; }
    this.device.token = device.token;
    this.device.umeng = device.umeng;
    await this.save();
    return false;
  };

  return mongoose.model('User', userSchema);
};
