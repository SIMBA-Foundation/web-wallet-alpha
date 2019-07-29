<template>
<div>
	 <template v-if="loading">
		<app-dialog-loader></app-dialog-loader>
	</template>
	<v-dialog v-model="dialog" persistent max-width="600px" max-height="100%">
		<v-card>
			<v-card-title>
				<span class="headline"> {{$t('message.sendTransactionTitle')}} </span>
			</v-card-title>
			<v-card-text>
				<v-form ref="sendform" id="sendform" v-model="form.valid" lazy-validation>
					<v-alert
						:value="true"
						type="warning"
						v-show="alert.status"
					>
					{{alert.message}}
					</v-alert>
					<v-flex xs12>
						<v-select
							ref="sendformFrom"
							:items="wallets"
							item-text="fullname"
							item-value="address"
							v-model="sendTx.from"  
							:label="$t('message.fromWallet')"
							:placeholder="$t('message.fromWalletTip')"
							single-line
							>
						</v-select>
					</v-flex>
					<v-flex xs12 style="position: relative;">
            <v-text-field
              ref="sendformTo"
              v-model="sendTx.to"
              :disabled="form.receiver_disabled"
              :rules="[form.rules.addressRequired, form.rules.addressMin,form.rules.addressMatch]"
							:label="$t('message.inputReceiverAddress')"
							:placeholder="$t('message.inputReceiverAddressTip')"
              :counter="42"
							required
            ></v-text-field>
            <div class="chooseSelect">
              <div class="chooseSelectIn">
                <div class="chooseSelectBox">
						<v-select
              name="sendselect"
              id="sendselect"
              v-model="sendTx.to"
							:items="receivers"
							item-text="fullname"
							item-value="address"
              class="chooseOption"
							>
              </v-select>
              </div>
              </div>
              </div>
					</v-flex>
					<v-flex xs12>
						<v-text-field
							ref="amount"
							v-model="sendTx.amount"
							:rules="[form.rules.amountRequired,form.rules.amountRules]"
							:label="$t('message.transactionAmount')"
							type="text"
							placeholder="0"
              :max-value="this.form.max_amount"
							value=""
							:suffix="form.amount_suffix"
							:disabled="form.amount_disabled"
							required
						></v-text-field>

					</v-flex>
					<v-flex xs12>
					<v-text-field
						v-model="form.password"
						:append-icon="form.password_show ? 'visibility_off' : 'visibility'"
						:rules="[form.rules.passwordRequired]"
						:type="form.password_show ? 'text' : 'password'"
						:hint="$t('message.enterPassword')"
						:label="$t('message.walletPassword')"
						:placeholder="$t('message.enterPassword')"
						value=""
						counter
						@click:append="form.password_show = !form.password_show"
						required
					></v-text-field>
					</v-flex>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn 
					raised
					@click.native="closeDialog"
					>{{$t('message.close')}}</v-btn>
				<v-btn 
					raised
					color="primary"
					@click.native="sendTransaction"
					:disabled="!form.valid"
					>{{$t('message.sendTransaction')}}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { getBalances, sentTransaction, isNumber } from "Helpers/helpers";
