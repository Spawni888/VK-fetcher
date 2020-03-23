import Vue from 'vue'
import Vuex from 'vuex'
import logger from "vuex/dist/logger";
import axios from 'axios';
import querystring from 'qs';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        selectedProfiles: {},
        friendsMap: {},
        _friends: []
    },
    getters: {
        selectedValuesArray(state) {
            return Object.values(state.selectedProfiles);
        },
        isSelected: state => ({ id }) => {
            return (id in state.selectedProfiles);
        },
        profilesFriends(state) {
            return [...state._friends];
        },
        getMutualFriends: state => (id) => {
            return state.friendsMap[id];
        }
    },
    mutations: {
        select(state, profile) {
            const tempObj = Object.assign({}, state.selectedProfiles);
            tempObj[profile.id] = profile;
            state.selectedProfiles = tempObj;
        },
        unselect(state, { id }) {
            const tempObj = Object.assign({}, state.selectedProfiles);
            delete tempObj[id];
            state.selectedProfiles = tempObj;
        },
        createFriendsMap(state, profile) {
            const profileFriends = profile.friends.items;

            profileFriends.forEach(friend => {
                if (!state.friendsMap[friend.id]) {
                    state.friendsMap[friend.id] = [ profile ];
                }
                else {
                    state.friendsMap[friend.id].push(profile);
                }
            });

        },
        createFriendsList(state) {
            let friendsList = [];

            for (let id in state.selectedProfiles) {
                let profile = state.selectedProfiles[id];

                friendsList = friendsList.concat(profile.friends.items);
            }
            friendsList = Array.from(new Set(friendsList));

            // prevent friends duplication
            const friendsTempHash = {};

            friendsList.forEach(friend => {
                if (friendsTempHash[friend.id]) {
                    friendsTempHash[friend.id]++;
                }
                else {
                    friendsTempHash[friend.id] = 1;
                }
            });
            friendsList = friendsList.filter(friend => {
                if (!--friendsTempHash[friend.id] ) {
                    if (!friend.deactivated) {
                        return true;
                    }
                }
                return false;
            });
            state._friends = friendsList.sort((a, b) => a.first_name.localeCompare(b.first_name));
        }
    },
    actions: {
        async getFriendsCount({ state, commit }, { start, end }) {
            for (let i = start; i < end; i++) {
                if (!state._friends[i] || state._friends[i].friendsCount) continue;

                await axios.get(`/profiles/${state._friends[i].id}`)
                    .then(res => {
                        const updatedFriends = [...state._friends];
                        updatedFriends[i].friendsCount = res.data.friends.count;
                        state._friends = updatedFriends;
                    })
                    .catch()
            }
        }
    },
    modules: {
    }
})
