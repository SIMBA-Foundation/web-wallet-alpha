<template>
	<div>
		<page-title-bar ref="pageTitleBar"></page-title-bar>

		<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<app-card
					:fullBlock="true"
					colClasses="xl12 lg12 md12"
				>
					<v-data-table
						:headers="headers"
						:items="newWallets"
						:rows-per-page-items="[10,25,50]"
						v-model="selected"
						item-key="name"
					>
					<template slot="headerCell" slot-scope="props">
						<v-tooltip bottom>
							<span slot="activator">
								{{ props.header.text }}
							</span>
							<span>
								{{ props.header.text }}
							</span>
						</v-tooltip>
					</template>
					<template slot="items" slot-scope="props">
						<td>{{ props.item.name }}</td>
						<td>{{ props.item.address }}</td>
						<td>{{ props.item.balances }}</td>
						<td>
              <v-btn 
                color="success"
                small
                class="mr-2"
                @click="sendTxDialog(props.item)"
                >
                  Send
                </v-btn>
              <v-btn 
                color="accent"
                small
                class="mr-2"
                @click="backupDialog(props.item)"
                >
                  Backup
                </v-btn>
                <v-btn 
                color="warning"
                small
                class="mr-2"
                @click="deleteDialog(props.item)"
                >
                  Delete
                </v-btn>
            </td>
					</template>
					</v-data-table>
				</app-card>
			</v-layout>
		</v-container>
    <backup-wallet ref="backupWallet"> </backup-wallet>
    <delete-wallet ref="deleteWallet" @openBackup="backupDialog"></delete-wallet>
	</div>
</template>

<script>
import api from "Api";
import { mapGetters } from "vuex";
import { getBalances } from "Helpers/helpers";
import BackupWallet from "Components/DialogBox/Backup";
import DeleteWallet from "Components/DialogBox/DeleteWallet";
export default {
  components: {
    BackupWallet,
    DeleteWallet
  },
  data() {
    return {
      loader: true,
      selected: [],
      headers: [
        {
          text: this.getTitle("message.walletName"),
          align: "left",
          sortable: false,
          value: "name"
        },
        {
          text: this.getTitle("message.walletAddress"),
          sortable: false,
          value: "address"
        },
        {
          text: this.getTitle("message.Balances"),
          value: "balances"
        },
        {
          text: this.getTitle("message.Actions"),
          sortable: false,
          value: "actions"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["wallets"]),
    newWallets() {
      this.wallets.forEach(wallet => {
        if (wallet.address != "") {
          var _new_wallet = wallet;
          getBalances(wallet.address, balances => {
            if (balances) {
              _new_wallet["balances"] = balances;
            }
          });
        }
      });
      return this.wallets;
    }
  },
  methods: {
    getTitle(key) {
      return this.$i18n.t(key);
    },
    sendTxDialog(wallet) {
      this.$refs.pageTitleBar.$refs.newTransaction.open(wallet);
    },
    backupDialog(wallet) {
      this.$refs.backupWallet.open(wallet);
    },
    deleteDialog(wallet) {
      this.$refs.deleteWallet.open(wallet);
    }
  }
};
</script>