import BigNumber from "bignumber.js";
export default {
  data: () => ({
    selectReceiver: "",
    alert: {
      status: false,
      message: ""
    },
    loading: false,
    dialog: false,
    receivers: [],
    balances: 0,
    sendTx: {
      from: "",
      to: "",
      amount: 0,
      status: "",
      hash: ""
    },
    currentInfo: {
      from: "",
      amount: 0
    },
    fromWallet: {},
    formTimeout: false,
    openTimeout: false,
    form: {
      valid: true,
      password_show: false,
      password: "",
      receiver_disabled: true,
      amount_suffix: "",
      amount_disabled: false,
      max_amount: 0,
      rules: {
        addressRequired: value => !!value || "Receiver's Address Required.",
        amountRequired: value => !!value || "Amount Required.",
        amountRules: (value, el) => {
          if (!isNumber(value)) {
            return "Invalid Amount";
          } else {
            return true;
          }
        },
        passwordRequired: value => !!value || "Wallet Password Required.",
        addressMin: value => {
          if (value && value.length == 42) {
            return true;
          } else {
            return "Account address Min 42 characters";
          }
        },
        addressMatch: v => {
          return /^0x[a-fA-F0-9]{40}$/.test(v) || "Account address don't match";
        }
      }
    }
  }),
  watch: {
    sendTx: {
      handler: function(info) {
        if (info && info.from) {
          var _self = this;
          _self.receivers = [];
          _self.wallets.forEach(wallet => {
            if (info.from != wallet.address) {
              _self.receivers.push({
                fullname: wallet.fullname,
                address: wallet.address
              });
            } else {
              _self.fromWallet = wallet;
            }
          });

          if (info.from != "") {
            if (_self.currentInfo.from != info.from) {
              _self.getMaxAmount(info.from);
              _self.currentInfo.from = info.from;
            }
            _self.form.receiver_disabled = false;
            if (!isNumber(info.amount)) {
              return false;
            }
            if (info.amount && _self.currentInfo.amount != info.amount) {
              var _balance = new BigNumber("" + _self.form.max_amount + "")
                .minus("" + info.amount + "")
                .toFixed(6);
              if (_balance < 0) {
                _balance = 0;
                _self.form.valid = false;
                _self.alert = {
                  status: true,
                  message: "Insufficient Balance"
                };
              } else {
                _self.form.valid = true;
                _self.alert.status = false;
              }
              _self.balances = _balance;
              _self.form.amount_suffix = "Balance:" + _balance;
              _self.currentInfo.amount = info.amount;
            }
          } else {
            _self.form.receiver_disabled = true;
          }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["wallets", "transactions"])
  },
  methods: {
    clearFormTimeout() {
      if (this.formTimeout) {
        clearTimeout(this.formTimeout);
      }
    },
    formEvent(callback) {
      this.clearFormTimeout();
      this.formTimeout = setTimeout(callback, 320);
    },
    open(defWallet) {
      this.loading = true;
      if (defWallet) {
        this.sendTx.from = defWallet.address;
      }
      if (this.openTimeout) {
        clearTimeout(this.openTimeout);
        this.openTimeout = false;
      }
      this.openTimeout = setTimeout(() => {
        this.loading = false;
        this.dialog = true;
      }, 260);
      //this.$refs.sendform.reset();
    },
    closeDialog() {
      this.dialog = false;
      this.form.max_amount = 0;
      this.sendTx = {
        from: "",
        to: "",
        amount: 0,
        status: "",
        hash: ""
      };
    },
    sendTransaction() {
      if (this.$refs.sendform.validate()) {
        this.alert = {
          status: false,
          message: ""
        };
        this.loading = true;
        this.formEvent(() => {
          sentTransaction(
            this.sendTx,
            JSON.parse(this.fromWallet.keystore),
            this.form.password
          )
            .then(res => {
              this.sendTx = {
                from: "",
                to: "",
                amount: 0,
                status: "",
                hash: ""
              };
              this.form.password = "";
              if (res.hash != "") {
                this.addTransactionRecord(res);
              }
            })
            .catch(error => {
              this.alert = {
                status: true,
                message: error
              };
              this.loading = false;
            });
        });
      }
    },
    getMaxAmount() {
      var _this = this;
      if (this.sendTx.from && this.sendTx.from) {
        getBalances(this.sendTx.from, res => {
          if (res > 0) {
            _this.form.amount_suffix = "Balance:" + res;
            _this.form.max_amount = res;
            _this.form.amount_disabled = false;
          } else {
            _this.form.valid = false;
            _this.form.amount_disabled = true;
          }
        });
      }
    },
    addTransactionRecord(txRecord) {
      this.$store.dispatch("addTransactionRecord", txRecord);

      this.loading = false;
      this.closeDialog();
    }
  }
};
</script>
