<template>
    <div class="friends-container">
        <div class="friends-list">
            <transition-group
                name="slide-right"
                tag="div"
                style="display: flex; justify-content: space-between; flex-wrap: wrap;"
            >
                <div
                    v-for="friend in paginatedFriends()"
                    :key="friend.id"
                    class="friend"
                    :style="{borderColor: `hsla(${ computeHue(friend) }, 72%, 70%, 70%)`}"
                    @click="openInfo(friend)"
                >
                    <div class="friend__picture">
                        <img
                            :src="friend.photo_100"
                            alt="profile-img"
                        >
                    </div>
                    <div class="friend__fname">
                        First name:
                        {{ friend.first_name }}
                    </div>
                    <div class="friend__lname">
                        Last name:
                        {{ friend.last_name }}
                    </div>
                    <div class="friend__sex">
                        Sex:
                        {{ defineSex(friend.sex) }}
                    </div>
                    <div class="friend__age">
                        Age:
                        {{ defineAge(friend.bdate) }}
                    </div>
                    <div class="friend__friends">
                        <transition
                            mode="out-in"
                            name="fade-in"
                        >
                            <span v-if="friend.friendsCount !== undefined">
                                Friends count: {{ friend.friendsCount }}
                            </span>
                            <div
                                v-else
                                class="lds-ring"
                            >
                                <div /><div /><div /><div />
                            </div>
                        </transition>
                    </div>
                </div>
            </transition-group>
        </div>
        <transition name="slide-right">
            <div
                v-if="isPageBottom"
                :key="pages"
                class="more-button"
                @click="increasePages"
            >
                <neon-button>Show More</neon-button>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NeonButton from '@/components/NeonButton';
import methodsMixin from '@/mixins/methodsMixin';

export default {
    name: 'FriendsList',
    components: {
        NeonButton,
    },
    mixins: [methodsMixin],
    data: () => ({
        pages: 1,
        isPageBottom: false,
    }),
    computed: {
        ...mapGetters([
            'profilesFriends',
            'getMutualFriends',
            'selectedValuesArray',
            'maxMutualFriendsNumber',
        ]),
    },
    mounted() {
        this.pages = 1;
        window.addEventListener('scroll', this.onScroll);
    },
    destroyed() {
        window.removeEventListener('scroll', this.onScroll);
    },
    methods: {
        ...mapActions([
            'getFriendsCount',
        ]),
        paginatedFriends() {
            const end = this.pages * 21;
            if (end > this.profilesFriends.length - 1) {
                window.removeEventListener('scroll', this.onScroll);
                this.isPageBottom = false;
                return this.profilesFriends;
            }
            return this.profilesFriends.slice(0, end);
        },
        increasePages() {
            this.isPageBottom = false;
            const start = 21 * this.pages;

            let end = start + 21;
            if (end > this.profilesFriends.length) {
                end = this.profilesFriends.length;
            }
            this.getFriendsCount({ start, end });
            this.pages++;
        },
        onScroll() {
            const bottomOfWindow = Math.max(
                window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop,
            ) + window.innerHeight + 800 >= document.documentElement.offsetHeight;

            this.isPageBottom = bottomOfWindow;
        },
        computeHue({ id }) {
            const maxMutualFriend = this.maxMutualFriendsNumber;
            if (Number(maxMutualFriend) === 1) return 118;

            const mutualFriendsCount = this.getMutualFriends(id).length;

            return (mutualFriendsCount - 1) / (maxMutualFriend - 1) * (360 - 118) + 118;
        },
        openInfo({ id }) {
            this.$router.push({ name: 'FriendInfo', params: { id } });
        },
    },
};
</script>

<style scoped lang="scss">
    @import "@/assets/scss/main";

    .friends-list {
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        @media (max-width: $smDesktopWidth) {
            max-width: 680px;
        }
        @media (max-width: $tableWidth) {
            max-width: 400px;
            font-size: 14px;
        }

        .friend {
            border: 5px solid;
            color: #FFFFFF;
            margin: 0 5px 20px 5px;
            padding: 10px;
            text-align: center;
            min-width: 200px;
            background-color: #38495a;
            border-radius: 20px;
            cursor: pointer;
            @media (max-width: $smDesktopWidth) {
                min-width: 180px;
            }
            @media (max-width: $tableWidth) {
                min-width: 140px;
            }
            &:hover {
                background-color: #556b7c;
            }
            &__picture {
                padding: 20px;
                img {
                    border-radius: 50px;
                }
            }
            &__friends {
                padding-bottom: 10px;
            }
        }
    }
    .more-button {
        display: flex;
        position: fixed;
        left: 0;
        bottom: 0;
        justify-content: center;
        margin: 20px 40px;

        @media (max-width: $tableWidth) {
            margin: 10px 20px;
        }
    }

    .lds-ring {
        display: inline-block;
        position: relative;
        width: 12px;
        height: 12px;
        transform: translateY(-50%) translateX(-25%);
    }
    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 10px;
        height: 10px;
        margin: 8px;
        border: 1px solid #fff;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #fff transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
    }
    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
