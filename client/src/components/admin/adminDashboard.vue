<template>
  <div>
    <div v-if="$store.state.isAdminLoggedIn">
      <span class="headline">Dashboard</span>
      <div class="container">
        <v-img contain src="../../assets/images/dashboard.png"></v-img>
      </div>
    </div>
    <div v-else class="text-center red--text display-3 mt-10">
      <p>You do not have access, please login first</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>