import Vue from "vue";
import VueRouter from "vue-router";
import goTo from "vuetify/es5/services/goto";

import Ciphers from "../views/Ciphers.vue";
import AccessControl from "../views/AccessControl.vue";
import CryptedChat from "../views/CryptedChat.vue";
import AccessControlFile from "../views/AccessControlFile.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        redirect: "/ciphers",
    },
    {
        path: "/ciphers",
        name: "ciphers",
        component: Ciphers,
    },
    {
        path: "/chat",
        name: "chat",
        component: CryptedChat,
    },
    {
        path: "/access-control",
        name: "access-control",
        component: AccessControl,
    },
    {
        path: "/access-control/:file",
        name: "access-control-file",
        component: AccessControlFile,
    },
];

const router = new VueRouter({
    scrollBehavior: (to, from, savedPosition) => {
        let scrollTo = 0;

        if (to.hash) {
            scrollTo = to.hash;
        } else if (savedPosition) {
            scrollTo = savedPosition.y;
        }

        return goTo(scrollTo);
    },
    mode: "history",
    routes,
});

export default router;
