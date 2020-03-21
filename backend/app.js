require('dotenv').config();

const path = require('path');
const config = require('./config/config');
const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const send = require('koa-send');
const serve = require('koa-static');

const app = new Koa();
const router = require('./routes/routes');
// app.use(async ctx => ctx.body = {msg: 'Hello World'});

app
    .use(logger())
    .use(serve(path.join(__dirname, '..', 'dist')))
    .use(bodyParser());

app
    .use(router.routes())
    .use(router.allowedMethods());

app
    .use(async (ctx, next) => {
        if (ctx.method !== 'GET') {
            return next()
        }

        if (ctx.accepts('json', 'html') === 'json') {
            return next();
        }

        await send(ctx, 'index.html', {
            root: './dist',
        });
    })
    .use(async ctx => {
        ctx.status = 404;
    });

app.listen(config.app.port, () => {
    console.log("\b\u001b[34m", `app spins on ${ config.app.port }`, '\x1b[0m');
});
