<template>
	<div class="horizontal-menu">
		<ul class="list-unstyled nav">
			<li class="nav-item" v-for="(category, key) in menus" :key="key">
        <template v-if="category.action !== null">
          <router-link 
					:to="!categories[key].exact ? `/${getCurrentAppLayoutHandler() + category.path}` : category.path"
					class="nav-link no-arrow" 
					activeClass="active"
				>
               <i :class="categories[key]"></i>
					<span class="menu-title">{{$t(key)}}</span>
            </router-link>
        </template>      

     		</li>
    </ul>
		<div class="ham-menu-sm d-none">
			<v-btn flat icon class="my-1 mx-3" @click="toggleHorizontalLayoutSidebar">
				<v-icon class="grey--text">menu</v-icon>
			</v-btn>
		</div>
    <div>
    </div>
  </div>
</template>

<script>
import { getCurrentAppLayout } from "Helpers/helpers";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      categories: {
        "message.mywallets": "zmdi zmdi-view-dashboard",
        "message.transactions": "zmdi zmdi-widgets",
        "message.settings": "zmdi zmdi-wrench"
      }
    };
  },
  computed: {
    ...mapGetters(["menus"])
  },
  methods: {
    toggleHorizontalLayoutSidebar() {
      this.$store.dispatch("toggleHorizontalLayoutSidebar", true);
    },
    getCurrentAppLayoutHandler() {
      return getCurrentAppLayout(this.$router);
    }
  },
  mounted() {
    const mainMenu = document.getElementsByClassName("nav-item");
    for (let i = 0; i < mainMenu.length; i++) {
      mainMenu[i].onclick = function() {
        for (let j = 0; j < mainMenu.length; j++) {
          if (mainMenu[j].classList.contains("nav-item-active")) {
            mainMenu[j].classList.remove("nav-item-active");
          }
        }
        this.classList.toggle("nav-item-active");
      };
    }
  }
};
</script>