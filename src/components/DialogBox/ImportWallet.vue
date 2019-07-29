<template>
  <div>
 <template v-if="loading">
			<app-dialog-loader></app-dialog-loader>
		</template>
	<v-dialog v-model="dialog" persistent max-width="600px" max-height="100%">
		<v-card>
			<v-card-title>
				<span class="headline">{{$t('message.importWallet')}}</span>
			</v-card-title>
			<v-card-text>
    <v-alert
        :value="true"
        type="warning"
        v-show="alert.status"
      >
      {{alert.message}}
      </v-alert>
                <v-form v-model="importForm.valid" ref="form" lazy-validation>
					<v-text-field
						:label="$t('message.walletName')"
						v-model="importForm.name"
						:rules="[importForm.rules.nameRequired,importForm.rules.nameRules]"
						:counter="20"
						:placeholder="$t('message.enterWalletName')"
						required
					></v-text-field>
          <div :class="keystoreStatusStyle" >
          <input type="file" :name="uploadFieldName" @change="filesChange($event); fileCount = $event.target.files.length"
            accept="*" class="input-file">
            <p v-if="isInitial" class="dropbox-tip">
              <strong>SELECT WALLET FILE...</strong>
              <i>Drag your wallet's keystore here to begin<br> or click to browse</i>
            </p>
            <p v-if="isSuccess">
              <strong>Your wallet is encrypted. Good!</strong>
            </p>
            <p v-if="isFailed" class="dropbox-tip">
              <strong>This is not a valid wallet file.</strong>
            </p>
        </div>
          
					<v-text-field
						v-show="importForm.password_input_visible"
						:append-icon="importForm.password_show ? 'visibility_off' : 'visibility'"
						:label="$t('message.walletPassword')"
						:type="importForm.password_show ? 'text' : 'password'"
						v-model="importForm.password"
						:rules="[importForm.rules.passwordRequired]"
            :placeholder="$t('message.enterPassword')"
						@click:append="importForm.password_show = !importForm.password_show"
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
						:disabled="!importForm.valid"
						color="success"
					>
						{{$t("message.unlockWallet")}}
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
const STATUS_INITIAL = 0,
  STATUS_SUCCESS = 1,
  STATUS_FAILED = 2;
export default {
  data() {
    return {
      alert: {
        status: false,
        message: ""
      },
      keystoreStatus: null,
      keystoreStatusStyle: "dropbox",
      uploadFieldName: "keystoreFile",
      uploadedFiles: [],
      uploadError: null,
      loading: false,
      dialog: false,
      formTimeout: false,
      wallet: {
        address: "",
        name: "",
        password: "",
        keystore: ""
      },
      importForm: {
        valid: true,
        keystore: "",
        password_show: false,
        password_input_visible: false,
        password: "",
        rules: {
          passwordRequired: value => !!value || "Password is required.",
          keystoreRequired: value => !!value || "Keystore Code is required.",
          nameRequired: v => !!v || "Wallet Name is required",
          nameRules: v =>
            (v && v.length <= 10) ||
            "Wallet Name must be less than 10 characters"
        }
      }
    };
  },
  watch: {
    importForm: {
      handler: function(importInfo) {
        if (
          !importInfo.password_input_visible &&
          importInfo.keystore.length > 50
        ) {
          importInfo.password_input_visible = true;
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["wallets"]),
    isInitial() {
      return this.keystoreStatus === STATUS_INITIAL;
    },
    isSuccess() {
      return this.keystoreStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.keystoreStatus === STATUS_FAILED;
    }
  },
  mounted() {
    this.reset();
  },
  methods: {
    open() {
      this.dialog = true;
      this.alert = {
        status: false,
        message: ""
      };
      this.importForm.keystore = "";
      this.importForm.password_input_visible = false;
      this.importForm.password = "";
      this.reset();
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
          const _keystore_object = JSON.parse(this.importForm.keystore);
          if (isExist(this.$store.getters, this.importForm.name, "name")) {
            this.alert = {
              status: true,
              message: "Wallet Name is exist!"
            };
            this.loading = false;
            return false;
          }
          if (
            !isExist(
              this.$store.getters,
              "0x" + _keystore_object.address,
              "address"
            )
          ) {
            keythereum.recover(
              this.importForm.password,
              _keystore_object,
              privateKey => {
                if (
                  Object.prototype.toString.call(privateKey) ===
                  "[object Uint8Array]"
                ) {
                  getBalances("0x" + _keystore_object.address, balances => {
                    let walletAddress = "0x" + _keystore_object.address,
                      fullname = this.importForm.name + ":" + walletAddress;
                    this.wallet = {
                      name: this.importForm.name,
                      fullname: fullname,
                      address: walletAddress,
                      keystore: JSON.stringify(_keystore_object),
                      balances: balances
                    };
                    this.addWallet();
                  });
                } else {
                  this.alert = {
                    status: true,
                    message: "Password Or Keystore Error!"
                  };
                  this.loading = false;
                }
              }
            );
          } else {
            this.alert = {
              status: true,
              message: "Wallet Address is exist!"
            };
            this.loading = false;
          }
        });
      }
    },
    addWallet() {
      this.$store.dispatch("addWallet", this.wallet);
      this.$refs.form.reset();
      this.loading = false;
      this.closeDialog();
    },
    reset() {
      this.keystoreStatus = STATUS_INITIAL;
      this.keystoreStatusStyle = "dropbox";
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    filesChange(evt) {
      this.loading = true;

      var evtTarget = evt.target,
        fileList = evtTarget.files;
      if (!fileList.length) return;
      let currentFile = fileList[0],
        fileType = currentFile.type,
        size = currentFile.size;
      if (fileType == "" || fileType == ".keystore") {
        var reader = new FileReader();
        reader.onload = (curFile => {
          return e => {
            this.importForm.keystore = e.target.result;
          };
        })(currentFile);
        reader.onloadend = () => {
          this.keystoreStatus = STATUS_SUCCESS;
          this.keystoreStatusStyle = "dropbox getsuccess";
          this.loading = false;
        };
        reader.readAsText(currentFile);
      } else {
        this.keystoreStatus = STATUS_FAILED;
        this.keystoreStatusStyle = "dropbox fail";
        this.loading = false;
      }
    }
  }
};
</script>
