<template>
    <div id="app">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
        <transition
            name="slide-left-right"
            mode="out-in"
        >
            <div
                :key="pageInfo.pageTitle"
                class="title-container"
            >
                <div class="core-title">
                    <span>{{ pageInfo.pageTitle }}</span>
                </div>
            </div>
        </transition>
        <transition
            mode="out-in"
            name="slide-left-right"
        >
            <router-view />
        </transition>
        <transition
            mode="out-in"
            name="slide-right"
        >
            <div
                v-if="selectedValuesArray.length || $route.name !== 'Home'"
                :key="pageInfo.buttonText"
                class="neon-button"
                @click="routeTo(pageInfo.route)"
            >
                <neon-button>
                    {{ pageInfo.buttonText }}
                </neon-button>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NeonButton from '@/components/NeonButton';

export default {
    components: {
        NeonButton,
    },
    data: () => ({
        pageTitle: 'Let\'s fetch some',
    }),
    computed: {
        ...mapGetters([
            'selectedValuesArray',
        ]),
        pageInfo() {
            switch (this.$route.name) {
            case 'Home':
                return {
                    pageTitle: 'Let\'s fetch some',
                    buttonText: 'Friends List',
                    route: {
                        name: 'FriendsList',
                    },
                };
            case 'FriendInfo':
                return {
                    pageTitle: 'Person Information',
                    buttonText: 'Back to Friends',
                    route: {
                        name: 'FriendsList',
                    },
                };
            default:
                return {
                    pageTitle: 'Friends List',
                    buttonText: 'Back Home',
                    route: {
                        name: 'Home',
                    },
                };
            }
        },
    },
    methods: {
        routeTo(route) {
            this.$router.push(route);
        },
    },
};
</script>

<style src="./assets/scss/main.scss" lang="scss"></style>
