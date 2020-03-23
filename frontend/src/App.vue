<template>
    <div id="app">
        <div id='stars'></div>
        <div id='stars2'></div>
        <div id='stars3'></div>
        <transition name="slide-left-right" mode="out-in">
            <div class="title-container" :key="pageInfo.pageTitle">
                <div class="core-title">
                    <span>{{ pageInfo.pageTitle }}</span>
                </div>
            </div>
        </transition>
        <transition mode="out-in" name="slide-left-right">
            <router-view/>
        </transition>
        <transition mode="out-in" name="slide-right">
            <div v-if="selectedValuesArray.length" class="neon-button" :key="pageInfo.buttonText">
                <neon-button :route="pageInfo.route">
                    {{ pageInfo.buttonText }}
                </neon-button>
            </div>
        </transition>
    </div>
</template>

<script>
    import  { mapGetters } from 'vuex';
    import NeonButton from '@/components/NeonButton';

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
        components: {
            NeonButton
        }
    }
</script>

<style src="./assets/scss/main.scss" lang="scss"></style>
