import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        files: [],
        flashCardInserted: false,
    },
    mutations: {
        SET_FILES(state, files) {
            state.files = files || [];
            for (let file of state.files) {
                file.passwordMatched = false;
                if (file.accessDniedUntil) {
                    file.accessDniedUntil = new Date(file.accessDniedUntil);
                    if (file.accessDniedUntil < new Date()) {
                        file.accessDniedUntil = null;
                        file.accessDnied = false;
                        file.tryCount = 0;
                    }
                }
            }
        },

        UPDATE_FILES(state) {
            for (let file of state.files) {
                if (file.accessDniedUntil && file.accessDniedUntil < new Date()) {
                    file.accessDniedUntil = null;
                    file.accessDnied = false;
                    file.tryCount = 0;
                }
            }
        },

        ADD_FILE(state, file) {
            state.files.push(file);
            localStorage.setItem("files", JSON.stringify(state.files));
        },

        EDIT_FILE(state, newFile) {
            const index = state.files.findIndex((file) => file.id === newFile.id);
            if (index != -1) {
                state.files.splice(index, 1, newFile);
                localStorage.setItem("files", JSON.stringify(state.files));
            }
        },

        DELETE_FILE(state, id) {
            state.files = state.files.filter((file) => file.id !== id);
            localStorage.setItem("files", JSON.stringify(state.files));
        },

        TOGGLE_FLASH_CARD(state) {
            state.flashCardInserted = !state.flashCardInserted;
        },
    },
    actions: {
        getAllFiles({ commit }) {
            commit("SET_FILES", JSON.parse(localStorage.getItem("files")));
        },

        addFile({ commit }, file) {
            commit("ADD_FILE", file);
        },

        editFile({ commit }, file) {
            commit("EDIT_FILE", file);
        },

        deleteFile({ commit }, id) {
            commit("DELETE_FILE", id);
        },

        toggleFlashCard({ commit }) {
            commit("TOGGLE_FLASH_CARD");
        },

        updateFiles({ commit }) {
            commit("UPDATE_FILES");
        },
    },
    getters: {
        files: (state) => state.files,
        flashCard: (state) => state.flashCardInserted,
        lastId: (state) => (state.files.length && state.files[state.files.length - 1].id + 1) || 1,
    },
});
