<template>
    <v-row class="mt-5">
        <v-col cols="12">
            <v-card>
                <v-breadcrumbs divider="/" large :items="directory">
                    <template v-slot:item="{ item }">
                        <v-breadcrumbs-item :to="item.to" :disabled="item.disabled" active-class="" exact-active-class="">
                            {{ item.text }}
                        </v-breadcrumbs-item>
                    </template>
                </v-breadcrumbs>
            </v-card>
        </v-col>
        <v-col
            cols="12"
            offset="0"
            xl="6"
            offset-xl="3"
            lg="6"
            offset-lg="3"
            md="6"
            offset-md="3"
            sm="12"
            offset-sm="0"
            v-if="currentFile.passwordMatched"
        >
            <v-card>
                <v-card-title>
                    {{ currentFile.name }}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    {{ currentFile.content }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="deep-purple lighten-3">
                        Edit file
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="12" offset="0" xl="6" offset-xl="3" lg="6" offset-lg="3" md="6" offset-md="3" sm="12" offset-sm="0" v-else>
            <v-alert prominent type="error">
                <v-row align="center">
                    <v-col class="grow">
                        You don't have permissions
                    </v-col>
                </v-row>
            </v-alert>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "AccessControlFile",

    data() {
        return {
            directory: [
                {
                    text: "C",
                    disabled: true,
                },
                {
                    text: "Users",
                    disabled: true,
                },
                {
                    text: "kurr",
                    disabled: true,
                },
                {
                    text: "Desktop",
                    disabled: false,
                    to: "/access-control",
                },
            ],
        };
    },

    computed: {
        ...mapGetters(["files", "lastId"]),

        currentFile() {
            for (let file of this.files) {
                if (file.id == this.$route.params.file) return file;
            }
            return null;
        },
    },

    created() {
        this.directory.push({
            text: this.currentFile.name,
            disabled: true,
        });
    },

    methods: {
        ...mapActions(["editFile", "deleteFile"]),
    },
};
</script>

<style></style>
