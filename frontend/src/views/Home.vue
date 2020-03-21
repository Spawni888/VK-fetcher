<template>
    <div class="home">
        <div class="home__title">
            <span>Let's fetch some</span>
        </div>
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
                            <span>{{ this.notFoundId }}</span>
                            <br>
                            Not found.
                            <br>
                            Try one another, boy.
                        </div>
                    </div>
                    <div
                            v-else-if="lazyProfile"
                            :key="this.lazyProfile.id"
                            class="profile-inner profile-inner_hover"
                            @click="selectProfile">

                        <div class="profile-picture">
                            <img :src="this.lazyProfile.photo_100" alt="profile-img">
                        </div>
                        <div class="lazy-profile__fname">
                             First name:
                            {{ this.lazyProfile.first_name }}
                        </div>
                        <div class="lazy-profile__lname">
                            Last name:
                            {{ this.lazyProfile.last_name }}
                        </div>
                        <div class="lazy-profile__sex">
                            Sex:
                            {{ this.lazyProfile.sex | defineSex}}
                        </div>
                        <div class="lazy-profile__age">
                            Age:
                            {{ this.lazyProfile.bdate | defineAge }}
                        </div>
                        <div class="lazy-profile__friends">
                            Friends count:
                            {{ this.lazyProfile.friends.count }}
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
            <div v-if="Object.keys(selectedProfiles).length" class="selected-profiles" :key="Object.keys(selectedProfiles).length">
                <div v-for="item in Object.values(selectedProfiles)" class="selected-profiles__item">
                    <div class="selected-profiles__picture">
                        <img :src="item.photo_100" :key="item.id" alt="selected-img">
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import axios from 'axios';
    import debounce from 'lodash/debounce';

    export default {
        name: 'Home',
        data: () => ({
            id: '',
            lazyProfile: null,
            notFoundId: null,
            selectedProfiles: {}
        }),
        methods: {
            fetchInfo: debounce(function () {
                if (!this.id) {
                    return this.lazyProfile = null;
                }

                axios.get(`/profiles/${ this.id }`)
                    .then(res => {
                        if (this.selectedProfiles[res.data.id]) {
                            return this.lazyProfile = null;
                        }
                        this.lazyProfile = res.data;
                    })
                    .catch(err => {
                        // console.log(err.response.data);
                        this.lazyProfile = 'not-found';
                        this.notFoundId = this.id;
                    });
            }, 500),
            selectProfile() {
                if (this.selectedProfiles[this.lazyProfile.id]) {
                    this.notFoundId = this.id;
                    return this.lazyProfile = 'already-selected';
                }
                this.selectedProfiles[this.lazyProfile.id] = this.lazyProfile;
                this.lazyProfile = null;
            }
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
        },
    }
</script>

<style scoped lang="scss">
    .home {
        width: 1200px;
        margin: 0 auto;
        height: 100%;

        &__title {
            text-align: center;
            padding: 40px 20px;
            span {
                color: #FFF;
                text-align: center;
                font-family: "lato", sans-serif;
                font-weight: 300;
                font-size: 80px;
                letter-spacing: 10px;
                background: -webkit-linear-gradient(white, #38495a);
                -webkit-background-clip: text;
                 -webkit-text-fill-color: transparent;
            }
        }

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
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            &__item {
                padding: 20px 2000px;
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

        .fade-out-enter,
        .fade-out-leave-to {
            opacity: 0;
        }
        .fade-out-enter-active,
        .fade-out-leave-active {
            transition: opacity .5s ease;
        }
        .fade-out-leave,
        .fade-out-enter-to{
            opacity: 1;
        }

    }
</style>
