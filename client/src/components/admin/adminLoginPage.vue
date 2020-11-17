<template>
  <div>
    <div class="text-center mt-10" id="adminLoginForm">
      <div>
        <v-btn text dark id="helpBtn">
          <span class="text-capitalize">Help</span>
        </v-btn>
        <span class="display-2 grey--text mt-10">Customer Loyalty Program</span>
      </div>
      <v-form
        @submit.prevent
        enctype="multipart/form-data"
        class="white pa-10 pt-4 mt-10"
        id="loginPageLayout"
      >
        <v-layout row wrap>
          <v-flex xs12 md12>
            <span class="headline grey--text">Login</span>
            <div class="red--text" v-html="adminLoginError"></div>
            <span class="red--text" v-if="$store.state.isSessionExpiredIn"
              >Session expired. login again
            </span>
            <v-flex xs6>
              <v-select
                placeholder="Choose actor"
                v-model="selectedActor"
                :items="listOfActors"
              ></v-select>
            </v-flex>
          </v-flex>
          <v-flex xs10 md11>
            <v-text-field
              label="Username"
              prepend-icon="person"
              v-model="adminUserName"
            ></v-text-field>
          </v-flex>
          <v-flex xs10 md11>
            <v-text-field
              label="Password"
              :type="type"
              prepend-icon="lock"
              v-model="adminPassword"
            ></v-text-field>
          </v-flex>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <a class="mt-6" v-on="on" @click="showHidePassword">
                <v-icon id="showHidePassword">visibility</v-icon>
              </a>
            </template>
            <span>{{ toolTip }}</span>
          </v-tooltip>
         <v-checkbox
            class="ml-10"
            v-model="isStayLoggedInChecked"
          ></v-checkbox>
          <span class="mt-5">Stay logged in</span>
          <v-flex xs11 md11>
            <v-btn
              text
              dark
              class="primary pr-10 pl-10 mt-5"
              @click="adminLogin"
              :loading="loading"
              type="submit"
            >
              <span class="text-capitalize">Login</span>
            </v-btn>
          </v-flex>
          <v-flex xs11 md11>
            <v-btn text class="white mt-10 pl-10 pr-10">
              <a class="text-capitalize">Forgot password</a>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </div>
  </div>
</template>

<script>
import apiService from "../../services/apiService";
export default {
  data() {
    return {
      adminUserName: "",
      adminPassword: "",
      isStayLoggedInChecked: false,
      loading: false,
      adminLoginError: "",
      type: "password",
      toolTip: "Show password",
      selectedActor: "",
      listOfActors: ["Supper admin", "Branch admin"],
    };
  },
  created() {
    if (
      this.$store.state.isAdminLoggedIn &&
      this.$store.state.admin.actor == "supper"
    ) {
      this.$router.push({ name: "supperDashboard" });
    } else if (
      this.$store.state.isAdminLoggedIn &&
      this.$store.state.admin.actor == "branch"
    ) {
      this.$router.push({ name: "adminDashboard" });
    }
  },
  methods: {
    showHidePassword() {
      if (this.type == "password") {
        this.type = "text";
        this.toolTip = "Hide password";
      } else {
        this.type = "password";
        this.toolTip = "Show password";
      }
    },
    async adminLogin() {
      if (this.adminUserName == "" || this.adminPassword == "") {
        this.$store.dispatch("setSession", false);
        this.adminLoginError = "Please fill all the requirements";
      } else {
        try {
          if (this.selectedActor.length == 0) {
            this.adminLoginError = "Please select an actor";
          } else if (this.selectedActor == "Branch admin") {
            this.loading = true;
            const adminLoginResponse = await apiService.adminLogin({
              adminUserName: this.adminUserName,
              adminPassword: this.adminPassword,
              actor: "branch",
            });
            this.loading = false;
            this.$store.dispatch("setAdmin", adminLoginResponse.data.admin);
            this.$store.dispatch(
              "setAdminToken",
              adminLoginResponse.data.adminToken
            );
            this.$router.push({ name: "adminDashboard" });
            this.adminLoginError = "";
          } else if (this.selectedActor == "Supper admin") {
            this.loading = true;
            const adminLoginResponse = await apiService.adminLogin({
              adminUserName: this.adminUserName,
              adminPassword: this.adminPassword,
              actor: "supper",
            });
            this.loading = false;
            this.$store.dispatch("setAdmin", adminLoginResponse.data.admin);
            this.$store.dispatch(
              "setAdminToken",
              adminLoginResponse.data.adminToken
            );
            this.$router.push({ name: "supperDashboard" });

            this.adminLoginError = "";
          }
          this.$store.dispatch("setSession", false);

          window.scrollTo(0, 0);
        } catch (error) {
          this.loading = false;
          this.$store.dispatch("setSession", false);
          this.adminLoginError = error.response.data.error;
        }
      }
    },
  },
};
</script>

<style scoped>
#loginPageLayout {
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
  max-width: 600px;
  margin: auto;
}
#adminLoginForm {
  font-family: sans-serif;
}
#helpBtn {
  float: right;
  clear: right;
}
#showHidePassword:hover {
  color: rgb(59, 59, 241);
}
</style>
