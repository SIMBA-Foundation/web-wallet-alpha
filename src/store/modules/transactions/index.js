import { transactions } from "./data";

const state = {
    transactions
};

// getters
const getters = {
    transactions: state => {
        return state.transactions;
    }
};

// actions
const actions = {
    addTransactionRecord(context, payload) {
        context.commit("addTransactionRecord", payload);
    },
    changeTransaction(context, payload) {
        context.commit("changeTransaction", payload);
    }
};

// mutations
const mutations = {
    addTransactionRecord(state, payload) {
        let newRecord = payload;
        state.transactions.push(newRecord);
    },
    changeTransaction(state, payload) {
        let index = state.transactions.indexOf(payload);
        if (index >= 0 && state.transactions[index].status != "comfirmed") {
            state.transactions[index].status = payload.status;
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
