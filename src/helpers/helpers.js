/**
 * Helpers Functions
 */
import moment from "moment";
import api from "Api";
import BigNumber from "bignumber.js";
import BlockcloudTx from "blockcloudjs-tx";
const keythereum = require("keythereum");

var unitMap = {
    nobloc: "0",
    attobloc: "1", //aBloc
    femtobloc: "1000", //fBloc
    picobloc: "1000000", //pBloc
    nanobloc: "1000000000", //nBloc
    microbloc: "1000000000000", //μBloc
    millibloc: "1000000000000000", //mBloc
    centibloc: "10000000000000000", //cBloc
    decibloc: "100000000000000000", //dBloc
    bloc: "1000000000000000000",
    kilobloc: "1000000000000000000000", //KiBloc
    megabloc: "1000000000000000000000000", //MeBloc
    gigabloc: "1000000000000000000000000000", //GiBloc
    terabloc: "1000000000000000000000000000000", //TeBloc
    petabloc: "1000000000000000000000000000000000", //PeBloc
    exabloc: "1000000000000000000000000000000000000" //ExBloc
};
var isBigNumber = function(object) {
    return object && (object instanceof BigNumber || (object.constructor && object.constructor.name === "BigNumber"));
};
/**
 * Returns value of unit in attobloc
 *
 * @method getValueOfUnit
 * @param {String} unit the unit to convert to, default bloc
 * @returns {BigNumber} value of the unit (in attobloc)
 * @throws error if the unit is not correct:w
 */
var getValueOfUnit = function(unit) {
    unit = unit ? unit.toLowerCase() : "bloc";
    var unitValue = unitMap[unit];
    if (unitValue === undefined) {
        throw new Error(
            "This unit doesn't exists, please use the one of the following units" + JSON.stringify(unitMap, null, 2)
        );
    }
    return new BigNumber(unitValue, 10);
};
/**
 * Returns true if object is string, otherwise false
 *
 * @method isString
 * @param {Object}
 * @return {Boolean}
 */
var isString = function(object) {
    return typeof object === "string" || (object && object.constructor && object.constructor.name === "String");
};
/**
 * Takes a number of attobloc and converts it to any other bloc unit.
 *
 * @method fromAtto
 * @param {Number|String} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert to, default bloc
 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
 */
export function fromAtto(number, unit) {
    var returnValue = toBigNumber(number).dividedBy(getValueOfUnit(unit));
    return isBigNumber(number) ? returnValue : returnValue.toString(10);
}
/**
 * Takes a number of a unit and converts it to attobloc.
 *
 * @method toAtto
 * @param {Number|String|BigNumber} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert from, default bloc
 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
 */
export function toAtto(number, unit) {
    var returnValue = toBigNumber(number).times(getValueOfUnit(unit));

    return isBigNumber(number) ? returnValue : returnValue.toString(10);
}
/**
 * Takes an input and transforms it into an bignumber
 *
 * @method toBigNumber
 * @param {Number|String|BigNumber} a number, string, HEX string or BigNumber
 * @return {BigNumber} BigNumber
 */
export function toBigNumber(number) {
    /*jshint maxcomplexity:5 */
    number = number || 0;
    if (isBigNumber(number)) return number;

    if (isString(number) && (number.indexOf("0x") === 0 || number.indexOf("-0x") === 0)) {
        return new BigNumber(number.replace("0x", ""), 16);
    }

    return new BigNumber(number.toString(10), 10);
}

// Get Date
export function getTheDate(timestamp, format) {
    let time = timestamp * 1000;
    let formatDate = format ? format : "MM-DD-YYYY";
    return moment(time).format(formatDate);
}

// Convert Date To Timestamp
export function convertDateToTimeStamp(date, format) {
    let formatDate = format ? format : "YYYY-MM-DD";
    return moment(date, formatDate).unix();
}
export function compare(order, sortBy) {
    return (a, b) => {
        a = a[sortBy];
        b = b[sortBy];
        return order == "asc" ? a - b : b - a;
    };
}
/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = "...";
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
}

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        return "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + "," + alpha + ")";
    }
    throw new Error("Bad Hex");
}

/**
 * Function to return currenr app layout
 */
export function getCurrentAppLayout(router) {
    let location = router.history.current.fullPath;
    let path = location.split("/");
    return path[1];
}

