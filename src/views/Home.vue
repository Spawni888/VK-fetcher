<template>
    <div class="home">
        <div class="home__title">
            <span>Let's fetch some</span>
        </div>
        <div class="home-input">
            <div class="input-container">
                <input type="text" v-model="id" @input="fetchInfo" placeholder="PLACE PERSON ID HERE">
            </div>

                <div class="lazy-profile">
                    <transition mode="out-in" name="fade-in">
                        <div v-if="lazyProfile" class="lazy-profile__inner">
                            <div class="lazy-profile__picture">
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
                            </div>
                        </div>
                        <div v-else class="lazy-profile__loader">
                            <div class="inner one"></div>
                            <div class="inner two"></div>
                            <div class="inner three"></div>
                        </div>
                    </transition>
                </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import querystring from 'qs';

    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    export default {
        name: 'Home',
        data: () => ({
            id: '',
            pending: false,
            lastRequestId: true,
            lazyProfile: null
        }),
        computed: {
            queryParams() {
                return {
                    access_token: '205356fa205356fa205356fabb202335df22053205356fa7e20db7152664d1e0aacc722',
                    user_ids: this.id,
                    fields: [
                        'first_name',
                        'deactivated',
                        'sex',
                        'bdate',
                        'photo_100'
                    ],
                    v: 5.52
                }
            }
        },
        methods: {
            fetchInfo() {
                if (this.pending || !this.queryParams.user_ids) return;

                this.pending = true;
                this.lastRequestId = this.id;

                axios.get(
                    corsProxy + `https://api.vk.com/method/users.get?${querystring.stringify(this.queryParams)}`,
                )
                .then(res => {
                    console.log(res.data);
                    const {response, error} = res.data;

                    if (!error && !response[0].deactivated) {
                        this.lazyProfile = Object.assign({}, response[0]);
                    }

                    this.pending = false;
                    if (this.lastRequestId !== this.id) {
                        this.fetchInfo();
                    }
                })
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
        created() {

        }
    }
</script>

<style scoped lang="scss">
    .home {
        width: 1200px;
        margin: 0 auto;

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

                    &:focus {
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

                &__loader {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    perspective: 800px;

                }

                &__inner {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    width: 20%;
                    text-align: center;
                    background-color: rgba(181, 181, 181, 0.34);
                    border-radius: 20px;
                    padding-bottom: 20px;
                    cursor: pointer;

                    >* {
                        flex: 1 0 100%;
                    }
                    &:hover {
                        background-color: rgba(181, 181, 181, 0.47);
                    }
                }
                &__picture{
                    text-align: center;
                    margin: 20px;
                    img {
                        border-radius: 50px;
                        display: inline-block;
                    }
                }
                &__fname{

                }
                &__lname{}
                &__sex{}
                &__age{}
                &__friends{}
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

        .fade-in-enter-active {
            animation: fade-in 1.6s ease-in-out both;
        }
        .fade-in-leave-active {
            animation: fade-in 1.6s ease-in-out both reverse;
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
