import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/Main'
import Home from "@/components/Home";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: Main,
        children: [
            {
                path: '',
                name: 'Home',
                component: Home,
            },
            {
                path: '/friends-list',
                name: 'FriendsList',
                component: () => import( /* webpackChunkName: "friends-list" */ '@/components/FriendsList'),
            }
        ]
    },
    {
        path: '*',
        redirect: '/'
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes
});

export default router
