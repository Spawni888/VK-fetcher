<template>
    <div class="home">
        <div class="home-input">
            <div class="input-container">
                <input type="text" v-model="id" @input="fetchInfo" placeholder="PLACE VK-ID HERE">
            </div>

            <div class="lazy-profile">
                <transition mode="out-in" name="fade-in">
                    <div v-if="lazyProfile === 'not-found'" class="profile-inner" :key="notFoundId">
                        <div class="profile-picture">
                            <img src="@/assets/img/404.jpg" alt="profile-img">
                        </div>
                        <div class="profile-inner__text">
                            Profile with id:
                            <br>
                            <span>{{ notFoundId }}</span>
                            <br>
                            Not found.
                            <br>
                            Try one another, boy.
                        </div>
                    </div>
                    <div
                            v-else-if="lazyProfile"
                            :key="lazyProfile.id"
                            class="profile-inner profile-inner_hover"
                            @click="selectProfile">

                        <div class="profile-picture">
                            <img :src="lazyProfile.photo_100" alt="profile-img">
                        </div>
                        <div class="lazy-profile__fname">
                             First name:
                            {{ lazyProfile.first_name }}
                        </div>
                        <div class="lazy-profile__lname">
                            Last name:
                            {{ lazyProfile.last_name }}
                        </div>
                        <div class="lazy-profile__sex">
                            Sex:
                            {{ lazyProfile.sex | defineSex}}
                        </div>
                        <div class="lazy-profile__age">
                            Age:
                            {{ lazyProfile.bdate | defineAge }}
                        </div>
                        <div class="lazy-profile__friends">
                            Friends count:
                            {{ lazyProfile.friends.count }}
                        </div>
                    </div>
                    <div v-else class="lazy-profile__loader" key="loader">
                        <div class="inner one"></div>
                        <div class="inner two"></div>
                        <div class="inner three"></div>
                    </div>
                </transition>
            </div>
        </div>
        <transition name="fade-in" mode="out-in">
            <div v-if="selectedValuesArray.length" class="selected-profiles" :key="selectedValuesArray.length">
                <div
                        v-for="item in selectedValuesArray"
                        class="selected-profiles__item"
                        @click="unselectProfile(item)">

                    <div class="selected-profiles__picture">
                        <img :src="item.photo_100" :key="item.id" alt="selected-img">
                    </div>
                    <div class="profile-hover">
                        <div class="profile-hover__picture">
                            <img src="@/assets/img/cross.png" alt="cross">
                        </div>
                        <div class="profile-hover__name">
                            {{ item.first_name }} {{ item.last_name }}
                        </div>
                    </div>

                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import axios from 'axios';
    import debounce from 'lodash/debounce';
    import  { mapGetters, mapMutations, mapActions } from 'vuex';

    export default {
        name: 'Home',
        data: () => ({
            id: '',
            lazyProfile: null,
            notFoundId: null
        }),
        methods: {
            ...mapMutations([
                'select',
                'unselect',
            ]),
            ...mapActions([
                'fetchFriendsFriends'
            ]),
            fetchInfo: debounce(function () {
                if (!this.id || this.isSelected({id: this.id})) {
                    return this.lazyProfile = null;
                }

                axios.get(`/profiles/${ this.id }`)
                    .then(res => {
                        this.lazyProfile = res.data;
                    })
                    .catch(err => {
                        // console.log(err.response.data);
                        this.lazyProfile = 'not-found';
                        this.notFoundId = this.id;
                    });
            }, 500),
            selectProfile() {
                if (this.isSelected(this.lazyProfile)) {
                    this.notFoundId = this.id;
                    return this.lazyProfile = 'already-selected';
                }
                this.select(this.lazyProfile);
                this.fetchFriendsFriends(this.lazyProfile);

                this.lazyProfile = null;
            },
            unselectProfile(profile) {
                this.unselect(profile);

                if (parseInt(this.id) === profile.id || parseInt(this.id) === profile.domain) {
                    this.fetchInfo();
                }
            }
        },
        computed: {
            ...mapGetters([
                'isSelected',
                'selectedValuesArray'
            ]),
        },
        filters: {
            defineSex(value) {
                switch (value) {
                    case 2:
                        return 'Male';
                    case 1:
                        return 'Female';
                    default:
                        return 'No info'
                }
            },
            defineAge(value) {
                if (!value) return 'No info';
                const bdate = value.split('.');

                if (bdate.length === 3) {
                    const [day, month, year] = bdate;
                    const ageInMs = new Date() - new Date(year, month, day + 1).getTime();
                    const ageDate = new Date(ageInMs);

                    return Math.abs(ageDate.getUTCFullYear() - 1970);
                }
                return 'No info';
            }
        }
    }
