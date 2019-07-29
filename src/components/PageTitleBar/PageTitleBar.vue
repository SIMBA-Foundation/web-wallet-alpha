<template>
	<v-container fluid>
		<app-card :fullBlock="true">
			<div class="breadcrumbs-box">
			<div class="breadcrumb-title">{{$t(pageTitle)}}</div>
			<div class="spacer"></div>
			<v-breadcrumbs :items="pageBreadcrumb" divider="">
				<v-breadcrumbs-item
					slot="item"
					slot-scope="{ item }"
					exact>
					<v-btn 
						small
						raised
						@click="breadcrumbAction(item.action)"
						:color="item.color">{{$t(item.title)}}</v-btn>
				</v-breadcrumbs-item>
			</v-breadcrumbs>
			</div>
			<new-transaction ref="newTransaction"> </new-transaction>
			<new-wallet ref="newWallet"> </new-wallet>
			<import-wallet ref="importWallet"> </import-wallet>
			
		</app-card>
	</v-container>

</template>

<script>
import NewTransaction from "Components/DialogBox/NewTransaction";
import NewWallet from "Components/DialogBox/NewWallet";
import ImportWallet from "Components/DialogBox/ImportWallet";
export default {
  components: {
    NewTransaction,
    NewWallet,
    ImportWallet
  },
  computed: {
    // computed property to get page breadcrumbs
    pageTitle() {
      return this.$breadcrumbs[0].meta.title;
    },
    pageBreadcrumb() {
      return this.$breadcrumbs[0].meta.breadcrumb;
    }
  },
  methods: {
    breadcrumbAction(action) {
      this[action].call();
    },
    newTransaction() {
      this.$refs.newTransaction.open();
    },
    newWallet() {
      this.$refs.newWallet.open();
    },
    importWallet() {
      this.$refs.importWallet.open();
    }
  }
};
</script>
