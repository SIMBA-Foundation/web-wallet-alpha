/**
 * Sidebar Module
 */

import { menus } from "./data.js";

const state = {
    menus
};

const getters = {
    menus: state => {
        return state.menus;
    }
};

const actions = {
    setActiveMenuGroup(context, payload) {
        context.commit("setActiveMenuGroupHandler", payload);
    }
};

const mutations = {
    setActiveMenuGroupHandler(state, router) {
        let fullPath = router.history.current.fullPath;
        let path = fullPath.split("/");
        let matchedPath = "/" + path[2] + "/" + path[3];
        return matchedPath;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
