<template>
  <div>
    <template v-if="loading">
		<app-dialog-loader></app-dialog-loader>
	</template>
	<v-dialog v-model="dialog" persistent max-width="600px" max-height="100%">
		<v-card>
			<v-card-title>
				<span class="headline">{{$t('message.backupWallet')}}</span>
			</v-card-title>
			<v-card-text>
                <v-alert
                :value="true"
                type="warning"
                v-show="alert.status"
                class="mb-20"
            >
            {{alert.message}}
            </v-alert>
            <v-alert
                :value="true"
                color="success"
                class="text-center"
                v-show="result.status"
            >
            <h2>Save your Keystore File.</h2>
                <p>
                    <v-btn
            color="primary" 
            class="mb-2"
            @click="downloadKeystore"
          >Download Keystore File(UTC/JSON)</v-btn>
                </p>
                <p>
                    <strong>Do not lose it!</strong> It cannot be recovered if you lose it.
                </p>
                <p>
<strong>Do not share it!</strong> Your funds will be stolen if you use this file on a malicious/phishing site.
</p><p>
<strong>Make a backup!</strong> Secure it like the millions of dollars it may one day be worth.
                </p>
            </v-alert>
                
            <v-form v-model="backup_valid" v-show="!result.status" ref="backupform" lazy-validation>
					<v-text-field
                        :append-icon="password_show ? 'visibility_off' : 'visibility'"
						:label="$t('message.walletPassword')"
						v-model="password"
						:rules="passwordRules"
                        :type="password_show ? 'text' : 'password'"
                        @click:append="password_show = !password_show"
                        :hint="$t('message.enterPassword')"
                        placeholder="Please enter your wallet's password."
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
						:disabled="!backup_valid || result.status"
						color="success"
					>
						{{$t("message.backup")}}
					</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { keystoreFileName, byteTo16Str } from "Helpers/helpers";
import { saveAs } from "file-saver";
const keythereum = require("keythereum");
export default {
  data() {
    return {
      alert: {
        status: false,
        message: ""
      },
      result: {
        status: false,
        message: ""
      },
      loading: false,
      dialog: false,
      backup_valid: true,
      isDownload: false,
      password: "",
      password_show: false,
      wallet: null,
      passwordRules: [
        v => !!v || "Wallet Password is required",
        v =>
          (v && v.length >= 6) ||
          "Wallet Password must be more than 6 characters",
        v =>
          (v && v.length <= 16) ||
          "Wallet Password must be less than 16 characters"
      ]
    };
  },
  methods: {
    open(walletInfo) {
      this.wallet = walletInfo;
      this.result = {
        status: false
      };
      this.alert.status = false;
      this.password = "";
      this.dialog = true;
      this.backup_valid = true;
      false;
    },
    closeDialog() {
      this.dialog = false;
    },
    submit() {
      if (this.$refs.backupform.validate()) {
        this.loading = true;
        this.alert = {
          status: false,
          message: ""
        };
        var _recover_timeout = false;
        if (_recover_timeout) {
          clearTimeout(_recover_timeout);
          _recover_timeout = false;
        }
        _recover_timeout = setTimeout(() => {
          keythereum.recover(
            this.password,
            JSON.parse(this.wallet.keystore),
            privateKey => {
              if (privateKey instanceof Error) {
                this.alert = {
                  status: true,
                  message: "Password Error!"
                };
                this.loading = false;
                return false;
              }
              var newKey = JSON.parse(JSON.stringify(privateKey));
              if (newKey && newKey.data) {
                var _hex_private_key = byteTo16Str(newKey.data);
                this.result = {
                  status: true
                };
                this.isDownload = true;
                this.loading = false;
              }
            }
          );
        }, 320);
      }
    },
    downloadKeystore() {
      if (this.wallet != null && this.isDownload) {
        let keystore = this.wallet.keystore,
          address = this.wallet.address,
          filename = keystoreFileName(address);
        const string =
          typeof keystore === "object" ? JSON.stringify(keystore) : keystore;
        if (string === null) return "";
        var keystoreFile = new File([keystore], filename, { type: "mime" });
        saveAs(keystoreFile);
      }
    }
  }
};
</script>
