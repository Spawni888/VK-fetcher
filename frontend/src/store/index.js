import Vue from 'vue'
import Vuex from 'vuex'
import logger from "vuex/dist/logger";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        selectedProfiles: {}
    },
    getters: {
        selectedValuesArray(state) {
            return Object.values(state.selectedProfiles);
        },
        isSelected: state => ({id}) => {
            return (id in state.selectedProfiles);
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
        }
    },
    actions: {
    },
    modules: {
    }
})