export function isExist(state, keyvalue, key) {
    let _is_exist = false;
    state.wallets.some(v => {
        _is_exist = v[key] === keyvalue;
        return _is_exist;
    });

    return _is_exist;
}

export function getBalances(address, cb) {
    api.post("/", {
        jsonrpc: "2.0",
        method: "bloc_getBalance",
        params: [address, "latest"],
        id: new Date().getTime()
    })
        .then(res => {
            if (res.data && res.data.error) {
                console.error(res.data.error);
            } else {
                var balances = new BigNumber(res.data.result).toFixed();
                if (typeof cb === "function") {
                    cb.call(null, fromAtto(balances, "bloc"));
                }
            }
        })
        .catch(function(error) {
            console.error(error);
        });
}

export function sendRawTransaction(serializedTx, cb) {
    api.post("/", {
        jsonrpc: "2.0",
        method: "bloc_sendRawTransaction",
        params: ["0x" + serializedTx],
        id: new Date().getTime()
    })
        .then(res => {
            if (res.data && res.data.error) {
                console.error(res.data.error);
            } else {
                if (typeof cb === "function") {
                    cb.call(null, res.data);
                }
            }
        })
        .catch(function(error) {
            console.error(error);
        });
}

export function getTransactionCount(walletAddress, cb) {
    api.post("/", {
        jsonrpc: "2.0",
        method: "bloc_getTransactionCount",
        params: [walletAddress, "pending"],
        id: new Date().getTime()
    })
        .then(res => {
            if (res.data.error) {
                console.error(res.data.error);
            } else {
                var nonce = new BigNumber(res.data.result).toFixed();
                if (typeof cb === "function") {
                    cb.call(null, nonce);
                }
            }
        })
        .catch(function(error) {
            console.error(error);
        });
}
export function byteTo16Str(byData) {
    var _str = "";
    if (byData.length) {
        for (var j = 0, len = byData.length; j < len; j++) {
            _str += (Array(2).join("0") + byData[j].toString(16)).slice(-2);
        }
    }
    return _str;
}

export function sentTransaction(transaction, keystore, password) {
    const _transaction = {
        amount: transaction.amount,
        from: transaction.from,
        to: transaction.to,
        hash: "",
        status: "Pending",
        create_time: 0
    };
    return new Promise(function(resolve, reject) {
        getTransactionCount(_transaction.from, nonce => {
            keythereum.recover(password, keystore, function(privateKey) {
                if (Object.prototype.toString.call(privateKey) === "[object Uint8Array]") {
                    const _newKey = JSON.parse(JSON.stringify(privateKey));
                    if (_newKey && _newKey.data) {
                        let _hex_private_key = byteTo16Str(_newKey.data),
                            _privateKey = Buffer.from(_hex_private_key, "hex"),
                            _send_amount = toAtto(_transaction.amount);
                        var tx_data = {
                            to: _transaction.to,
                            value: "0x" + new BigNumber(_send_amount, 10).toString(16),
                            nonce: "0x" + new BigNumber(nonce, 10).toString(16),
                            chainId: 1
                        };

                        var tx = new BlockcloudTx(tx_data);
                        tx.sign(_privateKey);
                        var serializedTx = tx.serialize().toString("hex");
                        sendRawTransaction(serializedTx, function(res) {
                            _transaction.hash = res.result;
                            _transaction.create_time = new Date().getTime();
                            resolve(Object.assign({}, _transaction));
                        });
                    }
                } else {
                    reject("Wallet Password Error!");
                }
            });
        });
    });
}

export function getTransactionInfo(hash, cb) {
    api.post("/", {
        jsonrpc: "2.0",
        method: "bloc_getTransactionByHash",
        params: [hash],
        id: new Date().getTime()
    })
        .then(res => {
            cb.call(null, res.data);
        })
        .catch(function(error) {
            console.error(error);
        });
}
export function getLevelNumber() {
    return api.post("/", {
        jsonrpc: "2.0",
        method: "bloc_levelNumber",
        params: [],
        id: new Date().getTime()
    });
}
export function keystoreFileName(address, timestamp) {
    var ts = timestamp ? new Date(timestamp) : new Date();

    return ["UTC--", ts.toJSON().replace(/:/g, "-"), "--", address.toString("hex")].join("");
}
export function isNumber(value) {
    return /^(([1-9]\d*)|\d)(\.\d{1,10})?$/.test(value + "");
}
