const Router = require('koa-router');
const profileController = require('../controllers/profiles');

const router = new Router({prefix: '/profiles'});

router
    .get('/profile-and-friends/:id', profileController.getProfile)
    .get('/profile-full/:id', profileController.getFullProfileInfo)
    .get('/friends/:id', profileController.getFriends)
    .get('/profile-wall/:id/:offset', profileController.getProfileWall)
    .get('/group/:id', profileController.getGroup);

module.exports = router;
