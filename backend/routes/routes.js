const Router = require('koa-router');
const profileController = require('../controllers/profiles');

const router = new Router({prefix: '/profiles'});

router
    .get('/:id', profileController.getProfile);

module.exports = router;
