<template>
    <v-row class="mt-5">
        <!-- NAVIGATION -->
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

        <!-- FILES -->
        <v-col cols="12" md="6" lg="4" xl="3" sm="12" v-for="file in files" :key="file.id">
            <v-btn width="100%" height="100px" color="deep-purple" @click="checkFile(file.id)" :disabled="file.accessDnied || !flashCard">
                {{ file.name }}
            </v-btn>
            <v-alert color="red" dense type="error" v-if="file.accessDnied">
                <v-row align="center">
                    <v-col class="grow"> Access dnied until: {{ file.accessDniedUntil.toLocaleString() }} </v-col>
                </v-row>
            </v-alert>
        </v-col>

        <!-- INSERT NEW USB FLASH CARD -->
        <v-btn fab absolute class="btn-bl" dark color="green" @click="toggleFlashCardProxy">
            <v-icon>{{ usbIcon }}</v-icon>
        </v-btn>
        <v-snackbar v-model="snackbar" timeout="5000" top :color="snackbarError ? 'red' : 'default'">
            {{ snackbarText }}

            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>

        <!-- ADD NEW FILE -->
        <v-btn fab absolute class="btn-br" dark color="indigo" @click="dialogNewFile = true">
            <v-icon>{{ fileAdd }}</v-icon>
        </v-btn>
        <v-dialog v-model="dialogNewFile" width="500">
            <v-card>
                <v-card-title>
                    Add new file
                </v-card-title>
                <v-card-text>
                    <v-row class="mt-5">
                        <v-form v-model="newFileIsValid" @submit.prevent="addFileProxy" id="add-file" style="width: 100%" ref="form">
                            <v-col cols="12">
                                <v-text-field outlined label="File name" v-model="newFileName" :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea outlined name="input-7-4" label="File content" v-model="newFileContent"></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    outlined
                                    clearable
                                    label="Password"
                                    v-model="newFilePassword"
                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="[rules.required, rules.password]"
                                    :type="showPassword ? 'text' : 'password'"
                                    name="input-10-1"
                                    counter
                                    @click:append="showPassword = !showPassword"
                                ></v-text-field>
                            </v-col>
                        </v-form>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="dialogNewFile = false">
                        Close
                    </v-btn>
                    <v-btn color="green" text form="add-file" type="submit" :disabled="!newFileIsValid">
                        Add
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- FILE PASSWORD INPUT -->
        <v-bottom-sheet v-model="sheetInputPassword">
            <v-sheet class="text-center" height="400px">
                <v-btn class="mt-6 mx-4" text color="red" @click="sheetInputPassword = !sheetInputPassword">
                    close
                </v-btn>
                <v-btn class="mt-6 mx-4" text color="green" type="submit" form="password-input">
                    Submit
                </v-btn>
                <v-row class="pa-12">
                    <v-form @submit.prevent="passwordInputProxy" id="password-input" style="width: 100%">
                        <v-col lg="4" offset-lg="4" md="6" offset-md="3" sm="12" offset-sm="0">
                            <v-text-field
                                outlined
                                clearable
                                label="Password"
                                v-model="filePasswordInput"
                                :append-icon="showPasswordInput ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPasswordInput ? 'text' : 'password'"
                                name="input-10-1"
                                counter
                                @click:append="showPasswordInput = !showPasswordInput"
                            ></v-text-field>
                        </v-col>
                    </v-form>
                </v-row>
            </v-sheet>
        </v-bottom-sheet>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const bcrypt = require("bcryptjs");

import { mdiCog } from "@mdi/js";
import { mdiUsbFlashDrive } from "@mdi/js";
import { mdiFilePlus } from "@mdi/js";

export default {
    name: "AccessControl",

    data() {
        return {
            settingsIcon: mdiCog,
            usbIcon: mdiUsbFlashDrive,
            fileAdd: mdiFilePlus,

            dialogNewFile: false,
            newFileName: "",
            newFileContent: "",
            newFilePassword: "",
            newFileIsValid: false,
            showPassword: false,
            rules: {
                required: (value) => !!value || "Required",
                password: (value) =>
                    (value && !!value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,9999}$/)) ||
                    "Password must contain at least 8 characters, one lowercase letter, one uppercase letter, one digit and one special character",
            },

            sheetInputPassword: false,
            filePasswordInputId: null,
            showPasswordInput: false,
            filePasswordInput: "",

            flashCardInserted: false,

            snackbar: false,
            snackbarText: "",
            snackbarError: false,

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
                    disabled: true,
                },
            ],
        };
    },

    computed: {
        ...mapGetters(["files", "lastId", "flashCard"]),
    },

    methods: {
        getFileById(id) {
            const index = this.files.findIndex((file) => file.id === id);
            return this.files[index];
        },

        addFileProxy() {
            const passwordHash = bcrypt.hashSync(this.newFilePassword, 10);
            this.addFile({
                id: this.lastId,
                name: this.newFileName,
                content: this.newFileContent,
                password: passwordHash,
                passwordMatched: false,
                tryCount: 0,
                accessDnied: false,
                accessDniedUntil: null,
            });
            this.newFileName = "";
            this.newFileContent = "";
            this.newFilePassword = "";
            this.showPassword = false;
            this.dialogNewFile = false;
            this.$refs.form.reset();
        },

        checkFile(fileId) {
            const file = this.getFileById(fileId);
            if (file && !file.passwordMatched) {
                this.filePasswordInputId = fileId;
                this.sheetInputPassword = true;
            } else {
                this.$router.push({
                    name: "access-control-file",
                    params: {
                        file: fileId,
                    },
                });
            }
        },

        passwordInputProxy() {
            const file = this.getFileById(this.filePasswordInputId);
            if (file) {
                file.tryCount++;
                const compareResult = bcrypt.compareSync(this.filePasswordInput, file.password);
                if (compareResult) {
                    file.passwordMatched = true;
                    file.tryCount = 0;

                    this.sheetInputPassword = false;
                    this.showPasswordInput = false;
                    this.filePasswordInputId = null;
                    this.filePasswordInput = "";

                    this.$router.push({
                        name: "access-control-file",
                        params: {
                            file: file.id,
                        },
                    });
                } else {
                    this.snackbar = true;
                    this.snackbarError = true;
                    this.snackbarText = "Password isn't correct";
                }
                if (!file.passwordMatched && file.tryCount == 3) {
                    file.accessDnied = true;
                    file.accessDniedUntil = new Date(new Date().getTime() + 2 * 60 * 60000);

                    this.snackbarError = true;
                    this.snackbar = true;
                    this.snackbarText = `To many attempts, access dnied until: ${file.accessDniedUntil.toLocaleString()}`;

                    this.sheetInputPassword = false;
                    this.showPasswordInput = false;
                    this.filePasswordInputId = null;
                    this.filePasswordInput = "";
                }
                this.editFile(file);
            }
        },

        toggleFlashCardProxy() {
            this.toggleFlashCard();
            this.snackbarError = false;
            this.snackbar = true;
            this.snackbarText = this.flashCard ? "Flash Card Inserted" : "Flash Card Removed";
        },

        ...mapActions(["addFile", "editFile", "toggleFlashCard"]),
    },
};
</script>

<style>
.btn-bl {
    bottom: 30px;
    left: 30px;
}
.btn-br {
    bottom: 30px;
    right: 30px;
}
</style>
