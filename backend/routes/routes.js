const Router = require('koa-router');
const profileController = require('../controllers/profiles');

const router = new Router({prefix: '/profiles'});

router
    .get('/:id', profileController.getProfile)
    .get('/profiles/friends/:id', profileController.getFriends);

module.exports = router;
