'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io, config } = app;
  const contains = config.socketKeys;

  io.of('/').route(contains.authentication, io.controller.user.authentication);
  io.of('/').route(contains.chatMessageDidReceived, io.controller.user.messageDidReceived);

  router.get('/test', controller.web.test);

  router.get('/userlist', controller.web.userlist);

  router.get('/', controller.web.index);

  router.get('/smslist', controller.web.smslist);

  router.get('/channel', controller.web.channel);

  router.get('/usermanager', controller.web.usermanager);

  router.get('/ad', controller.web.ad);

  router.post('/login', controller.user.login);
  router.post('/logout', controller.user.logout);

  router.post('/:id/unbind', controller.user.unbind);

  router.post('/admin-user', controller.user.createAdminUser);

  router.get('/users', controller.user.getUsers);

  router.get('/users/:tel', controller.user.getUser);

  router.post('/users/add-channel', controller.user.addChannel);

  router.post('/users/channel', controller.user.getChannels);


  router.post('/users/:id/track', controller.user.track);

  router.get('/users/:id/history', controller.user.getUserHistory);
  // new
  // 删除用户
  router.delete('/user/:id', controller.user.deleteUser);

  // 删除用户短息
  router.post('/user/:id/delete-message', controller.user.deleteUserMessage);

  // 获取管理员用户列表
  router.get('/admin-users', controller.user.getAdminUsers);

  router.put('/admin-user/:id', controller.user.updateAdminUser);

  router.delete('/admin-user/:id', controller.user.deleteAdminUser);

  // 获取收藏列表  分页  /user/18610353005/collectionlist?page=0
  router.get('/user/:tel/collection', controller.user.getCollectionList);

  // 收藏消息  /user/18610353005/collcetion
  // pload [1,3,4,5]
  router.post('/user/:tel/collcetion', controller.user.collectionMessage);

  // 取消收藏 /user/18610353005/uncollcetion
  // pload [1,3,4,5]
  router.post('/user/:tel/uncollcetion', controller.user.unCollectionMessage);

  router.post('/post-message', controller.message.sendMessage);
  router.get('/record', controller.message.getRecords);

};
