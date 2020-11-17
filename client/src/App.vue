<template>
  <v-app>
    <adminNaveBar />
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import adminNaveBar from "./components/admin/adminNaveBar";
export default {
  components: {
    adminNaveBar,
  },
  name: "App",
  data() {
    return {};
  },
};
</script>
<style >
</style>
