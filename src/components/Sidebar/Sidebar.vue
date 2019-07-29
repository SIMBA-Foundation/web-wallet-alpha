<!-- Side Structure -->
<template>
  	<div class="sidebar" :class="sidebarSelectedFilter.class">
    	<vue-perfect-scrollbar class="scroll-area" :settings="settings">
        <v-toolbar flat class="transparent scroll-area navigation">
          <v-list>
				<app-logo></app-logo>
				<template v-for="(category, key) in menus">
					<template v-if="category.action !== null">
						<div :key="key">
							<v-list-tile
									:to="!category.exact ? `/${getCurrentAppLayoutHandler() + category.path}` : category.path"
									:key="category.path"
								>
									<v-list-tile-action>
										<i class="zmdi zmdi-caret-right"></i>
									</v-list-tile-action>
									<v-list-tile-content>
										<v-list-tile-title>
											<i class="mr-2 zmdi" :class="category.action"></i>
											<span>{{ textTruncate($t(category.title)) }}</span>
										</v-list-tile-title>
									</v-list-tile-content>
								</v-list-tile>
						</div>
					</template>
				</template>     
          </v-list>
        </v-toolbar>
    	</vue-perfect-scrollbar>
  	</div>
</template>

<script>
import { textTruncate, getCurrentAppLayout } from "Helpers/helpers";
import { mapGetters } from "vuex";
import AppLogo from "Components/AppLogo/AppLogo";

export default {
  data() {
    return {
      settings: {
        maxScrollbarLength: 160
      }
    };
  },
  components: {
    AppLogo
  },
  computed: {
    ...mapGetters(["sidebarSelectedFilter", "menus"])
  },
	mounted(){
		this.$store.dispatch("setActiveMenuGroup", this.$router);
	},
  methods: {
    textTruncate(text) {
      return textTruncate(text, 18);
    },
    getCurrentAppLayoutHandler() {
      return getCurrentAppLayout(this.$router);
    }
  }
};
</script>
