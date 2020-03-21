<template>
    <div id="app">
        <div id='stars'></div>
        <div id='stars2'></div>
        <div id='stars3'></div>
        <transition name="slide-in-blurred-right" mode="out-in">
            <div class="title-container" :key="pageInfo.pageTitle">
                <div class="core-title">
                    <span>{{ pageInfo.pageTitle }}</span>
                </div>
            </div>
        </transition>
        <transition mode="out-in" name="slide-in-blurred-right">
            <router-view @add-to-users-friends="addToUsersFriends" />
        </transition>
        <transition mode="out-in" name="slide-in-blurred-right">
            <div v-if="selectedValuesArray.length" class="neon-button" :key="pageInfo.buttonText">
                <router-link tag="a" :to="pageInfo.route" >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    {{ pageInfo.buttonText }}
                </router-link>
            </div>
        </transition>
    </div>
</template>

<script>
    import  { mapGetters } from 'vuex';

    export default {
        data: () => ({
            pageTitle: 'Let\'s fetch some',
        }),
        computed: {
            ...mapGetters([
                'selectedValuesArray'
            ]),
            pageInfo() {
                switch (this.$route.name) {
                    case 'Home':
                        return {
                            pageTitle: 'Let\'s fetch some',
                            buttonText: 'Friends List',
                            route: {
                                name: 'FriendsList'
                            }
                        };
                    default:
                        return {
                            pageTitle: 'Friends List',
                            buttonText: 'Back Home',
                            route: {
                                name: 'Home'
                            }
                        }
                }
            }
        },
        methods: {
            addToUsersFriends(friends) {
                console.log(friends)
            }
        }
    }
</script>

<style src="./assets/scss/main.scss" lang="scss"></style>
