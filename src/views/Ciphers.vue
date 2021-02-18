<template>
  <v-row class="mt-5">
    <!-- PLAIN TEXT INPUT -->
    <v-col
      cols="12"
      lg="4"
      order-lg="0"
      md="6"
      order-md="1"
      sm="12"
      order-sm="0"
    >
      <v-card elevation="2" class="pb-3">
        <v-card-title>{{ firstTitle }}</v-card-title>
        <v-textarea
          outlined
          name="input-7-4"
          label="Text"
          class="ma-3"
          v-model="firstText"
        ></v-textarea>
      </v-card>
    </v-col>

    <!-- SETTINGS -->
    <v-col
      cols="12"
      lg="4"
      order-lg="1"
      md="12"
      order-md="0"
      sm="12"
      order-sm="1"
    >
      <v-card elevation="2" class="pb-3">
        <v-card-title>Settings</v-card-title>

        <!-- ENCODE / DECODE BTN -->
        <div class="d-flex align-center justify-center">
          <v-btn
            text
            color="deep-purple lighten-3"
            :class="{ 'v-btn--active': encode }"
            @click="encode = true"
            v-if="algo != 'Blowfish'"
          >
            Encode
          </v-btn>
          <v-btn
            text
            color="deep-purple lighten-3"
            :class="{ 'v-btn--active': !encode }"
            @click="encode = false"
            v-if="algo != 'Blowfish'"
          >
            Decode
          </v-btn>
          <BlowfishAnimation
            :style="displayBF"
            :disabled="!allowAnimate"
            :plain-text="firstText"
            :cipher-text="secondText"
          />
          <RSAAnimation
            :style="displayRSA"
            :disabled="!allowAnimateRSA"
            :plain-text="firstText"
            :cipher-text="secondText"
          />
        </div>

        <!-- ALGORITHM SELECT -->
        <v-select
          :items="algos"
          label="Alogrithm"
          solo
          class="mt-8 mx-3"
          v-model="algo"
        ></v-select>

        <!-- CEASER -->
        <div class="mt-2 mx-3" v-if="algo == 'Ceaser'">
          <v-subheader class="pl-0">
            Offset
          </v-subheader>
          <v-slider
            v-model="offset"
            thumb-label="always"
            min="0"
            max="25"
          ></v-slider>
        </div>

        <!-- VIGENER/PLAYFAIR/TRANSPOSITION KEY INPUT -->
        <div
          class="mt-2 mx-4"
          v-if="
            algo == 'Vigener' ||
              algo == 'Playfair' ||
              algo == 'Transposition' ||
              algo == 'Blowfish'
          "
        >
          <v-text-field label="Key" v-model="key"></v-text-field>

          <!-- PLAYFAIR MATRIX -->
          <div
            v-if="key && algo == 'Playfair'"
            class="mt-2 d-flex flex-column align-center justify-center"
          >
            <v-card-title>Matrix</v-card-title>
            <div
              v-for="(subarray, index) in playfairMatrix"
              :key="index"
              class="d-flex my-1"
            >
              <div
                v-for="(letter, index) in subarray"
                :key="index"
                class=" v-card v-sheet theme--dark elevation-2 font-weight-bold d-flex align-center justify-center mx-1"
                style="width: 2rem; height: 2rem"
              >
                {{ letter }}
              </div>
            </div>
          </div>
        </div>

        <!-- TRANSPOSITION PAD CHARACTER INPUT -->
        <div class="mt-2 mx-4" v-if="algo == 'Transposition'">
          <v-text-field label="Pad Character" v-model="pad"></v-text-field>
        </div>

        <!-- RSA KEY SETTINGS -->
        <v-card-title v-if="algo == 'RSA'">Key</v-card-title>

        <!-- INPUT KEY -->
        <div class="d-flex align-center justify-center" v-if="algo == 'RSA'">
          <v-textarea
            outlined
            name="input-7-4"
            label="Public key"
            class="ma-3"
            v-model="publicKey"
          ></v-textarea>
          <v-textarea
            outlined
            name="input-7-4"
            label="Private key"
            class="ma-3"
            v-model="privateKey"
          ></v-textarea>
        </div>

        <v-card-title v-if="algo == 'RSA'">Key length</v-card-title>

        <v-select
          :items="keySizes"
          label="Key Size"
          solo
          class="mx-3"
          v-model="keySize"
          v-if="algo == 'RSA'"
        ></v-select>

        <!-- ENCODE / DECODE BTN -->
        <div class="d-flex align-center justify-center" v-if="algo == 'RSA'">
          <v-btn text color="deep-purple lighten-3" @click="generateKey">
            Generate
          </v-btn>
        </div>
      </v-card>
    </v-col>

    <v-col
      cols="12"
      lg="4"
      order-lg="2"
      md="6"
      order-md="2"
      sm="12"
      order-sm="2"
    >
      <v-card elevation="2" class="pb-3">
        <v-card-title>{{ secondTitle }}</v-card-title>
        <v-textarea
          solo
          name="input-7-4"
          class="ma-3"
          :value="secondText"
          disabled
        ></v-textarea>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Ceaser from "../plugins/Ciphers/ceaser.js";
