<template>
    <div class="wall-post">
        <div class="profile-info">
            <div class="profile-info__picture">
                <a :href="`https://vk.com/id${profile.id}`" target="_blank">
                    <img :src="profile.photo_400_orig || profile.photo_200_orig || profile.photo_200" alt="profile">
                </a>
            </div>
            <div class="profile-info__other">
                <div class="profile-info__name">
                    {{ profile.first_name }} {{ profile.last_name }}
                </div>
                <div class="profile-info__date">
                    <a :href="`https://vk.com/wall${profile.id}_${postCopy.id}`" target="_blank">
                        {{ postCopy.date | defineDate}}
                    </a>
                </div>
            </div>
            <div class="profile-attachments">
                <div v-if="postCopy.attachments && arePhotoAttachments(postCopy.attachments)" class="attachments-photo">
                    <div
                            v-for="attachment in postCopy.attachments"
                            class="attachments__item"
                            v-if="attachment.type === 'photo'">
                        <a :href="`https://vk.com/photo${attachment.photo.owner_id}_${attachment.photo.id}`" target="_blank">
                            <div  class="img-container">
                                <img
                                        :src="attachment.photo.photo_604 || attachment.photo.photo_130"
                                        alt="photo">
                            </div>
                        </a>

                    </div>
                </div>
                <div v-if="postCopy.attachments && areVideoAttachments(postCopy.attachments)" class="attachments-video">
                    <div
                            v-for="attachment in postCopy.attachments"
                            class="attachments__item"
                            v-if="attachment.type === 'video'">
                        <div  class="video-link">
                            <div class="img-container">
                                    <a :href="`https://vk.com/video${attachment.video.owner_id}_${attachment.video.id}`" target="_blank">
                                        <img
                                                :src="attachment.video.photo_320 || attachment.video.photo_130"
                                                alt="photo">
                                        <div class="video-overlay">
                                            <img src="@/assets/img/play.png" alt="play">
                                        </div>
                                    </a>
                                </div>
                            <div class="name">{{ attachment.video.title }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="postCopy.text" class="wall-post__text" v-html="parseText(postCopy.text)"></div>
            </div>
        </div>

        <div v-if="postCopy.copy_history" class="reposts">
            <transition-group mode="out-in" name="fade-in">
                <div
                        v-for="(repost, i) in postCopy.copy_history"
                        v-if="repost.photo"
                        class="repost"
                        :key="repost.photo"
                        :style="{paddingLeft: i * 50 + 50 + 'px'}">
                    <div class="repost-info">
                        <div class="repost-icon">
                            <img src="@/assets/img/repost.png" alt="repost">
                        </div>
                        <div class="repost-info__picture">
                            <a :href="createImgLink(repost)" target="_blank">
                                <img :src="repost.photo" alt="img">
                            </a>
                        </div>
                        <div class="repost-info__other">
                            <div class="repost-info__name">
                                {{ repost.name }}
                            </div>
                            <div class="repost-info__date">
                                <a :href="`https://vk.com/wall${repost.from_id}_${repost.id}`" target="_blank">
                                    {{ repost.date | defineDate }}
                                </a>
                            </div>
                        </div>
                        <div class="repost-attachments">
                            <div
                                    v-if="repost.attachments && arePhotoAttachments(repost.attachments)"
                                    class="attachments-photo">
                                <div
                                        v-for="attachment in repost.attachments"
                                        class="attachments__item"
                                        v-if="attachment.type === 'photo'">
                                    <a :href="`https://vk.com/photo${attachment.photo.owner_id}_${attachment.photo.id}`" target="_blank">
                                        <div  class="img-container">
                                            <img
                                                    :src="attachment.photo.photo_604 || attachment.photo.photo_130"
                                                    alt="photo">
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div v-if="repost.attachments && areVideoAttachments(repost.attachments)" class="attachments-video">
                                <div
                                        v-for="attachment in repost.attachments"
                                        class="attachments__item"
                                        v-if="attachment.type === 'video'">
                                    <div  class="video-link">
                                        <div class="img-container">
                                            <a :href="`https://vk.com/video${attachment.video.owner_id}_${attachment.video.id}`" target="_blank">
                                                <img
                                                        :src="attachment.video.photo_320 || attachment.video.photo_130"
                                                        alt="photo">
                                                <div class="video-overlay">
                                                    <img src="@/assets/img/play.png" alt="play">
                                                </div>
                                            </a>
                                        </div>
                                        <div class="name">{{ attachment.video.title }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="repost__text" v-html="parseText(repost.text)"></div>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "WallPost",
        props: {
            post: {
                type: Object
            },
            profile: {
                type: Object
            }
        },
        data: () => ({
            postCopy: null,
            attachmentKey: 1
        }),
        methods: {
            async getPostHistoryInfo() {
                if (!this.postCopy.copy_history) return;
                for (let historyItem of this.postCopy.copy_history) {
                    // group or profile?
                    if (/^-/g.test(historyItem.from_id)) {
                        const repost = await axios.get(`/profiles/group/${String(historyItem.from_id).slice(1)}`);
                        const {name, photo_50, photo_100, photo_200} = repost.data;
                        historyItem.name = name;
                        historyItem.photo = photo_200 || photo_100 || photo_50;

                        this.postCopy = Object.assign({}, this.postCopy);
                    }
                    else {
                        const repost = await axios.get(`/profiles/profile-full/${historyItem.owner_id}`);
                        const {first_name, last_name, photo_200, photo_200_orig, photo_400_orig} = repost.data;
                        historyItem.name = first_name + ' ' + last_name;
                        historyItem.photo = photo_400_orig || photo_200_orig || photo_200;

                        this.postCopy = Object.assign({}, this.postCopy);
                    }
                }
            },
            parseText(text) {
                let newText = text;
                let parts = text.match(/(\[(.*?)\|(.*?)])/);
                if (parts === null || parts.length < 3) return text;
                parts.shift();
                if (parts.length === 3) {
                    let replacePart = parts.shift();

                    newText = newText.replace(replacePart, () => {
                        const link = parts.shift();
                        const linkName = parts.shift();

                        return `<a href="https://vk.com/${link}" target="_blank">${linkName}</a>`
                    });
                }

                return this.parseText.call(this, newText);
            },
            createImgLink({from_id}) {
                const isPublic = /^-/.test(from_id) ? 'public' : 'id';
                const id = isPublic === 'public' ? String(from_id).slice(1) : from_id;

                return `https://vk.com/${ isPublic }${ id }`;
            },
            arePhotoAttachments(attachs) {
                for (let attach of attachs) {
                    if (attach.type === 'photo') return true;
                }
                return false;
            },
            areAudioAttachments(attachs) {
                for (let attach of attachs) {
                    if (attach.type === 'audio') return true;
                }
                return false;
            },
            areVideoAttachments(attachs) {
                for (let attach of attachs) {
                    if (attach.type === 'video') return true;
                }
                return false;
            }

        },
        filters: {
            defineDate(date){
                let dateObj = new Date(1970, 0, 1, 3, 0, 0, 0);

                dateObj.setSeconds(dateObj.getSeconds() + date);
                dateObj = dateObj.toString().replace(/GMT.*$/gi, '');
                return dateObj;
            }
        },
        created() {
            this.postCopy = Object.assign({}, this.post);
            this.getPostHistoryInfo();
        }
    }
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

        .profile-attachments {
            margin-top: 20px;
            flex: 1 1 100%;
            display: flex;
            flex-wrap: wrap;
            >* {
                flex: 1 1 100%;
                margin-bottom: 10px;
            }


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
                    flex-basis: 70%;
                }
                &__date {
                    color: #939393;
                }
                .repost__text {
                    line-height: 1.3rem;
                    margin-top: 15px;
                    flex: 1 1 100%;
                }

                .repost-attachments {
                    margin-top: 20px;
                    flex: 1 1 100%;
                    .attachments-photo {
                        display: flex;
                        justify-content: space-evenly;
                        flex-wrap: wrap;
                        .attachments__item {
                            .img-container {
                                img {
                                    border-radius: 10px;
                                    /*max-width: 150px;*/
                                }
                            }
                        }
                    }
                }
            }
        }
        .attachments-video {
            .attachments__item {
                margin-bottom: 15px;
                .video-link {
                    .img-container {
                        position: relative;
                        /*width: 50%;*/
                        margin: 0 auto 15px;
                        border-radius: 15px;
                        img {
                            max-width: 100%;
                            width: 100%;
                            border-radius: 15px;
                        }
                        .video-overlay {
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: 100%;
                            background-color: #26384a;
                            opacity: 0.8;
                            border-radius: 15px;
                            &:hover {
                                opacity: 0.3;
                            }
                            img {
                                position: absolute;
                                width: 85px;
                                height: 85px;
                                top: 50%;
                                left: 50%;
                                transform: translateX(-50%) translateY(-50%);
                            }
                        }
                    }
                    .name {
                        color: #556b7c;
                        text-align: center;
                    }
                }
            }
        }
        .attachments-photo {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            .attachments__item {
                .img-container {
                    img {
                        /*max-width: 150px;*/
                        border-radius: 10px;
                        /*width: 100%;*/
                        /*max-height: 400px;*/
                        /*width: auto;*/
                        /*height: auto;*/
                    }
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


    .repost__text,
    .wall-post__text {
        a,
        a:active,
        a:visited,
        a:focus {
            color: #438aff;
        }
        a:hover {
            color: #438aff;
            text-decoration: underline #438aff;
        }
    }
</style>
