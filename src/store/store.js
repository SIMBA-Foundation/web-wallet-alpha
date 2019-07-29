import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
// modules
import wallets from "./modules/wallets";
import transactions from "./modules/transactions";
import settings from "./modules/settings";
import sidebar from "./modules/sidebar";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
    key: "blockcloud-wallet-v1_2",
    storage: localStorage
});

export const store = new Vuex.Store({
    plugins: [vuexPersist.plugin],
    modules: {
        wallets,
        settings,
        sidebar,
        transactions
    }
});
