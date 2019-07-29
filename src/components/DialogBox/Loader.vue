<template>
<v-dialog
      v-model="dialog"
      persistent
      max-width="450"
    >
        <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Loading……
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    </template>
    

<script>
	export default {
		data() {
			return {
				dialog: true
			};
		}
	};
</script>