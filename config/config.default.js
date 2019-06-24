/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1561078834154_3180';

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'ensureRequest' ];
  config.view = {
    defaultViewEngine: 'pug',
    mapping: {
      '.jade': 'pug',
    },
  };
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/shandong',
      options: { useFindAndModify: false },
      // mongoose global plugins, expected a function or an array of function and options
      // plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
    },
  };
  config.passportLocal = {

  };
  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [ 'auth' ],
        // packetMiddleware: [ 'filter' ],
      },
    },
  };
  config.ignoreUrls = [ '/post-message', '/logout', '/', 'add-channel', '/test', '/userlist', '/smslist', '/channel', '/usermanager' ];

  config.socketKeys = {
    serviceLoginFormOther: 'service-logged-in-from-other-device', // 客服登录冲突  if dont need delete it.
    authentication: 'user-authentication', // 上线
    authenticationResult: 'authentication-result', // 上线返回结果
    chatMessageReceived: 'chat-message-received', // 接收到别人消息
    chatMessage: 'chat-message', // 发送消息
    chatHistory: 'chat-history', // 查询历史消息
    chatHistoryDelivered: 'chat-history-delivered', // 历史消息返回结果
    fetchOnlineUsers: 'fetch-online-users', // 查询在线用户
    fetchOnlineUsersResult: 'fetch-online-users-result', // 查询在线用户结果
    chatMessageDidReceived: 'chat-message-did-received', // 消息已接收
    userLoginFromOtherDevice: 'user-logged-in-from-other-device', // 从别的设备登录
    APNSNickname: '系统消息',
    maxLimitCount: 20,
  };

  config.security = {
    // csrf: {
    //   useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
    // },
  };

  return {
    ...config,
  };
};

