require('dotenv').config();

const config = require('./config/config');
const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = require('./routes/routes');
// app.use(async ctx => ctx.body = {msg: 'Hello World'});

app
    .use(logger())
    .use(bodyParser());

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.app.port, () => {
    console.log("\b\u001b[34m", `app spins on ${ config.app.port }`, '\x1b[0m');
});