</script>

<style scoped lang="scss">
    .home {
        width: 80%;
        margin: 0 auto;

        .home-input {
            display: flex;
            position: relative;
            justify-content: center;
            flex-wrap: wrap;
            align-items: center;
            padding-bottom: 40px;

            .input-container {
                width: 30%;
                display: flex;
                flex: 1 0 100%;
                justify-content: center;

                input {
                    padding: 8px 40px;
                    outline: none;
                    background-color: #38495a;
                    border: none;
                    color: #FFFFFF;
                    font-size: 30px;
                    margin-bottom: 40px;
                    text-align: center;

                    &:focus::-webkit-input-placeholder {
                        opacity: 0.5;
                    }
                    &:focus::-webkit-input-placeholder { /* Chrome/Opera/Safari */
                        color: #b5b5b5;
                    }
                    &::-webkit-input-placeholder {
                        color: #b5b5b5;
                    }
                    &:hover::-webkit-input-placeholder { /* Chrome/Opera/Safari */
                        color: #dcdcdc;
                    }
                }
            }

            .lazy-profile {
                margin: 0 auto;
                flex: 1 0 100%;
                display: flex;
                justify-content: center;
                color: #FFFFFF;
                height: 304px;

                &__loader {
                    margin-top: 30px;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    perspective: 800px;

                }

                .profile-inner {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    width: 20%;
                    text-align: center;
                    background-color: rgba(181, 181, 181, 0.34);
                    border-radius: 20px;
                    padding-bottom: 20px;
                    line-height: 1.4rem;

                    >* {
                        flex: 1 0 100%;
                    }

                    &__text {
                        width: 80%;
                        font-size: 18px;
                        margin: 10px;
                        line-height: 1.4rem;

                        span {
                            font-size: 30px;
                            line-height: 2rem;
                            display: inline-flex;
                            align-items: center;
                            color: rgba(44, 204, 255, 0.58);
                            padding: 10px 0;
                        }
                    }
                }

                .profile-inner_hover {
                    cursor: pointer;
                    &:hover {
                        background-color: rgba(181, 181, 181, 0.47);
                    }
                }

                .profile-picture{
                    text-align: center;
                    margin: 20px;

                    img {
                        height: 100px;
                        width: 100px;
                        border-radius: 50px;
                        display: inline-block;
                    }
                }
            }

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
        .selected-profiles {
            max-width: 80%;
            width: 100%;

            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;

            &__item {
                margin: 0 20px 30px 20px;
                position: relative;
                cursor: pointer;

                &:hover {
                    .profile-hover {
                        opacity: 1;
                    }
                }
                .profile-hover {
                    position: absolute;
                    left: 0;
                    top: 0;
                    opacity: 0;
                    transition: opacity .3s;

                    img {
                        border-radius: 50px;
                        width: 100px;
                        height: 100px;
                    }

                    &__name {
                        position: absolute;
                        left: -50%;
                        color: #FFFFFF;
                        opacity: 0.8;
                        text-align: center;
                        min-width: 200%;
                    }
                }

            }
            &__picture {
                img {
                    border-radius: 50px;
                }
            }

        }

        .fade-in-enter-active {
            animation: fade-in .5s ease-in-out both;
        }
        .fade-in-leave-active {
            animation: fade-in .5s ease-in-out both reverse;
        }

        @keyframes fade-in {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

    }
</style>