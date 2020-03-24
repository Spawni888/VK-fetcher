<template>
    <div class="friend-info-container">
        <transition name="fade-in" mode="out-in">
            <div v-if="profile" class="friend-info" :key="profile.id">
                <div class="friend-picture-container">
                    <div class="friend-picture">
                        <img :src="profile.photo_400_orig || profile.photo_200_orig || profile.photo_200" alt="photo">
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
                        <div>{{ profile.sex | defineSex}}</div>
                    </div>
                    <div class="friend-about__age">
                        <span>Age:</span>
                        <div>{{ profile.bdate | defineAge }}</div>
                    </div>
                </div>
            </div>
            <div v-else class="loader-container" key="loader">
                <div class="loader">
                    <div class="inner one"></div>
                    <div class="inner two"></div>
                    <div class="inner three"></div>
                </div>
            </div>
        </transition>
        <div class="friends-with">
            <div class="title-container">
                <div class="core-title">
                    <span>Are friends with selected:</span>
                </div>
            </div>
            <div class="friends-list">
                <div
                        v-for="friend in selectedFriends"
                        :key="friend.id"
                        class="friend">
                    <div class="friend__picture">
                        <img :src="friend.photo_100" alt="profile-img">
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
                        {{ friend.sex | defineSex}}
                    </div>
                    <div class="friend__age">
                        Age:
                        {{ friend.bdate | defineAge }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import filtersMixin from '@/mixins/filtersMixin';
    import { mapGetters } from 'vuex';

    export default {
        name: "FriendInfo",
        data: () => ({
            profile: null,
            wall: null,
            selectedFriends: []
        }),
        computed: {
            ...mapGetters([
                'selectedProfilesObj',
                'getMutualFriends'
            ])
        },
        methods: {
            getPageInfo() {
                this.selectedFriends = [];

                axios.get(`/profiles/profile-full/${this.$route.params.id}`)
                    .then(res => {
                        this.profile = res.data;
                        console.log(this.profile)
                    });
                axios.get(`/profiles/profile-wall/${ this.$route.params.id }`)
                    .then(res => {
                        this.wall = res.data;
                        // console.log(res.data);
                    })
                    .catch();

                //create selected friends array
                this.getMutualFriends(this.$route.params.id).forEach(mutualFr => {
                    this.selectedFriends.push(this.selectedProfilesObj[mutualFr.id]);
                })

            }
        },
        created() {
            this.getPageInfo();
        },
        mixins: [filtersMixin],
    }
</script>

<style lang="scss" scoped>
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

            .friend-picture-container {
                display: flex;
                align-items: center;
                .friend-picture {
                    margin-right: 50px;
                    img {
                        max-height: 550px;
                        height: auto;
                        min-width: 400px;
                        width: 100%;
                        border-radius: 20px;
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

                >* {
                    display: flex;
                    flex-wrap: wrap;
                    >* {
                        flex: 1 1 100%;
                    }
                }
                span {
                    font-size: 30px;
                }
            }
        }
        .friends-with {
            .friends-list {
                max-width: 800px;
                margin: 0 auto;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .friend {
                    color: #FFFFFF;
                    margin: 0 5px 20px 5px;
                    padding: 10px;
                    text-align: center;
                    min-width: 200px;
                    background-color: #38495a;
                    border-radius: 20px;

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
        }
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
