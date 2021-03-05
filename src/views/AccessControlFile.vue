<template>
    <v-row class="mt-5">
        <!-- BREADCRUMB -->
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

        <!-- FILE -->
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
                    {{ fileContent }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="deep-purple lighten-3" @click="dialog = true">
                        Edit file
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>

        <!-- DONT HAVE PREMISSION ALERT -->
        <v-col cols="12" offset="0" xl="6" offset-xl="3" lg="6" offset-lg="3" md="6" offset-md="3" sm="12" offset-sm="0" v-else>
            <v-alert prominent type="error">
                <v-row align="center">
                    <v-col class="grow">
                        You don't have permissions
                    </v-col>
                </v-row>
            </v-alert>
        </v-col>

        <!-- EDIT FILE DIALOG -->
        <v-dialog v-model="dialog" width="500">
            <v-card>
                <v-card-title>
                    Edit file
                </v-card-title>
                <v-card-text>
                    <v-row class="mt-5">
                        <v-form v-model="fileIsValid" @submit.prevent="editFileProxy" id="edit-file" style="width: 100%" ref="form">
                            <v-col cols="12">
                                <v-text-field outlined label="File name" v-model="currentFile.name" :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea outlined name="input-7-4" label="File content" v-model="fileContent"></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    outlined
                                    clearable
                                    label="Current Password"
                                    v-model="oldFilePassword"
                                    :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="[rules.required]"
                                    :type="showOldPassword ? 'text' : 'password'"
                                    name="input-10-1"
                                    counter
                                    @click:append="showOldPassword = !showOldPassword"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    outlined
                                    clearable
                                    label="New Password"
                                    v-model="newFilePassword"
                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="[rules.password]"
                                    :type="showPassword ? 'text' : 'password'"
                                    name="input-10-1"
                                    counter
                                    hint="Leave empty if you dont want to change"
                                    @click:append="showPassword = !showPassword"
                                ></v-text-field>
                            </v-col>
                        </v-form>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="default" text @click="dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="red" text @click="sheetDelete = true">
                        Delete
                    </v-btn>
                    <v-btn color="green" text type="submit" form="edit-file" :disabled="!fileIsValid">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- DELETE CONFIRMATION -->
        <v-bottom-sheet v-model="sheetDelete">
            <v-sheet class="text-center" height="200px">
                <v-btn class="my-6 mx-4" text color="default" @click="sheetDelete = !sheetDelete">
                    Cancel
                </v-btn>
                <v-btn class="my-6 mx-4" text color="red" @click="deleteFileProxy">
                    Yes
                </v-btn>
                <v-alert dense text type="warning" class="mx-12">
                    <strong>Do you want to delete this file?</strong>
                </v-alert>
            </v-sheet>
        </v-bottom-sheet>

        <!-- SNACKBAR -->
        <v-snackbar v-model="snackbar" timeout="5000" top :color="snackbarError ? 'red' : 'green'">
            {{ snackbarText }}
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const bcrypt = require("bcryptjs");
import RSA from "node-rsa";
import { publicKey, privateKey } from "../plugins/accessControlKeys.js";

export default {
    name: "AccessControlFile",

    data() {
        return {
            dialog: false,
            sheetDelete: false,

            snackbar: false,
            snackbarText: "",
            snackbarError: false,

            fileContent: "",
            newFilePassword: "",
            oldFilePassword: "",
            showPassword: false,
            showOldPassword: false,

            fileIsValid: false,
            rules: {
                required: (value) => !!value || "Required",
                password: (value) =>
                    !value ||
                    (value && !!value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,9999}$/)) ||
                    "Password must contain at least 8 characters, one lowercase letter, one uppercase letter, one digit and one special character",
            },
        };
    },

    created() {
        let key = RSA();
        key.setOptions({ encryptionScheme: "pkcs1" });
        key.importKey(privateKey, "pkcs1-private");
        this.fileContent = key.decrypt(this.currentFile.content, "utf8");
    },

    computed: {
        ...mapGetters(["files", "lastId"]),

        directory() {
            return [
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
                {
                    text: this.currentFile.name,
                    disabled: true,
                },
            ];
        },

        currentFile() {
            for (let file of this.files) {
                if (file.id == this.$route.params.file) {
                    return file;
                }
            }
            return null;
        },
    },

    methods: {
        ...mapActions(["editFile", "deleteFile"]),

        editFileProxy() {
            const compareResult = bcrypt.compareSync(this.oldFilePassword, this.currentFile.password);
            if (compareResult) {
                if (this.newFilePassword != "") {
                    const passwordHash = bcrypt.hashSync(this.newFilePassword, 10);
                    this.currentFile.password = passwordHash;
                }
                let key = RSA();
                key.setOptions({ encryptionScheme: "pkcs1" });
                key.importKey(publicKey, "pkcs1-public");
                let content = key.encrypt(this.fileContent, "base64");
                this.currentFile.content = content;
                this.editFile(this.currentFile);

                this.snackbar = true;
                this.snackbarText = "File edited successfully";
                this.snackbarError = false;

                this.dialog = false;
                this.newFilePassword = "";
                this.oldFilePassword = "";
                this.showPassword = false;
                this.showOldPassword = false;
            } else {
                this.snackbar = true;
                this.snackbarText = "Passwords doesn't match";
                this.snackbarError = true;
            }
        },

        deleteFileProxy() {
            this.deleteFile(this.currentFile.id);
            this.sheetDelete = false;
            this.$router.push({
                name: "access-control",
            });
        },
    },
};
</script>

<style></style>
