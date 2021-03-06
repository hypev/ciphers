<template>
    <v-row style="height: calc(100vh - 210px)">
        <v-snackbar top v-model="snackbar" timeout="10000">
            Hover to text to see hashed text
            <template v-slot:action="{ attrs }">
                <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        <v-btn v-if="!connected" color="deep-purple" class="mt-6 mx-auto" @click="connect">Connect to chat</v-btn>
        <v-col cols="12" style="height: 100%" v-if="connected">
            <v-card elevation="12" rounded="lg" style="height: 100%; overflow-y: auto" class="scroll-custom">
                <v-card-title>Chat with Bob</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="px-lg-16 px-md-12 px-sm-8">
                    <v-row class="d-flex flex-column">
                        <v-col
                            class="d-flex"
                            :class="{ 'justify-start': msg.sender == 'Bob', 'justify-end': msg.sender == 'Alice' }"
                            v-for="msg in messages"
                            :key="msg.id"
                        >
                            <v-card
                                class="d-flex align-center justify-center pa-4"
                                :class="{ 'flex-row pr-8': msg.sender == 'Bob', 'flex-row-reverse pl-8': msg.sender == 'Alice' }"
                                elevation="4"
                                rounded="lg"
                            >
                                <v-avatar color="deep-purple" class="align-self-start" size="32" rounded="circle">{{
                                    msg.sender == "Bob" ? "Bb" : "Al"
                                }}</v-avatar>
                                <span class="font-weight-bold" :class="{ 'ml-6': msg.sender == 'Bob', 'mr-6': msg.sender == 'Alice' }">
                                    <v-tooltip :right="msg.sender == 'Bob'" :left="msg.sender == 'Alice'">
                                        <template v-slot:activator="{ on, attrs }">
                                            <span v-bind="attrs" v-on="on">{{ decryptText(msg.message) }}</span>
                                        </template>
                                        <span>{{ shortenMessage(msg.message) }}</span>
                                    </v-tooltip>
                                </span>
                            </v-card>
                        </v-col>
                        <v-col class="d-flex justify-start" v-if="loader">
                            <v-card class="d-flex align-center justify-center pa-4 flex-row pr-8" elevation="4" rounded="lg">
                                <v-skeleton-loader class="mx-auto" type="avatar" loading></v-skeleton-loader>
                                <v-skeleton-loader class="mx-auto ml-6" max-width="300" min-width="150" type="text" loading></v-skeleton-loader>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <div class="fixed-type" v-if="connected">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-card max-width="100%" class="pa-6 pb-0" elevation="12" rounded="lg">
                            <v-text-field
                                v-model="message"
                                append-outer-icon="mdi-send"
                                outlined
                                clear-icon="mdi-close-circle"
                                clearable
                                label="Message"
                                type="text"
                                @click:append-outer="sendMessage"
                                @click:clear="clearMessage"
                                @keyup.enter="sendMessage"
                                rounded
                            ></v-text-field>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <v-btn fab fixed class="btn-br r" dark color="deep-purple" v-if="connected" @click="dialogSettings = true">
            <v-icon>mdi-settings</v-icon>
        </v-btn>
        <v-dialog v-model="dialogSettings" width="500" v-if="connected">
            <v-card>
                <v-card-title>
                    Settings
                </v-card-title>
                <v-card-text>
                    <v-row class="mt-5">
                        <v-col cols="12" class="d-flex align-stretch">
                            <v-text-field
                                v-model="keys.alice.base64publicKey"
                                outlined
                                name="alicePublic"
                                label="Alice base64 public key"
                                type="text"
                                readonly
                            ></v-text-field>
                            <v-btn height="56" class="ml-4" @click="copyToClipboard('alicePublic')">
                                <v-icon text>mdi-content-copy</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="12" class="d-flex align-stretch">
                            <v-text-field
                                v-model="keys.bob.base64publicKey"
                                outlined
                                name="bobPublic"
                                label="Bob base64 public key"
                                type="text"
                                readonly
                            ></v-text-field>
                            <v-btn height="56" class="ml-4" @click="copyToClipboard('bobPublic')">
                                <v-icon text>mdi-content-copy</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="12" class="d-flex align-stretch">
                            <v-text-field
                                v-model="keys.base64sharedSecret"
                                name="sharedSecret"
                                outlined
                                label="Shared base64 key"
                                type="text"
                                readonly
                            ></v-text-field>
                            <v-btn height="56" class="ml-4" @click="copyToClipboard('sharedSecret')">
                                <v-icon text>mdi-content-copy</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="dialogSettings = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar top v-model="snackbarCopy" timeout="3000">
            Key is copied successfully!

            <template v-slot:action="{ attrs }">
                <v-btn color="red" text v-bind="attrs" @click="snackbarCopy = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-row>
</template>

<script>
import DH from "crypto";
import aesjs from "aes-js";
import axios from "axios";

