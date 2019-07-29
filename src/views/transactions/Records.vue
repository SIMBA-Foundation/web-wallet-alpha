<template>
	<div>
		<page-title-bar></page-title-bar>

		<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<app-card
					:fullBlock="true"
					colClasses="xl12 lg12 md12"
				>
					<v-data-table
						:headers="headers"
						:items="newTransactions"
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
						<td>{{ props.item.from }}</td>
						<td>{{ props.item.to }}</td>
						<td>{{ props.item.amount }}</td>
                        <td>
							<v-chip
							v-if="props.item.status === 'comfirmed'"
							color="success"
							text-color="white"
							class="ml-0"
							label
							small
							>
							{{ props.item.status }}
							</v-chip>
							<v-chip
							v-if="props.item.status === 'pending'"
							color="default"
							class="ml-0"
							label
							small
							>
							{{ props.item.status }}
							</v-chip>
              <v-chip
							v-if="props.item.status !== 'pending' && props.item.status !== 'comfirmed'"
							color="warning"
							class="ml-0"
							label
							small
							>
							{{ props.item.status }}
							</v-chip>
						</td>
                        <td>{{ getTheDate(props.item.create_time,'YY-MM-DD HH:mm') }}</td>
					</template>
					</v-data-table>
				</app-card>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
import api from "Api";
import { mapGetters } from "vuex";
import {
  getTheDate,
  getTransactionInfo,
  compare,
  getLevelNumber
} from "Helpers/helpers";
export default {
  data() {
    return {
      loader: true,
      selected: [],
      newTransactions: [],
      headers: [
        {
          text: this.getTitle("message.transactionFrom"),
          align: "left",
          sortable: false,
          value: "from"
        },
        {
          text: this.getTitle("message.transactionTo"),
          sortable: false,
          value: "to"
        },
        {
          text: this.getTitle("message.transactionAmount"),
          value: "amount",
          sortable: false
        },
        {
          text: this.getTitle("message.transactionStatus"),
          value: "status",
          sortable: false
        },
        {
          text: this.getTitle("message.transactionDate"),
          value: "create_time",
          sortable: false
        }
      ]
    };
  },
  mounted() {
    this.updateTable();
  },
  watch: {
    transactions() {
      this.updateTable();
    }
  },
  computed: {
    ...mapGetters(["transactions"])
  },
  methods: {
    getTitle(key) {
      return this.$i18n.t(key);
    },
    sendDialog() {},
    getTheDate(timestamp, format) {
      if (timestamp) {
        return getTheDate(timestamp / 1000, format);
      } else {
        return "__-__-__";
      }
    },
    updateTable() {
      this.newTransactions = [];
      getLevelNumber().then(res => {
        const maxLevelNumber = res.data.result,
          confirmedLevels = 6;
        this.transactions.forEach(async transaction => {
          if (transaction.hash != "" && transaction.status != "comfirmed") {
            var _new_transaction = {};
            _new_transaction = await getTransactionInfo(
              transaction.hash,
              res => {
                _new_transaction = transaction;
                if (res.result && res.result.levelNumber) {
                  var diffLevels = maxLevelNumber - res.result.levelNumber;
                  if (diffLevels >= confirmedLevels) {
                    _new_transaction["result"] = res.result;
                    _new_transaction["status"] = "comfirmed";
                    this.$store.dispatch("changeTransaction", _new_transaction);
                  } else if (diffLevels > 0) {
                    _new_transaction["result"] = res.result;
                    _new_transaction["status"] =
                      diffLevels + "/" + confirmedLevels;
                  }
                }
                return _new_transaction;
              }
            );
            if (_new_transaction) {
              this.newTransactions.push(_new_transaction);
            } else {
              this.newTransactions.unshift(transaction);
            }
          } else {
            this.newTransactions.push(transaction);
          }
        });
        this.newTransactions.sort(compare("desc", "create_time"));
      });
    }
  }
};
</script>
