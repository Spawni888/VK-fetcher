<template>
    <div class="friend-info-container">
        <transition
            name="fade-in"
            mode="out-in"
        >
            <div
                v-if="profile"
                :key="profile.id"
                class="friend-info"
            >
                <div class="friend-picture-container">
                    <div class="friend-picture">
                        <img
                            :src="profile.photo_400_orig || profile.photo_200_orig || profile.photo_200"
                            alt="photo"
                        >
                    </div>
                </div>
                <div class="friend-about">
                    <div class="friend-about__fname">
                        <span>First name:</span>
                        <div>{{ profile.first_name }}</div>
                    </div>
                    <div class="friend-about__lname">
                        <span>Last name:</span>
                        <div>{{ profile.last_name }}</div>
                    </div>
                    <div class="friend-about__sex">
                        <span>Sex:</span>
                        <div>{{ defineSex(profile.sex) }}</div>
                    </div>
                    <div class="friend-about__age">
                        <span>Age:</span>
                        <div>{{ defineAge(profile.bdate) }}</div>
                    </div>
                </div>
            </div>
            <div
                v-else
                key="loader"
                class="loader-container"
            >
                <div class="loader">
                    <div class="inner one" />
                    <div class="inner two" />
                    <div class="inner three" />
                </div>
            </div>
        </transition>
        <div class="friends-with">
            <div class="title-container">
                <div class="core-title">
                    <span>Are friends with selected</span>
                </div>
            </div>
            <div class="friends-list">
                <div
                    v-for="friend in selectedFriends"
                    :key="friend.id"
                    class="friend"
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
                </div>
            </div>
        </div>
        <div class="wall-container">
            <div class="title-container">
                <div class="core-title">
                    <span>
                        {{ (wall === null || !wall.items.length)? 'Wall is hidden or empty' : 'Wall' }}
                    </span>
                </div>
            </div>
            <profile-wall
                v-if="wall && profile"
                :wall="wall"
                :profile="profile"
            />
        </div>

        <transition name="slide-right">
            <div
                v-if="isPageBottom"
                :key="wallPosts"
                class="more-button"
                @click="showMorePosts"
            >
                <neon-button>Show More</neon-button>
            </div>
        </transition>
    </div>
</template>

<script>
import axios from 'axios';
import methodsMixin from '@/mixins/methodsMixin';
import ProfileWall from '@/components/wall/ProfileWall';
import { mapGetters } from 'vuex';
import NeonButton from '@/components/NeonButton';

export default {
    name: 'FriendInfo',
    components: {
        ProfileWall,
        NeonButton,
    },
    mixins: [methodsMixin],
    data: () => ({
        profile: null,
        wall: null,
        wallPosts: 1,
        selectedFriends: [],
        isPageBottom: false,
    }),
    computed: {
        ...mapGetters([
            'selectedProfilesObj',
            'getMutualFriends',
        ]),
    },
    created() {
        this.getPageInfo();
        this.wallPosts = 1;
    },
    destroyed() {
        window.removeEventListener('scroll', this.onScroll);
    },
    methods: {
        getPageInfo() {
            this.selectedFriends = [];

            axios.get(`/profiles/profile-full/${this.$route.params.id}`)
                .then((res) => {
                    this.profile = res.data;
                });
            axios.get(`/profiles/profile-wall/${this.$route.params.id}/0`)
                .then((res) => {
                    this.wall = res.data;
                    window.addEventListener('scroll', this.onScroll.bind(this));
                })
                .catch(() => {
                    this.wall = null;
                });

            // create selected friends array
            const mutualFriends = this.getMutualFriends(this.$route.params.id);

            if (mutualFriends === undefined || !mutualFriends.length) return;
            mutualFriends.forEach((mutualFr) => {
                this.selectedFriends.push(this.selectedProfilesObj[mutualFr.id]);
            });
        },
        onScroll() {
            if (this.wall.count === this.wallPosts || !this.wall.items.length) { return this.isPageBottom = false; }

            const bottomOfWindow = Math.max(
                window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop,
            ) + window.innerHeight + 200 >= document.documentElement.offsetHeight;

            this.isPageBottom = bottomOfWindow;
        },
        async showMorePosts(event) {
            event.target.blur();
            this.isPageBottom = false;

            await axios.get(`/profiles/profile-wall/${this.$route.params.id}/${this.wallPosts}`)
                .then((res) => {
                    const wallCopy = { ...this.wall };
                    wallCopy.items.push(...res.data.items);
                    this.wall = wallCopy;
                })
                .catch(() => {
                    this.showMorePosts.call(this);
                });
            this.wallPosts++;
        },
    },
};
</script>

