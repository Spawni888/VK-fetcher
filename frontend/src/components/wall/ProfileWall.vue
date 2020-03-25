<template>
    <div class="wall" v-if="wall.items">
        <transition-group name="fade-in" mode="out-in">
            <wall-post
                    v-for="post in wall.items"
                    class="wall__post"
                    :post="post"
                    :profile="profile"
                    :key="post.id">
            </wall-post>
        </transition-group>
    </div>
</template>

<script>
    import WallPost from "@/components/wall/WallPost";

    export default {
        name: "ProfileWall",
        props: {
            wall: {
                type: Object
            },
            profile: {
                type: Object
            }
        },
        components: {
            WallPost
        }
    }
</script>

<style lang="scss" scoped>
    .wall {
        max-width: 600px;
        width: 100%;
        margin: 20px auto 40px;
        &__post {
            margin-bottom: 40px;
        }
    }
</style>