export default {
    name: "CryptedChat",

    data() {
        return {
            randomMessageOptions: {
                method: "GET",
                url: "https://geek-jokes.p.rapidapi.com/api",
                params: { format: "json" },
                headers: {
                    "x-rapidapi-key": "0ca14f5232msh212b3fba416667bp12bd97jsn5f3017154a17",
                    "x-rapidapi-host": "geek-jokes.p.rapidapi.com",
                },
            },

            message: "",
            messages: [],
            loader: false,
            snackbar: false,
            snackbarCopy: false,
            connected: false,
            dialogSettings: false,

            server: null,
            prime: null,

            keys: {
                sharedSecret: null,
                base64sharedSecret: "",
                alice: {
                    obj: null,
                    publicKey: null,
                    bobSecret: null,
                    base64publicKey: "",
                    base64bobSecrete: "",
                },
                bob: {
                    obj: null,
                    publicKey: null,
                    aliceSecret: null,
                    base64publicKey: "",
                    base64aliceSecrete: "",
                },
            },
        };
    },

    watch: {
        messages() {
            if (this.connected && this.messages.length == 1) {
                this.snackbar = true;
            }
        },
    },

    mounted() {
        document.querySelector(".container").classList.add("chat");
    },

    methods: {
        connect() {
            this.server = DH.createDiffieHellman(128);
            this.prime = this.server.getPrime();

            this.keys.alice.obj = DH.createDiffieHellman(this.prime);
            this.keys.alice.obj.generateKeys();
            this.keys.alice.publicKey = this.keys.alice.obj.getPublicKey();
            this.keys.alice.base64publicKey = Buffer.from(this.keys.alice.publicKey).toString("base64");

            this.keys.bob.obj = DH.createDiffieHellman(this.prime);
            this.keys.bob.obj.generateKeys();
            this.keys.bob.publicKey = this.keys.bob.obj.getPublicKey();
            this.keys.bob.base64publicKey = Buffer.from(this.keys.bob.publicKey).toString("base64");

            this.keys.bob.aliceSecret = this.keys.bob.obj.computeSecret(this.keys.alice.publicKey);
            this.keys.bob.base64aliceSecrete = Buffer.from(this.keys.bob.aliceSecret).toString("base64");

            this.keys.alice.bobSecret = this.keys.alice.obj.computeSecret(this.keys.bob.publicKey);
            this.keys.alice.base64bobSecrete = Buffer.from(this.keys.alice.bobSecret).toString("base64");

            this.keys.sharedSecret = this.keys.alice.obj.computeSecret(this.keys.bob.publicKey);
            this.keys.base64sharedSecret = Buffer.from(this.keys.sharedSecret).toString("base64");

            console.log(`The whole object:`);
            console.log(this.keys);

            this.connected = true;
        },

        encryptText(text) {
            let textBytes = aesjs.utils.utf8.toBytes(text);
            let aesCtr = new aesjs.ModeOfOperation.ctr(this.keys.sharedSecret);
            let encryptedBytes = aesCtr.encrypt(textBytes);
            let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
            return encryptedHex;
        },

        decryptText(hex) {
            let encryptedBytes = aesjs.utils.hex.toBytes(hex);
            let aesCtr = new aesjs.ModeOfOperation.ctr(this.keys.sharedSecret);
            let decryptedBytes = aesCtr.decrypt(encryptedBytes);
            let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
            return decryptedText;
        },

        shortenMessage(msg) {
            return msg.length > 10 ? msg.slice(0, 10) + "…" : msg;
        },

        copyToClipboard(name) {
            let input = document.querySelector(`[name=${name}]`);
            input.select();
            document.execCommand("copy");
            this.snackbarCopy = true;
        },

        sendMessage() {
            if (this.message) {
                this.addMessage("Alice", "Bob", this.encryptText(this.message));
                this.clearMessage();
                this.loader = true;
                this.scrollToBottom();
                this.getMessage();
            }
        },

        getMessage() {
            axios
                .request(this.randomMessageOptions)
                .then((response) => {
                    this.addMessage("Bob", "Alice", this.encryptText(response.data.joke));
                })
                .catch(function(error) {
                    console.error(error);
                })
                .finally(() => {
                    this.loader = false;
                });
            this.scrollToBottom();
        },

        addMessage(from, to, message) {
            this.messages.push({
                id: (this.messages[this.messages.length - 1] && this.messages[this.messages.length - 1].id + 1) || 1,
                sender: from,
                receiver: to,
                message,
            });
        },

        clearMessage() {
            this.message = "";
        },

        scrollToBottom() {
            let chat = document.querySelector(".scroll-custom");
            chat.scrollTo({
                top: chat.scrollHeight,
                left: 0,
                behavior: "smooth",
            });
        },
    },
};
</script>

<style>
.fixed-type {
    width: 100%;
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
}
.container.chat {
    min-height: 100%;
    padding-bottom: 150px;
}
.btn-br.r {
    top: 80px;
    right: 10px;
}
</style>
