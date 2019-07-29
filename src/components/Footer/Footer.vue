<template>
   <div class="app-footer d-custom-flex justify-space-between align-items-center">
      <h6 class="mb-0 fw-normal">{{copyrightText}}</h6>
   </div>
</template>

<script>
import AppConfig from "Constants/AppConfig";

export default {
  data() {
    return {
      copyrightText: AppConfig.copyrightText
    };
  }
};
</script>
