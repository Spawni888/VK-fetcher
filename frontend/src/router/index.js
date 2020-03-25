import Vue from 'vue';
import store from '@/store/index';
import VueRouter from 'vue-router';
import FriendsList from '@/views/FriendsList';
import Home from '@/views/Home';
import FriendInfo from '@/views/FriendInfo';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: Home,
        name: 'Home',
    },
    {
        path: '/friend/:id',
        component: FriendInfo,
        name: 'FriendInfo',
    },
    {
        path: '/friends-list',
        component: FriendsList,
        name: 'FriendsList',
        beforeEnter: (to, from, next) => {
            store.commit('createFriendsList');

            // preload 21 profiles friends
            store.dispatch('getFriendsCount', { start: 0, end: 21 });
            next();
        },
    },
    {
        path: '*',
        redirect: '/',
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior() {
        return window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    routes,
});

// wait for scroll animation before routing
router.beforeEach((to, from, next) => {
    const scrollFromTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);

    if (scrollFromTop === 0) {
        return next();
    }

    setTimeout(() => next(), scrollFromTop * 250 / 2058 + 400);

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
    next(false);
});
export default router;
