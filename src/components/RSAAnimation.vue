<template>
  <v-btn
    class="mx-2"
    color="deep-purple"
    @click="dialog = true"
    :disabled="disabled"
  >
    Animate
    <v-dialog v-model="dialog" max-width="960px">
      <v-card class="pa-8">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="deep-purple lighten-3"
            :disabled="blocked"
            text
            @click="close"
          >
            Close
          </v-btn>
          <v-btn color="success" :disabled="blocked" text @click="animate">
            Run
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
import gsap from "gsap";

export default {
  name: "RSAAnimation",

  props: {
    disabled: {
      type: Boolean,
      required: true
    },
    plainText: {
      type: String,
      required: true
    },
    cipherText: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      dialog: false,
      blocked: false
    };
  },

  methods: {
    animate() {
      let timeline = gsap.timeline({
        // repeat: -1,
        defaults: {
          duration: 0.6,
          ease: "power1.inOut"
        }
      });
      timeline.set(this, {
        blocked: true
      });

      timeline.set(this, {
        blocked: false
      });
    },

    close() {
      this.dialog = false;
    }
  }
};
</script>

<style></style>
