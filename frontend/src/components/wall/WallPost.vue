<template>
    <div class="wall-post">
        <div class="profile-info">
            <div class="profile-info__picture">
                <a
                    :href="`https://vk.com/id${profileCopy.id}`"
                    target="_blank"
                >
                    <img
                        :src="profileCopy.photo_400_orig || profileCopy.photo_200_orig || profileCopy.photo_200"
                        alt="profile"
                    >
                </a>
            </div>
            <div class="profile-info__other">
                <div class="profile-info__name">
                    {{ profileCopy.first_name }} {{ profileCopy.last_name }}
                </div>
                <div class="profile-info__date">
                    <a
                        :href="`https://vk.com/wall${profile.id}_${postCopy.id}`"
                        target="_blank"
                    >
                        {{ defineDate(postCopy.date) }}
                    </a>
                </div>
            </div>
            <attachments
                :profile="profile"
                :post-copy="postCopy"
                :profile-copy="profileCopy"
                :input="postCopy"
            />
        </div>

        <div
            v-if="postCopy.copy_history"
            class="reposts"
        >
            <transition-group
                mode="out-in"
                name="fade-in"
            >
                <div
                    v-for="(repost, i) in postCopy.copy_history"
                    v-if="repost.photo"
                    :key="repost.photo"
                    class="repost"
                    :style="{paddingLeft: i * 50 + 50 + 'px'}"
                >
                    <div class="repost-info">
                        <div class="repost-icon">
                            <img
                                src="@/assets/img/repost.png"
                                alt="repost"
                            >
                        </div>
                        <div class="repost-info__picture">
                            <a
                                :href="createImgLink(repost)"
                                target="_blank"
                            >
                                <img
                                    :src="repost.photo"
                                    alt="img"
                                >
                            </a>
                        </div>
                        <div class="repost-info__other">
                            <div class="repost-info__name">
                                {{ repost.name }}
                            </div>
                            <div class="repost-info__date">
                                <a
                                    :href="`https://vk.com/wall${repost.from_id}_${repost.id}`"
                                    target="_blank"
                                >
                                    {{ defineDate(repost.date) }}
                                </a>
                            </div>
                        </div>
                        <attachments
                            :profile="profile"
                            :post-copy="postCopy"
                            :profile-copy="profileCopy"
                            :input="repost"
                        />
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Attachments from '@/components/wall/Attachments';

export default {
    name: 'WallPost',
    components: {
        Attachments,
    },
    props: {
        post: {
            type: Object,
        },
        profile: {
            type: Object,
        },
    },
    data: () => ({
        postCopy: null,
        profileCopy: null,
        attachmentKey: 1,
    }),
    created() {
        this.postCopy = { ...this.post };
        this.profileCopy = { ...this.profile };
        this.getPostHistoryInfo();
    },
    methods: {
        async getPostHistoryInfo() {
            axios.get(`/profiles/profile-full/${this.postCopy.from_id}`)
                .then((res) => {
                    this.profileCopy = res.data;
                });

            if (!this.postCopy.copy_history) return;
            for (const historyItem of this.postCopy.copy_history) {
                // group or profile?
                if (/^-/g.test(historyItem.from_id)) {
                    const repost = await axios.get(`/profiles/group/${String(historyItem.from_id).slice(1)}`);
                    const {
                        name, photo_50, photo_100, photo_200,
                    } = repost.data;
                    historyItem.name = name;
                    historyItem.photo = photo_200 || photo_100 || photo_50;

                    this.postCopy = { ...this.postCopy };
                } else {
                    const repost = await axios.get(`/profiles/profile-full/${historyItem.owner_id}`);
                    const {
                        first_name, last_name, photo_200, photo_200_orig, photo_400_orig,
                    } = repost.data;
                    historyItem.name = `${first_name} ${last_name}`;
                    historyItem.photo = photo_400_orig || photo_200_orig || photo_200;

                    this.postCopy = { ...this.postCopy };
                }
            }
        },
        defineDate(date) {
            let dateObj = new Date(1970, 0, 1, 3, 0, 0, 0);

            dateObj.setSeconds(dateObj.getSeconds() + date);
            dateObj = dateObj.toString().replace(/GMT.*$/gi, '');
            return dateObj;
        },
        createImgLink({ from_id }) {
            const isPublic = /^-/.test(from_id) ? 'public' : 'id';
            const id = isPublic === 'public' ? String(from_id).slice(1) : from_id;

            return `https://vk.com/${isPublic}${id}`;
        },
    },
};
</script>

<style lang="scss">
    .wall-post {
        border-bottom: 2px solid #FFFFFF;
        .profile-info {
            display: flex;
            margin-bottom: 20px;
            flex-wrap: wrap;
            &__picture {
                margin-right: 20px;
                img {
                    width: 100px;
                    height: auto;
                    border-radius: 25px;
                }
            }
            &__other {
                color: #FFFFFF;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            &__name {
                font-size: 20px;
            }
            &__date {
                color: #939393;
            }
        }
        &__text {
            flex: 1 1 100%;
            margin-top: 15px;
            color: #FFFFFF;
            line-height: 1.3rem;
        }


        .repost {
            color: #FFFFFF;
            margin-bottom: 20px;

            .repost-info {
                display: flex;
                margin-bottom: 15px;
                flex-wrap: wrap;
                position: relative;

                .repost-icon {
                    position: absolute;
                    left: -40px;
                    top: 0px;
                    img {
                        width: 25px;
                        height: 25px;
                    }
                }

                &__picture {
                    margin-right: 20px;
                    img {
                        width: 60px;
                        height: auto;
                        border-radius: 25px;
                    }
                }
                &__other {
                    color: #FFFFFF;
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;
                    justify-content: space-between;
                }
                &__name {
                    font-size: 20px;
                    margin-bottom: 10px;
                }
                &__date {
                    color: #939393;
                }
            }
        }

        a:hover {
            /*border-bottom: 1px dotted #939393;*/
            text-decoration: underline  #939393;
            color: #acacac;
        }
        a,
        a:active,
        a:visited,
        a:focus {
            text-decoration: none;
            color: #939393;
            transition: all .4s;
        }
    }

</style>
