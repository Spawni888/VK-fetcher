<template>
    <div
        v-if="wall.items"
        class="wall"
    >
        <transition-group
            name="fade-in"
            mode="out-in"
        >
            <wall-post
                v-for="post in wall.items"
                :key="post.id"
                class="wall__post"
                :post="post"
                :profile="profile"
            />
        </transition-group>
    </div>
</template>

<script>
import WallPost from '@/components/wall/WallPost';

export default {
    name: 'ProfileWall',
    components: {
        WallPost,
    },
    props: {
        wall: {
            type: Object,
        },
        profile: {
            type: Object,
        },
    },
};
</script>

<style lang="scss" scoped>
    @import "@/assets/scss/main";

    .wall {
        max-width: 600px;
        width: 100%;
        margin: 20px auto 40px;
        @media (max-width: $smDesktopWidth) {
           max-width: 570px;
        }
        @media (max-width: $tableWidth) {
            max-width: 400px;
        }

        &__post {
            margin-bottom: 40px;
        }
    }
</style>
