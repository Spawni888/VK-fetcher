const config = require('./config/config');
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const profileRouter = require('./controllers/profiles/routes');

// app.use(async ctx => ctx.body = {msg: 'Hello World'});

app.use(profileRouter.routes()).use(profileRouter.allowedMethods());

app.listen(config.app.port, () => {
    console.log("\b\u001b[34m", `app spins on ${ config.app.port }`);
});
