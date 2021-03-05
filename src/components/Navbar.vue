<template>
    <v-app-bar app>
        <a href="https://kurr.me" target="_blank" class="">
            <v-img class="mx-2" :src="logo" max-height="40" max-width="40" contain></v-img>
        </a>
        <v-btn text to="/ciphers" class="mx-4" color="deep-purple lighten-3" v-if="!$vuetify.breakpoint.smAndDown">
            Ciphers
        </v-btn>
        <v-btn text to="/chat" class="mx-4" color="deep-purple lighten-3" v-if="!$vuetify.breakpoint.smAndDown">
            Crypted Chat
        </v-btn>
        <v-btn text to="/access-control" class="mx-4" color="deep-purple lighten-3" v-if="!$vuetify.breakpoint.smAndDown">
            Access Control
        </v-btn>
        <v-spacer v-if="$vuetify.breakpoint.smAndDown"></v-spacer>
        <v-menu offset-y left v-if="$vuetify.breakpoint.smAndDown">
            <template v-slot:activator="{ on, attrs }">
                <v-app-bar-nav-icon v-bind="attrs" v-on="on"></v-app-bar-nav-icon>
            </template>
            <v-list nav dense>
                <v-list-item-group color="deep-purple lighten-3">
                    <v-list-item to="/ciphers">
                        <v-list-item-content>
                            <v-list-item-title>Ciphers</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item to="/chat">
                        <v-list-item-content>
                            <v-list-item-title>Crypted Chat</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item to="/access-control">
                        <v-list-item-content>
                            <v-list-item-title>Access Control</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script>
import logo from "../assets/app-icon.svg";

export default {
    name: "Navbar",

    data() {
        return {
            logo: logo,
        };
    },
};
</script>

<style></style>
