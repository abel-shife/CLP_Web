<template>
  <div>
    <div
      v-if="
        $store.state.isAdminLoggedIn && $store.state.admin.actor == 'supper'
      "
      class=""
    >
      <p class="headline ml-10 pl-10">Dashboard</p>
      <div class="white">
        <v-layout raw wrap>
          <v-flex xs12 md5 class="green darken-3 ma-2 pt-3">
   <p class="white--text text-center headline">
              No of active customers
            </p>
            <v-divider class="white"> </v-divider>
            <p class="text-center white--text display-4 pt-10">253</p>
          </v-flex>
          <v-flex xs12 md5 class="blue darken-3 ma-2 pt-3">
            <p class="white--text text-center headline">
              New registered customers in this week
            </p>
            <v-divider class="white"> </v-divider>
            <p class="text-center white--text display-4 pt-10">102</p>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <div v-else class="text-center red--text headline mt-10">
      <p>
        You do not have access, please login first or supper admin has the only
        access to this resource
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>