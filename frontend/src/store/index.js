import Vue from 'vue'
import Vuex from 'vuex'
import logger from "vuex/dist/logger";
import axios from 'axios';
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
        friends(state) {
            return state._friends;
        },
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
        parseFriends(state, profile) {
            if (!profile.friends.length) return;
            if (!state.friendsMap[profile.id]) {
                state.friendsMap[profile.id] = [];
            }

            profile.friends.forEach(friend => {
                state.friendsMap[profile.id].push(friend);
            });
            state._friends = state._friends.concat(profile.friends);
            console.log(state._friends);
        },
        sortFriends(state) {
            console.log(state._friends);
            state._friends = state._friends.sort((a, b) => a.first_name.localeCompare(b.first_name));
        }
    },
    actions: {
        async fetchFriendsFriends({state, commit}, profile) {
            const updatedProfileFriends = [];
            const updatedProfile = Object.assign({}, profile);
            //TODO: create in back route to fetch friends-friends (USER.gets a lot of ids)

            // for (let friend of profile.friends.items) {
            //     await axios.get(`/profiles/${ friend.id }`)
            //         .then(res => {
            //             updatedProfileFriends.push(res.data);
            //         })
            //         .catch(err => console.log(err.response.data));
            // }
            // updatedProfile.friends = updatedProfileFriends;

            commit('parseFriends', updatedProfile);
        }
    },
    modules: {
    }
})
