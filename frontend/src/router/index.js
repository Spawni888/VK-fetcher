import Vue from 'vue'
import store from '@/store/index';
import VueRouter from 'vue-router'
import FriendsList from '@/views/FriendsList'
import Home from "@/views/Home";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: Home,
        name: 'Home'
    },
    {
        path: '/friends-list',
        component: FriendsList,
        name: 'FriendsList',
        beforeEnter: (to, from, next) => {
            store.commit('createFriendsList');

            //preload 21 profiles friends
            store.dispatch('getFriendsCount', {start: 0, end: 21});
            next();
        }
    },
    {
        path: '*',
        redirect: '/'
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior (to, from) {
        return window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    routes
});

export default router;
