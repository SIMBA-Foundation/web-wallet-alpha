<template>
  <div>
    <template v-if="loading">
		<app-dialog-loader></app-dialog-loader>
	</template>
    <v-dialog v-model="dialog" persistent max-width="800">
      <v-card>
        <v-card-title class="headline">Are you sure delete?</v-card-title>
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
            color="primary"
            class="mb-30 text-center"
          >
            <p>Before you delete the application, ensure you have properly backed up your keystore for your wallet and have it handy in case you need it</p>
            <v-btn dark small color="secondary"  @click.native="backupDailog()">Backup</v-btn>
          </v-alert>
                      <v-form v-model="delete_valid" ref="deleteform" lazy-validation>
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
          <v-btn color="success" @click.native="deleteWallet()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { keystoreFileName, byteTo16Str } from "Helpers/helpers";
const keythereum = require("keythereum");
export default {
  data() {
    return {
      alert: {
        status: false,
        message: ""
      },
      loading: false,
      dialog: false,
      delete_valid: true,
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
    deleteWallet() {
      if (this.$refs.deleteform.validate()) {
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
                this.$store.dispatch("deleteWallet", this.wallet);
                this.loading = false;
                this.dialog = false;
              }
            }
          );
        }, 320);
      }
    },
    backupDailog() {
      this.dialog = false;
      this.$emit("openBackup", this.wallet);
    }
  }
};
</script>
