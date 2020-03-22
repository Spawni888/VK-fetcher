<template>
    <div class="friends-list">
        <div v-for="friend in friends" class="friend">
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
            <div class="friend__friends">
                Friends count:
                {{ friend.friends.count }}
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: "FriendsList",
        computed: {
            ...mapGetters([
                'friends'
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
    .friends-list {
        max-width: 800px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
</style>
