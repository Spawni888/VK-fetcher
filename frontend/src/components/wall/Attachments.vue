<template>
    <div class="attachments">
        <div
            v-if="input.attachments && attachsAreTypeOf(input.attachments, 'doc')"
            class="attachments-photo"
        >
            <div
                v-for="attachment in input.attachments"
                v-if="attachment.type === 'doc'"
                class="attachments__item"
            >
                <a
                    :href="`https://vk.com/wall${profile.id}_${postCopy.id}`"
                    target="_blank"
                >
                    <div class="img-container">
                        <img
                            :src="attachment.doc.url"
                            alt="photo"
                        >
                    </div>
                </a>
            </div>
        </div>
        <div
            v-if="input.attachments && attachsAreTypeOf(input.attachments, 'photo')"
            class="attachments-photo"
        >
            <div
                v-for="attachment in input.attachments"
                v-if="attachment.type === 'photo'"
                class="attachments__item"
            >
                <a
                    :href="`https://vk.com/photo${attachment.photo.owner_id}_${attachment.photo.id}`"
                    target="_blank"
                >
                    <div class="img-container">
                        <img
                            :src="attachment.photo.photo_604 || attachment.photo.photo_130"
                            alt="photo"
                        >
                    </div>
                </a>
            </div>
        </div>
        <div
            v-if="input.attachments && attachsAreTypeOf(input.attachments, 'video')"
            class="attachments-video"
        >
            <div
                v-for="attachment in input.attachments"
                v-if="attachment.type === 'video'"
                class="attachments__item"
            >
                <div class="preview">
                    <a
                        :href="`https://vk.com/video${attachment.video.owner_id}_${attachment.video.id}`"
                        target="_blank"
                    >
                        <div class="img-case">
                            <img
                                :src="attachment.video.photo_320 || attachment.video.photo_130"
                                alt="photo"
                            >
                        </div>
                        <div class="video-overlay">
                            <img
                                src="@/assets/img/play.png"
                                alt="play"
                            >
                        </div>
                    </a>
                </div>
                <div class="name">
                    {{ attachment.video.title }}
                </div>
            </div>
        </div>
        <div
            v-if="input.attachments && attachsAreTypeOf(input.attachments, 'audio')"
            class="attachments-audio"
        >
            <div
                v-for="attachment in input.attachments"
                v-if="attachment.type === 'audio'"
                class="attachments__item"
            >
                <div class="audio-link">
                    <a
                        :href="`https://vk.com/wall${profile.id}_${postCopy.id}`"
                        target="_blank"
                    >
                        <div class="img-container">
                            <img
                                src="@/assets/img/play.png"
                                alt="audio"
                            >
                        </div>
                    </a>
                    <div class="name">
                        {{ attachment.audio.artist }} - {{ attachment.audio.title }}
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="input.text"
            class="attachments__text"
            v-html="parseText(input.text)"
        />
    </div>
</template>

<script>
export default {
    name: 'Attachments',
    props: {
        input: {
            type: Object,
        },
        profileCopy: {
            type: Object,
        },
        postCopy: {
            type: Object,
        },
        profile: {
            type: Object,
        },
    },
    methods: {
        parseText(text) {
            if (!text) return;

            let newText = text;
            const parts = text.match(/(\[(.*?)\|(.*?)])/);
            if (parts === null || parts.length < 3) return text;
            parts.shift();
            if (parts.length === 3) {
                const replacePart = parts.shift();

                newText = newText.replace(replacePart, () => {
                    const link = parts.shift();
                    const linkName = parts.shift();

                    return `<a href="https://vk.com/${link}" target="_blank">${linkName}</a>`;
                });
            }

            return this.parseText.call(this, newText);
        },
        attachsAreTypeOf(attachs, type) {
            for (const attach of attachs) {
                if (attach.type === type) return true;
            }
            return false;
        },
    },
};
</script>

<style lang="scss">
    .attachments {
        margin-top: 20px;
        flex: 1 1 100%;
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;

        >* {
            flex: 1 1 100%;
            margin-bottom: 10px;
        }
        .attachments__text {
            color: #FFFFFF;
            line-height: 1.3rem;
            margin-top: 15px;
            flex: 1 1 100%;
            max-width: 100%;

            a,
            a:active,
            a:visited,
            a:focus {
                color: #438aff;
                text-decoration: none;
            }
            a:hover {
                color: #438aff;
                text-decoration: underline #438aff;
            }
        }
    }
    .attachments-video {
        .attachments__item {
            margin-bottom: 15px;
            .preview {
                position: relative;
                /*width: 50%;*/
                margin: 0 auto 15px;
                border-radius: 15px;
                a {
                    display: flex;
                    width: 100%;
                    .img-case {
                        width: 100%;
                        img {
                            max-width: 100%;
                            width: 100%;
                            border-radius: 15px;
                            height: 100%;
                        }
                    }
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
    .attachments-photo {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        margin-bottom: 10px;
        .attachments__item {
            margin-bottom: 10px;
            .img-container {
                img {
                    max-width: 100%;
                    border-radius: 10px;
                }
            }
        }
    }
    .attachments-audio {
        margin-bottom: 0;
        .attachments__item {
            margin-bottom: 10px;
            .audio-link {
                display: flex;
                align-items: center;
                .img-container {
                    margin-right: 10px;
                    background-color: #556b7c;
                    width: 25px;
                    height: 25px;
                    border-radius: 15px;
                    position: relative;
                    cursor: pointer;
                    &:hover {
                        background-color: #7791a2;
                    }
                    img {
                        position: absolute;
                        top: 50%;
                        left: 52%;
                        transform: translateY(-50%) translateX(-50%);
                        width: 14px;
                        height: 15.5px;
                    }
                }
                .name {
                    color: #e1e1e1;
                }
            }
        }
    }

</style>
