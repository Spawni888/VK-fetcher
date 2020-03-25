import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        selectedProfiles: {},
        friendsMap: {},
        _friends: [],
    },
    getters: {
        selectedProfilesObj(state) {
            return { ...state.selectedProfiles };
        },
        selectedValuesArray(state) {
            return Object.values(state.selectedProfiles);
        },
        isSelected: (state) => ({ id }) => (id in state.selectedProfiles),
        profilesFriends(state) {
            return [...state._friends];
        },
        getMutualFriends: (state) => (id) => state.friendsMap[id],
    },
    mutations: {
        select(state, profile) {
            const tempObj = { ...state.selectedProfiles };
            tempObj[profile.id] = profile;
            state.selectedProfiles = tempObj;
        },
        unselect(state, { id }) {
            const tempObj = { ...state.selectedProfiles };
            delete tempObj[id];
            state.selectedProfiles = tempObj;
        },
        createFriendsMap(state, profile) {
            const profileFriends = profile.friends.items;

            profileFriends.forEach((friend) => {
                if (!state.friendsMap[friend.id]) {
                    state.friendsMap[friend.id] = [profile];
                } else {
                    state.friendsMap[friend.id].push(profile);
                }
            });
        },
        clearFriendsMap(state, profile) {
            const profileFriends = profile.friends.items;
            const updatedFriendsMap = { ...state.friendsMap };

            profileFriends.forEach((friend) => {
                updatedFriendsMap[friend.id] = updatedFriendsMap[friend.id]
                    .filter((_profile) => _profile.id !== profile.id);
            });
            state.friendsMap = updatedFriendsMap;
        },
        createFriendsList(state) {
            let friendsList = [];

            Object.values(state.selectedProfiles).forEach((profile) => {
                friendsList = friendsList.concat(profile.friends.items);
            });
            friendsList = Array.from(new Set(friendsList));

            // prevent friends duplication
            const friendsTempHash = {};

            friendsList.forEach((friend) => {
                if (friendsTempHash[friend.id]) {
                    friendsTempHash[friend.id]++;
                } else {
                    friendsTempHash[friend.id] = 1;
                }
            });
            friendsList = friendsList.filter((friend) => {
                if (!--friendsTempHash[friend.id]) {
                    if (!friend.deactivated) {
                        return true;
                    }
                }
                return false;
            });
            state._friends = friendsList.sort((a, b) => a.first_name.localeCompare(b.first_name));
        },
    },
    actions: {
        async getFriendsCount({ state }, { start, end }) {
            for (let i = start; i < end; i++) {
                if (!state._friends[i] || state._friends[i].friendsCount) continue;

                await axios.get(`/profiles/friends/${state._friends[i].id}`)
                    .then((res) => {
                        const updatedFriends = [...state._friends];
                        updatedFriends[i].friendsCount = res.data.count;
                        state._friends = updatedFriends;
                    })
                    .catch();
            }
        },
    },
    modules: {
    },
});
