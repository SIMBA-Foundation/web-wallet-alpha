import { wallets } from "./data";

const state = {
    wallets
};

// getters
const getters = {
    wallets: state => {
        return state.wallets;
    }
};

// actions
const actions = {
    addWallet(context, payload) {
        context.commit("addWallet", payload);
    },
    deleteWallet(context, payload) {
        context.commit("deleteWallet", payload);
    }
};

// mutations
const mutations = {
    addWallet(state, payload) {
        let newWallet = payload;
        state.wallets.push(newWallet);
    },
    deleteWallet(state, payload) {
        let index = state.wallets.indexOf(payload);
        state.wallets.splice(index, 1);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
