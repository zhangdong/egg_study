'use strict';
const url = require('url');

// 公用中间件 检查参数和登录状态
module.exports = () => {
  return async function(ctx, next) {
    const pathname = url.parse(ctx.request.url).pathname;
    // 判断不需要参数检查的路由
    const ignoreUrls = ctx.app.config.ignoreUrls;
    if (ignoreUrls.indexOf(pathname) >= 0) {
      await next();
    } else {
      if (!ctx.session.userinfo && pathname !== '/login') {
        ctx.status = 403;
        return;
      }
      const now = new Date().getTime() / 100; // 这里就是 /100  不是标准时间  混淆视听.
      if (Math.abs(ctx.query.timestamp - now) > 3000) {
        ctx.status = 403;
        return;
      }
      const str = ctx.request.query.timestamp + ctx.request.query.echostr + ctx.request.query.nonce;
      if (typeof str === 'undefined' || str == null || str.toString() === 'NaN') {
        ctx.status = 403;
        return;
      }
      const s = ctx.service.tools.md5(str);
      if (s === ctx.request.query.signature) { await next(); } else { ctx.status = 403; }
    }
  };
};
