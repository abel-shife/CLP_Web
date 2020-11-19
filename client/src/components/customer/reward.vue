<template>
  <div>
    <div v-if="$store.state.isAdminLoggedIn" class="white pt-3 pa-10">
      <p>
        <span class="headline">Rewards/</span>
        <span class="grey--text">&nbsp;List of rewards </span>
      </p>
      <p class="text-center">
        <span
          v-if="getAllRewardsError"
          class="ml-10 pl-10 red--text text-center"
        >
          {{ getAllRewardsError }} <br />
        </span>
        <span
          v-if="rewardRegisteringSuccess"
          class="ml-10 pl-10 green--text text-center"
          ><br />{{ rewardRegisteringSuccess }} <br />
        </span>
      </p>
      <div class="text-center">
        <v-btn text :loading="rewardLoading" v-if="rewardLoading">
          <span>loading...</span>
        </v-btn>
        <v-data-table
          v-if="!rewardLoading"
          :search="search"
          v-model="selectedReward"
          :headers="headers"
          :items="allRewards"
          :single-select="singleSelect"
          item-key="rewardName"
          show-select
          class="elevation-0"
        >
          <template v-slot:top>
            <v-layout row wrap justify-space-around>
              <v-flex xs12 md2>
                <v-switch
                  v-model="singleSelect"
                  label="Single select"
                  class="pa-3"
                ></v-switch>
              </v-flex>
              <v-flex
                xs12
                md3
                v-if="selectedReward.length > 1 && !singleSelect"
              >
                <v-btn
                  text
                  :loading="deleteRewardLoading"
                  class="mt-5 grey lighten-4"
                  @click="deleteReward(selectedReward)"
                >
                  <span class="text-capitalize">
                    <v-icon class="red--text" left>delete</v-icon>Delete
                    selected rewards
                  </span>
                </v-btn>
              </v-flex>
              <v-flex xs12 md3>
                <v-dialog v-model="rewardDialog" max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      text
                      class="ma-5 green pl-10 pr-10"
                      dark
                      @click="addRewardClicked"
                    >
                      <span class="text-capitalize">add reward</span>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ rewardRegOrUpdateTitle }}</span>
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        class="grey lighten-4 pl-10 pr-10 ml-6 mt-2"
                        @click="rewardDialog = false"
                      >
                        <span class="text-capitalize">
                          <v-icon left class="red--text">close</v-icon>close
                        </span>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <p class="text-center red--text">
                        <span
                          v-if="rewardRegistrationError"
                          class="ml-10 pl-10 red--text text-center"
                          >{{ rewardRegistrationError }}</span
                        >
                      </p>
                      <v-form v-model="checkValidity">
                        <v-layout row wrap justify-space-around>
                          <v-flex xs12 md5 class="pa-2">
                            <v-text-field
                              v-model="rewardName"
                              :rules="rewardNameValidation"
                              label="Reward Name"
                              prepend-icon="title"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs12 md5 class="pa-2">
                            <v-textarea
                              auto-grow
                              rows="1"
                              row-height="10"
                              outlined
                              label="Reward description"
                              v-model="rewardDescription"
                              :rules="rewardDescriptionValidation"
                              prepend-icon="note"
                            ></v-textarea>
                          </v-flex>
                          <v-flex xs12 md5 class="pa-2">
                            <v-text-field
                              v-model="minPoint"
                              label="Minimum Point"
                              type="number"
                              min="0"
                              prepend-icon="event"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs12 md5 class="pa-2">
                            <v-select
                              denses
                              label="Choose Level"
                              v-model="selectedLevel"
                              :items="levels"
                              prepend-icon="signal_cellular_alt"
                            ></v-select>
                          </v-flex>
                          <v-flex xs12 md5 class="pa-2">
                            <v-text-field
                              v-model="expiryDate"
                              label="Duration after reached"
                              type="number"
                              min="0"
                              prepend-icon="event"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs12 md5 class="pa-2">
                            <v-btn
                              dark
                              text
                              class="primary"
                              @click="saveReward"
                              :loading="rewardRegistrationLoading"
                            >
                              <span class="text-capitalize">Save Reward</span>
                            </v-btn>
                          </v-flex>
                        </v-layout>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-flex>
              <v-flex xs12 md3 class="mr-5 ml-5" offest-2>
                <v-text-field
                  class="mt-2"
                  v-model="search"
                  outlined
                  label="Search"
                  append-icon="search"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </template>
          <template v-slot:[`item.rewardDescription`]="{ item }">
            <p class="d-inline-block text-truncate" style="max-width: 200px">
              {{ item.rewardDescription }}
            </p>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div
              v-if="
                allRewards.indexOf(selectedReward[0]) ==
                  allRewards.indexOf(item) && singleSelect
              "
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="blue--text mr-2"
                    @click="editReward(item)"
                    >edit</v-icon
                  >
                </template>
                <span>Update reward</span>
              </v-tooltip>

              <v-tooltip top dark>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="red--text ml-2"
                    @click="deleteReward(item)"
                    >delete</v-icon
                  >
                </template>
                <span>Delete reward</span>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </div>
    </div>
    <div v-else class="text-center red--text display-3 mt-10">
      <p>You do not have access, please login first</p>
    </div>
  </div>
