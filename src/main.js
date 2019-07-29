/**
 * Web Wallet Entry File
 */
import "babel-polyfill";
import Vue from "vue";
import Vuetify from "vuetify";
import { Vue2Dragula } from "vue2-dragula";
import VueBreadcrumbs from "vue2-breadcrumbs";
import VueResource from "vue-resource";
import Notifications from "vue-notification";
import velocity from "velocity-animate";
import Nprogress from "nprogress";
import VueI18n from "vue-i18n";
import fullscreen from "vue-fullscreen";
import InstantSearch from "vue-instantsearch";
import Croppa from "vue-croppa";

// global components
import GlobalComponents from "./globalComponents";

// app.vue
import App from "./App";

// router
import router from "./router";

// themes
import primaryTheme from "./themes/primaryTheme";

// store
import { store } from "./store/store";

// include script file
import "./lib/CoreScript";

// include all css files
import "./lib/CoreCss";

// messages
import messages from "./lang";

// navigation guards before each
router.beforeEach((to, from, next) => {
    Nprogress.start();
    next();
});

// navigation guard after each
router.afterEach(() => {
    Nprogress.done();
    setTimeout(() => {
        const contentWrapper = document.querySelector(".v-content__wrap");
        if (contentWrapper !== null) {
            contentWrapper.scrollTop = 0;
        }
        const boxedLayout = document.querySelector(".app-boxed-layout .app-content");
        if (boxedLayout !== null) {
            boxedLayout.scrollTop = 0;
        }
        const miniLayout = document.querySelector(".app-mini-layout .app-content");
        if (miniLayout !== null) {
            miniLayout.scrollTop = 0;
        }
    }, 200);
});

// plugins
Vue.use(Vuetify, {
    theme: store.getters.selectedTheme.theme
});
Vue.use(InstantSearch);
Vue.use(VueI18n);
Vue.use(Vue2Dragula);
Vue.use(VueResource);
Vue.use(VueBreadcrumbs);
Vue.use(Notifications, { velocity });
Vue.use(fullscreen);
Vue.use(GlobalComponents);
Vue.use(Croppa);

// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: store.getters.selectedLocale.locale, // set locale
    messages // set locale messages
});

/* eslint-disable no-new */
new Vue({
    store,
    i18n,
    router,
    render: h => h(App),
    components: { App }
}).$mount("#app");
