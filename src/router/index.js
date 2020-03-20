import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/Main'
import Home from "@/views/Home";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: Home,
        name: 'Home'
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
