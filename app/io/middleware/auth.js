'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const { socket } = ctx;
    // const id = socket.id;
    await next();
    ctx.service.socketCache.all();
    ctx.service.socketCache.remove(socket.tmptel);
  };

};
