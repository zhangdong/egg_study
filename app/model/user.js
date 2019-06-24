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
      jpushId: 'String',
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
  });

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
    this.device.token = device.token;
    await this.save();
    return addNewUUID;
  };

  return mongoose.model('User', userSchema, 'user');

};
