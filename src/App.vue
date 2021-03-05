<template>
    <v-app>
        <Navbar />
        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { mapActions } from "vuex";
import Navbar from "./components/Navbar.vue";

export default {
    name: "App",

    components: {
        Navbar,
    },

    data() {
        return {};
    },

    created() {
        this.getAllFiles();
        setInterval(() => {
            this.updateFiles();
        }, 1000 * 10);
    },

    methods: {
        ...mapActions(["getAllFiles", "updateFiles"]),
    },
};
</script>

<style>
::-webkit-scrollbar {
    display: none;
}
</style>