import Vigenere from "../plugins/Ciphers/vigenere.js";
import Playfair from "../plugins/Ciphers/playfair.js";
import Transposition from "../plugins/Ciphers/transposition.js";
import { Blowfish } from "javascript-blowfish";
import RSA from "node-rsa";
import BlowfishAnimation from "../components/BlowfishAnimation.vue";
import RSAAnimation from "../components/RSAAnimation.vue";

export default {
  name: "Cipher",

  components: {
    BlowfishAnimation,
    RSAAnimation
  },

  data() {
    return {
      encode: true,
      firstText: "Kurabanli Ruslan",
      algos: [
        "Ceaser",
        "Vigener",
        "Playfair",
        "Transposition",
        "Blowfish",
        "RSA"
      ],
      keySizes: [512, 1024, 2048],
      algo: "RSA",
      offset: 0,
      keySize: 512,
      publicKey: "",
      privateKey: "",
      key: "KEYEYE",
      pad: "X"
    };
  },

  created() {
    let key = RSA({ b: this.keySize });
    this.privateKey = key.exportKey("pkcs1-private");
    this.publicKey = key.exportKey("pkcs1-public");
  },

  computed: {
    firstTitle() {
      return this.encode ? "Plain text" : "Cipher text";
    },

    secondTitle() {
      return !this.encode ? "Plain text" : "Cipher text";
    },

    secondText() {
      if (this.firstText) {
        if (
          this.algo == "Ceaser" &&
          this.offset >= 0 &&
          this.offset <= 25 &&
          this.firstText
        ) {
          return Ceaser(this.firstText, this.offset * (this.encode ? 1 : -1));
        }
        if (this.algo == "Vigener" && this.key && this.firstText) {
          if (this.encode)
            return Vigenere.encrypt(this.firstText, this.key).toUpperCase();
          else return Vigenere.decrypt(this.firstText, this.key).toUpperCase();
        }
        if (this.algo == "Playfair" && this.key && this.firstText) {
          if (this.encode)
            return Playfair.encrypt(this.firstText, this.key).toUpperCase();
          else return Playfair.decrypt(this.firstText, this.key).toUpperCase();
        }
        if (
          this.algo == "Transposition" &&
          this.key &&
          this.pad &&
          this.firstText
        ) {
          if (this.encode)
            return Transposition.encrypt(
              this.firstText,
              this.key,
              this.pad
            ).toUpperCase();
          else
            return Transposition.decrypt(
              this.firstText,
              this.key
            ).toUpperCase();
        }
        if (this.algo == "Blowfish" && this.key && this.firstText) {
          let bf = new Blowfish(this.key);
          return bf.base64Encode(bf.encrypt(this.firstText));
        }
        if (
          this.algo == "RSA" &&
          this.privateKey &&
          this.publicKey &&
          this.firstText
        ) {
          let key = RSA();
          key.setOptions({ encryptionScheme: "pkcs1" });
          key.importKey(this.privateKey, "pkcs1-private");
          key.importKey(this.publicKey, "pkcs1-public");
          if (this.encode) {
            return key.encrypt(this.firstText, "base64");
          } else {
            let string = "";
            try {
              string = key.decrypt(this.firstText, "utf8");
            } catch (e) {
              string = "";
            }
            return string;
          }
        }
      }
      return "";
    },

    allowAnimate() {
      return this.algo == "Blowfish" && this.key && this.firstText;
    },

    allowAnimateRSA() {
      return (
        this.algo == "RSA" &&
        this.publicKey &&
        this.privateKey &&
        this.firstText
      );
    },

    playfairMatrix() {
      return Playfair.generateKey(this.key).map(x => {
        return x.map(y => {
          return y.toUpperCase();
        });
      });
    },

    displayBF() {
      return {
        display: this.algo == "Blowfish" ? "block" : "none"
      };
    },

    displayRSA() {
      return {
        display: this.algo == "RSA" ? "block" : "none"
      };
    }
  },

  methods: {
    generateKey() {
      let key = RSA({ b: this.keySize });
      this.privateKey = key.exportKey("pkcs1-private");
      this.publicKey = key.exportKey("pkcs1-public");
    }
  }
};
</script>

<style lang="scss"></style>