</template>

<script>
import apiService from "../../services/apiService";
export default {
  data: () => ({
    selectedReward: [],
    allRewards: [],
    getAllRewardsError: "",
    search: "",
    deleteRewardLoading: false,
    rewardLoading: false,
    singleSelect: true,
    rewardDialog: false,
    checkValidity: false,
    rewardRegistrationLoading: false,
    rewardRegOrUpdateTitle: "",
    whatToDo: "",
    rewardRegistrationError: "",
    rewardRegisteringSuccess: "",
    selectedLevel: "",
    selectedRewardItem: "",

    rewardName: "",
    rewardDescription: "",
    minPoint: "",
    expiryDate: "",

    levels: ["Gold", "Bronze", "silver", "Diamend", "All Levels"],
    headers: [
      {
        text: " Name",
        align: "start",
        value: "rewardName",
      },
      {
        text: "Description",

        value: "rewardDescription",
      },
      {
        text: "Point",

        value: "minPoint",
      },
      {
        text: "Level",

        value: "level",
      },
      {
        text: "Expiry Date Duration in days",
        align: "center",
        value: "expiryDate",
      },

      {
        text: "Actions",

        value: "actions",
      },
    ],
    rewardNameValidation: [
      (v) =>
        /^[a-zA-Zሀ-ፐ .]{2,32}/.test(v) ||
        "Invalide name, reward name contains a-z, A-Z,ሀ-ፐ, ,., with minumum 2 and maximum 32 characters.",
    ],
    rewardDescriptionValidation: [
      (v) =>
        /^[a-zA-Zሀ-ፐ .]{2,250}/.test(v) ||
        "Invalide description, it contains a-z, A-Z,ሀ-ፐ, ,., with minumum 2 and maximum 250 characters.",
    ],
  }),

  methods: {
    async saveReward() {
      this.rewardRegisteringSuccess = "";
      this.rewardRegistrationError = "";
      if (this.checkValidity) {
        if (this.minPoint > 0 && this.expiryDate > 0) {
          if (this.whatToDo == "add") {
            this.rewardRegistrationLoading = true;
            try {
              const rewardResponsee = await apiService.saveReward({
                rewardName: this.rewardName,
                rewardDescription: this.rewardDescription,
                minPoint: this.minPoint,
                level: this.selectedLevel,
                expiryDate: this.expiryDate,
              });

              this.allRewards.push(rewardResponsee.data.reward);
              this.rewardRegisteringSuccess = "Reward registered successfully!";
              this.rewardRegistrationError = "";
              this.rewardRegistrationLoading = false;
              this.rewardDialog = false;
            } catch (err) {
              this.rewardRegistrationLoading = false;
              this.rewardRegisteringSuccess = "";
              if (err.response) {
                if (err.response.data.error == 0) {
                  this.$store.dispatch("setAdmin", "");
                  this.$store.dispatch("setAdminToken", "");
                  this.$store.dispatch("setSession", false);
                  this.$router.push({ name: "adminLoginPage" });
                } else this.rewardRegistrationError = err.response.data.error;
              } else
                this.rewardRegistrationError = "Connection to server failed";
            }
          } else if (this.whatToDo == "update") {
            this.rewardRegistrationLoading = true;
            try {
              await apiService.updateReward({
                rewardName: this.rewardName,
                rewardDescription: this.rewardDescription,
                minPoint: this.minPoint,
                level: this.selectedLevel,
                expiryDate: this.expiryDate,
                rewardId: this.selectedRewardItem._id,
              });

              Object.assign(
                this.allRewards[
                  this.allRewards.indexOf(this.selectedRewardItem)
                ],
                {
                  rewardName: this.rewardName,
                  rewardDescription: this.rewardDescription,
                  minPoint: this.minPoint,
                  level: this.selectedLevel,
                  expiryDate: this.expiryDate,
                }
              );
              this.rewardRegisteringSuccess = "Reward updated successfully!";
              this.rewardRegistrationError = "";
              this.rewardRegistrationLoading = false;
              this.rewardDialog = false;
            } catch (err) {
              this.rewardRegistrationLoading = false;
              this.rewardRegisteringSuccess = "";
              if (err.response) {
                if (err.response.data.error == 0) {
                  this.$store.dispatch("setAdmin", "");
                  this.$store.dispatch("setAdminToken", "");
                  this.$store.dispatch("setSession", false);
                  this.$router.push({ name: "adminLoginPage" });
                } else this.rewardRegistrationError = err.response.data.error;
              } else
                this.rewardRegistrationError = "Connection to server failed";
            }
          }
        } else
          this.rewardRegistrationError = "Point and duration must be positive";
      } else
        this.rewardRegistrationError = "Please fill all the required fields";

      setTimeout(() => {
        this.rewardRegistrationError = "";
        this.rewardRegisteringSuccess = "";
      }, 5000);
    },

    async deleteReward(item) {
      const deleteConfirmation = confirm(
        "Are you sure you want to delete this(these) reward(s) ?"
      );
      if (deleteConfirmation) {
        let count = 0;
        try {
          if (this.singleSelect) {
            await apiService.deleteReward({
              rewardId: item._id,
            });
            this.allRewards.splice(this.allRewards.indexOf(item), 1);
            this.selectedReward = [];
            this.getAllRewardsError = "Reward deleted";
          } else {
            this.deleteRewardLoading = true;
            let i = 0;
            for (i = 0; i < item.length; i++) {
              await apiService.deleteReward({
                rewardId: item[i]._id,
              });
              this.allRewards.splice(this.allRewards.indexOf(item[i]), 1);
              count++;
            }
            this.getAllRewardsError = count + " Rewards deleted";
            this.deleteRewardLoading = false;

            this.selectedReward = [];
            count = 0;
          }
        } catch (err) {
          this.deleteRewardLoading = false;
          if (err.response) {
            if (err.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else this.getAllRewardsError = err.response.data.error;
          } else this.getAllRewardsError = "Connection to server  failed";
        }
      }
      setTimeout(() => {
        this.getAllRewardsError = "";
      }, 5000);
    },

    editReward(item) {
      this.rewardDialog = true;
      this.whatToDo = "update";
      this.rewardRegOrUpdateTitle = "Update reward";
      this.selectedRewardItem = item;

      this.rewardName = item.rewardName;
      this.rewardDescription = item.rewardDescription;
      this.minPoint = item.minPoint;
      this.selectedLevel = item.level;
      this.expiryDate = item.expiryDate;
    },

    addRewardClicked() {
      this.whatToDo = "add";
      this.rewardRegOrUpdateTitle = "Reward registration";
    },
  },
  async created() {
    this.getAllRewardsError = "";
    this.rewardLoading = true;

    try {
      const response = await apiService.getAllRewards();
      this.rewardLoading = false;
      this.allRewards = response.data.allRewards;
    } catch (error) {
      this.rewardLoading = false;
      if (error.response) {
        if (error.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        } else this.getAllRewardsError = error.response.data.error;
      } else this.getAllRewardsError = "Connection to server failed";
    }
    setTimeout(() => {
      this.getAllRewardsError = "";
    }, 5000);
  },
};
</script>

<style scoped>
.v-data-table {
  font-size: 24px;
  border: 1px solid rgb(223, 217, 217);
}
</style>

