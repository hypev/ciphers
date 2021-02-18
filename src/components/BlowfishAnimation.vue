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
        <div class="bf">
          <div class="bf-input">{{ plainText }}</div>
          <div class="bf-animation-line">
            <div class="bf-blowfish"></div>
            <div class="bf-xor"></div>
            <div class="bf-pbox">{{ roundedIteration }}</div>
            <div class="bf-pbox copy">{{ roundedIteration }}</div>
            <div class="bf-left"></div>
            <div class="bf-left copy"></div>
            <div class="bf-right"></div>
          </div>
          <div class="bf-counter">
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="5"
              :value="iterationPercentage"
              color="blue"
            >
              {{ roundedIteration }}
            </v-progress-circular>
          </div>
          <div class="bf-output">{{ cipherText }}</div>
        </div>
        <v-card-actions>
          <div class="bf-info" ref="info">
            <div class="bf-info-line">
              <span class="bf-info-line-rect left">Left</span>
            </div>
            <div class="bf-info-line">
              <span class="bf-info-line-rect right">Right</span>
            </div>
            <div class="bf-info-line">
              <span class="bf-info-line-rect pbox">
                P<sub>{{ roundedIteration }}</sub> box
              </span>
            </div>
            <div class="bf-info-line">
              <span class="bf-info-line-rect blowfish">Blowfish</span>
            </div>
          </div>
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
  name: "BlowfishAnimation",

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
      blocked: false,
      iteration: 1
    };
  },

  computed: {
    iterationPercentage() {
      return (this.iteration / 16) * 100;
    },

    roundedIteration() {
      return Math.floor(this.iteration);
    }
  },

  watch: {
    dialog() {
      let opacity = this.dialog ? 1 : 0;
      let timeout = this.$refs.info ? 0 : 100;
      setTimeout(() => {
        if (!this.$refs.info) {
          gsap.set(this.$refs.info, {
            opacity: 0
          });
        }
        gsap.to(this.$refs.info, {
          delay: 0.3,
          opacity,
          duration: 0.1,
          ease: "power1.inOut"
        });
      }, timeout);
    }
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
      timeline.set(".bf-animation-line", {
        yPercent: 0
      });
      timeline.set([".bf-left", ".bf-right"], {
        xPercent: 0,
        yPercent: 0,
        backgroundColor: "#487eb0",
        borderRadius: "5px",
        scaleX: 1,
        opacity: 1
      });
      timeline.set(".bf-pbox", {
        opacity: 0,
        xPercent: -300,
        yPercent: 0
      });
      timeline.set(".bf-xor", {
        opacity: 0,
        xPercent: -200,
        yPercent: 200
      });
      timeline.set(".bf-blowfish", {
        opacity: 0,
        borderRadius: "5px"
      });
      timeline.set(this, {
        blocked: true,
        iteration: 1
      });
      timeline.set(".bf-counter", {
        opacity: 0
      });
      timeline.set(".bf-output", {
        opacity: 0
      });

      timeline.to(".bf-animation-line", {
        yPercent: 200
      });
      timeline.to(".bf-left", {
        xPercent: -100,
        backgroundColor: "#3498db",
        borderRadius: "50%"
      });
      timeline.to(
        ".bf-right",
        {
          xPercent: 100,
          backgroundColor: "#2ecc71",
          borderRadius: "50%"
        },
        "-=0.6"
      );
      timeline.to(".bf-pbox", {
        opacity: 1
      });
      timeline.to(".bf-xor", {
        opacity: 1
      });
      timeline.to([".bf-left", ".bf-pbox"], {
        xPercent: -200,
        yPercent: 200
      });
      timeline.to(
        [".bf-xor", ".bf-pbox"],
        {
          opacity: 0
        },
        "-=0.3"
      );
      timeline.to(
        ".bf-left",
        {
          borderRadius: "5px"
        },
        "-=0.6"
      );
      timeline.to(".bf-left", {
        xPercent: -100,
        yPercent: 0
      });
      timeline.to(".bf-left", {
        xPercent: -300
      });
      timeline.to(
        ".bf-right",
        {
          xPercent: 300
        },
        "-=0.6"
      );
      timeline.to(".bf-blowfish", {
        opacity: 1
      });
      timeline.to(".bf-left.copy", {
        xPercent: 0,
        scale: 0.5
      });

      timeline.set(".bf-xor", {
        yPercent: 200,
        xPercent: 150
      });

      timeline.to(".bf-xor", {
        opacity: 1
      });
      timeline.to([".bf-left.copy", ".bf-blowfish", ".bf-right"], {
        yPercent: 200,
        xPercent: 150,
        borderRadius: "50%"
      });
      timeline.to([".bf-left.copy", ".bf-xor", ".bf-blowfish"], {
        opacity: 0
      });

      timeline.set(".bf-blowfish", {
        yPercent: 0,
        xPercent: 0
      });
      timeline.set(".bf-left.copy", {
        yPercent: 0,
        xPercent: -300
      });

      timeline.to(
        ".bf-right",
        {
          borderRadius: "5px"
        },
        "-=0.6"
      );
      timeline.to(".bf-right", {
        xPercent: 300,
        yPercent: 0
      });
      timeline.to(".bf-left", {
        backgroundColor: "#2ecc71",
        xPercent: 100
      });
      timeline.to(
        ".bf-right",
        {
          xPercent: -100,
          backgroundColor: "#3498db"
        },
        "-=0.6"
      );
      timeline.to([".bf-left", ".bf-right"], {
        opacity: 0
      });
      timeline.to(
        ".bf-counter",
        {
          opacity: 1
        },
        "-=0.6"
      );
      timeline.to(this, {
        iteration: 16,
        duration: 1
      });
      timeline.to(".bf-counter", {
        opacity: 0
      });
      timeline.to(
        [".bf-left", ".bf-right"],
        {
          opacity: 1
        },
        "-=0.6"
      );
      timeline.to(".bf-left", {
        backgroundColor: "#3498db",
        xPercent: -300
      });
      timeline.to(
        ".bf-right",
        {
          xPercent: 300,
          backgroundColor: "#2ecc71"
        },
        "-=0.6"
      );

      timeline.set(".bf-xor", {
        yPercent: 200,
        xPercent: 0
      });
      timeline.set(".bf-pbox", {
        xPercent: 0,
        yPercent: 0
      });
      timeline.set(this, {
        iteration: 17
      });

      timeline.to([".bf-xor", ".bf-pbox"], {
        opacity: 1
      });
      timeline.to([".bf-right", ".bf-pbox.copy"], {
        yPercent: 200,
        xPercent: 0,
        borderRadius: "50%"
      });

      timeline.set(".bf-pbox", {
        yPercent: 0,
        xPercent: 0
      });

      timeline.to(".bf-right", {
        xPercent: 200
      });

      timeline.set(this, {
        iteration: 18
      });

      timeline.to([".bf-left", ".bf-pbox"], {
        yPercent: 200,
        xPercent: 0,
        borderRadius: "50%"
      });

      timeline.set([".bf-pbox", ".bf-xor"], {
        opacity: 0
      });

      timeline.to(".bf-left", {
        xPercent: -200
      });
      timeline.to([".bf-left", ".bf-right"], {
        xPercent: 0,
        backgroundColor: "#487eb0"
      });
      timeline.to([".bf-left", ".bf-right"], {
        yPercent: 300,
        borderRadius: "5px"
      });
      timeline.to([".bf-left", ".bf-right"], {
        scaleX: 2,
        opacity: 0
      });
      timeline.to(
        ".bf-output",
        {
          opacity: 1
        },
        "-=0.6"
      );

      timeline.set(this, {
        blocked: false
      });
    },

    close() {
      gsap
        .timeline()
        .to(this.$refs.info, {
          opacity: 0,
          duration: 0.1,
          ease: "power1.inOut"
        })
        .set(this, {
          dialog: false
        });
    }
  }
};
</script>