<style lang="scss" scoped>
    @import "@/assets/scss/main";

    .friend-info-container {
        width: 80%;
        margin: 0 auto;
        padding-top: 40px;

        .friend-info {
            width: 60%;
            margin: 0 auto 60px;
            display: flex;
            justify-content: center;
            text-align: center;
            min-height: 550px;
            @media (max-width: $tableWidth) {
                min-height: 400px;
            }

            .friend-picture-container {
                display: flex;
                align-items: center;
                .friend-picture {
                    margin-right: 50px;
                    img {
                        /*max-height: 550px;*/
                        height: auto;
                        min-width: 400px;
                        width: 100%;
                        border-radius: 20px;
                        @media (max-width: $tableWidth) {
                            min-height: 300px;
                        }
                    }
                }
            }

            .friend-about {
                flex-direction: column;
                justify-content: space-between;
                display: flex;
                flex-wrap: wrap;
                color: #FFFFFF;
                font-size: 60px;
                @media (max-width: $tableWidth) {
                    font-size: 40px
                }
                >* {
                    display: flex;
                    flex-wrap: wrap;
                    >* {
                        flex: 1 1 100%;
                    }
                }
                span {
                    font-size: 30px;
                    @media (max-width: $tableWidth) {
                        font-size: 18px;
                    }
                }
            }
        }
        .friends-with {
            .friends-list {
                max-width: 800px;
                margin: 0 auto 60px;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                padding-top: 40px;

                .friend {
                    color: #FFFFFF;
                    margin: 0 15px 20px 15px;
                    padding: 10px;
                    text-align: center;
                    min-width: 200px;
                    background-color: #38495a;
                    border-radius: 20px;
                    line-height: 1.5rem;
                    &__picture {
                        padding: 20px;
                        img {
                            border-radius: 50px;
                        }
                    }
                    &__age {
                        padding-bottom: 15px;
                    }
                }
            }
        }

    }
    .more-button {
        position: fixed;
        left: 0;
        bottom: 0;
    }
    .lds-ring {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
        max-height: 550px;

    }
    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 100px;
        height: 100px;
        margin: 8px;
        border: 5px solid #fff;
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
    .loader-container {
        display: flex;
        justify-content: center;
        margin-top: 100px;
        min-height: 550px;

        .loader {
            margin-top: 30px;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            perspective: 800px;
            .inner {
                position: absolute;
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }

            .inner.one {
                left: 0%;
                top: 0%;
                animation: rotate-one 1s linear infinite;
                border-bottom: 3px solid #EFEFFA;
            }

            .inner.two {
                right: 0%;
                top: 0%;
                animation: rotate-two 1s linear infinite;
                border-right: 3px solid #EFEFFA;
            }

            .inner.three {
                right: 0%;
                bottom: 0%;
                animation: rotate-three 1s linear infinite;
                border-top: 3px solid #EFEFFA;
            }

            @keyframes rotate-one {
                0% {
                    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
                }
                100% {
                    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
                }
            }

            @keyframes rotate-two {
                0% {
                    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
                }
                100% {
                    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
                }
            }

            @keyframes rotate-three {
                0% {
                    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
                }
                100% {
                    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
                }
            }
        }
    }

</style>
