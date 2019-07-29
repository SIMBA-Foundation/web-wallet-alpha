<template>
  <div>
 <template v-if="loading">
			<app-dialog-loader></app-dialog-loader>
		</template>
	<v-dialog v-model="dialog" persistent max-width="600px" max-height="100%">
		<v-card>
			<v-card-title>
				<span class="headline">{{$t('message.newWallet')}}</span>
			</v-card-title>
			<v-card-text>
        <v-alert
        :value="true"
        type="warning"
        v-show="alert.status"
      >
      {{alert.message}}
      </v-alert>
                <v-form v-model="createForm.valid" ref="form" lazy-validation>
					<v-text-field
						:label="$t('message.walletName')"
						v-model="createForm.name"
						:rules="createForm.nameRules"
						:counter="20"
						placeholder="Please input a name."
						required
					></v-text-field>
					<v-text-field
                        :append-icon="createForm.password_show ? 'visibility_off' : 'visibility'"
						:label="$t('message.walletPassword')"
						v-model="createForm.password"
						:rules="createForm.passwordRules"
                        :type="createForm.password_show ? 'text' : 'password'"
                        @click:append="createForm.password_show = !createForm.password_show"
                        :hint="$t('message.enterPassword')"
                        placeholder="Please ensure it is a strong password."
						required
					></v-text-field>

				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
                
				<v-btn 
					raised
					@click.native="closeDialog"
					>{{$t('message.close')}}</v-btn>
				<v-btn
						@click="submit"
						:disabled="!createForm.valid"
						color="success"
					>
						{{$t("message.submit")}}
					</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getBalances, isExist } from "Helpers/helpers";
const keythereum = require("keythereum");
export default {
  data() {
    return {
      formTimeout: false,
      alert: {
        status: false,
        message: ""
      },
      loading: false,
      dialog: false,
      wallet: {
        address: "",
        name: "",
        password: "",
        keystore: ""
      },
      createForm: {
        valid: true,
        name: "",
        nameRules: [
          v => !!v || "Wallet Name is required",
          v =>
            (v && v.length <= 10) ||
            "Wallet Name must be less than 10 characters"
        ],
        password: "",
        password_show: false,
        passwordRules: [
          v => !!v || "Wallet Password is required",
          v =>
            (v && v.length >= 6) ||
            "Wallet Password must be more than 6 characters",
          v =>
            (v && v.length <= 16) ||
            "Wallet Password must be less than 16 characters"
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["wallets"])
  },
  methods: {
    open() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    clearFormTimeout() {
      if (this.formTimeout) {
        clearTimeout(this.formTimeout);
      }
    },
    formEvent(callback) {
      this.clearFormTimeout();
      this.formTimeout = setTimeout(callback, 320);
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.alert = {
          status: false,
          message: ""
        };

        this.formEvent(() => {
          if (isExist(this.$store.getters, this.createForm.name, "name")) {
            this.alert = {
              status: true,
              message: "Wallet Name is exist!"
            };
            this.loading = false;
            return false;
          }
          const _params = {
              keyBytes: 32,
              ivBytes: 16
            },
            _options = {
              kdf: "scrypt",
              cipher: "aes-128-ctr",
              kdfparams: {
                n: 262144,
                r: 8,
                p: 1,
                dklen: 32
              }
            },
            _password = this.createForm.password;
          keythereum.create(_params, dk => {
            keythereum.dump(
              _password,
              dk.privateKey,
              dk.salt,
              dk.iv,
              _options,
              keyObject => {
                if (keyObject.address) {
                  if (
                    !isExist(
                      this.$store.getters,
                      "0x" + keyObject.address,
                      "address"
                    )
                  ) {
                    getBalances("0x" + keyObject.address, balances => {
                      let walletAddress = "0x" + keyObject.address,
                        fullname = this.createForm.name + ":" + walletAddress;
                      this.wallet = {
                        name: this.createForm.name,
                        fullname: fullname,
                        address: walletAddress,
                        keystore: JSON.stringify(keyObject),
                        balances: balances
                      };
                      this.addWallet();
                    });
                  } else {
                    this.alert = {
                      status: true,
                      message: "Wallet Address is exist!"
                    };
                    this.loading = false;
                  }
                }
              }
            );
          });
        });
      }
    },
    addWallet() {
      this.$store.dispatch("addWallet", this.wallet);
      this.$refs.form.reset();
      this.loading = false;
      this.closeDialog();
    }
  }
};
</script>
