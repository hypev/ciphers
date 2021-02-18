<template>
  <v-app-bar app>
    <a href="https://kurr.me" target="_blank">
      <v-img
        class="mx-2"
        :src="logo"
        max-height="40"
        max-width="40"
        contain
      ></v-img>
    </a>
    <v-btn text to="/ciphers" class="mx-4" color="deep-purple lighten-3">
      ciphers
    </v-btn>
  </v-app-bar>
</template>

<script>
import logo from "../assets/app-icon.svg";

export default {
  name: "Navbar",

  data() {
    return {
      logo: logo
    };
  }
};
</script>

<style lang="scss"></style>
