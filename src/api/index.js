import axios from "axios";
import { store } from "../store/store";

export default axios.create({
    baseURL: (function() {
        return store.getters.serviceConf.apiUrl;
    })(),
    timeout: 3000,
    validateStatus: status => {
        if (status == 404) {
            alert("The web wallet the ability to interact with the Blockcloud blockchain, having to run a full node.");
            return false;
        }
        return status >= 200 && status < 300;
    }
});