<style>
.bf {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 220px;
}
.bf-info {
  position: fixed;
  top: 30px;
  width: 100%;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}
.bf-info-line {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.bf-info-line-rect {
  display: inline-block;
  text-align: center;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 5px;
}
.bf-info-line-rect.left {
  background-color: #3498db;
}
.bf-info-line-rect.right {
  background-color: #2ecc71;
}
.bf-info-line-rect.pbox {
  background-color: #9b59b6;
}
.bf-info-line-rect.blowfish {
  background-color: #f79f1f;
}

.bf-input,
.bf-output {
  z-index: 2;
  display: inline-block;
  background-color: #487eb0;
  text-align: center;
  padding: 5px 10px;
  border-radius: 5px;
}

.bf-output {
  opacity: 0;
  transform: translateY(400%);
}

.bf-animation-line {
  z-index: 1;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 34px;
  top: 0;
}
.bf-left {
  position: absolute;
  top: 0;
  width: 34px;
  height: 34px;
  background-color: #487eb0;
  border-radius: 5px;
}
.bf-right {
  position: absolute;
  top: 0;
  width: 34px;
  height: 34px;
  background-color: #487eb0;
  border-radius: 5px;
}
.bf-pbox {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  width: 34px;
  height: 34px;
  background-color: #9b59b6;
  border-radius: 50%;
}
.bf-xor {
  position: absolute;
  top: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid #fff;
}
.bf-xor::after,
.bf-xor::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.bf-xor::after {
  transform: translate(-50%, -50%) rotate(90deg);
}
.bf-blowfish {
  position: absolute;
  top: 0;
  width: 34px;
  height: 34px;
  background-color: #f79f1f;
  opacity: 0;
  border-radius: 5px;
}

.bf-counter {
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  transform: translate(-50%, -50%);
}
.v-progress-circular__overlay {
  transition: none !important;
}
</style>
