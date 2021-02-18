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
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",

  components: {
    Navbar
  },

  data() {
    return {};
  }
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
