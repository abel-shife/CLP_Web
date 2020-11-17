<template>
  <div>
    <div v-if="$store.state.isAdminLoggedIn" class="white pt-3 pa-10">
      <p>
        <span class="headline">Rewards/</span>
        <span class="grey--text">&nbsp;List of rewards</span>
        <br />
        <span
          v-if="getAllRewardsError"
          class="ml-10 pl-10 red--text text-center"
          >{{ getAllRewardsError }}</span
        >
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
          item-key="name"
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
                <v-dialog v-model="rewardDialog" max-width="800px">
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
                          <v-flex xs12 md4 class="pa-2">
                            <v-text-field
                              v-model="rewardName"
                              :rules="rewardNameValidation"
                              label="Reward Name"
                              prepend-icon="title"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs12 md4 class="pa-2">
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
                          <v-flex xs12 md4 class="pa-2">
                            <v-select
                              denses
                              label="Choose service name"
                              v-model="selectedServiceName"
                              :items="allServiceNames"
                              @change="getServicePrice"
                              prepend-icon="book"
                            ></v-select>
                          </v-flex>
                          <v-flex xs12 md4 class="pa-2">
                            <v-text-field
                              v-model="servicePrice"
                              label="Service price"
                              prepend-icon="money"
                              :disabled="true"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs12 md4 class="pa-2">
                            <v-text-field
                              v-model="discountRate"
                              label="Write discount rate(%) 0-100 %"
                              type="number"
                              min="0"
                              max="100"
                              prepend-icon="arrow_downward"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs12 md4 class="pa-2">
                            <p
                              class="text-center mt-5 red--text"
                              style="font-size: 20px"
                              v-if="servicePrice"
                            >
                              Price after discount:
                              {{
                                servicePrice -
                                (discountRate / 100) * servicePrice
                              }}
                            </p>
                          </v-flex>
                          <v-flex xs12 md4 class="pa-2">
                            <v-menu
                              v-model="startMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="startDate"
                                  label="Start date"
                                  prepend-icon="event"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="startDate"
                                @input="startMenu = false"
                                :allowed-dates="allowedDates"
                              ></v-date-picker>
                            </v-menu>
                          </v-flex>
                          <v-flex xs12 md4 class="pa-2">
                            <v-menu
                              v-model="endMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="endDate"
                                  label="End date"
                                  prepend-icon="event"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="endDate"
                                @input="endMenu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-flex>

                          <v-flex xs12 md4 class="pa-2">
                            <v-text-field
                              v-model="limitedNumberPeople"
                              label="Limit number of peoples"
                              type="number"
                              min="0"
                              prepend-icon="wc"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs12 md4 class="pa-2">
                            <v-btn
                              dark
                              text
                              class="primary"
                              @click="saveOffer"
                              :loading="offerRegistrationLoading"
                            >
                              <span class="text-capitalize">Save Offer</span>
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
          <template v-slot:[`item.actions`]="{ item }">
            <div
              v-if="
                allCustomers.indexOf(selectedCustomer[0]) ==
                  allCustomers.indexOf(item) && singleSelect
              "
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="blue--text mr-2"
                    @click="editCustomer(item)"
                    >edit</v-icon
                  >
                </template>
                <span>Update customer</span>
              </v-tooltip>

              <v-tooltip top dark>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="red--text ml-2"
                    @click="deleteCustomer(item)"
                    >delete</v-icon
                  >
                </template>
                <span>Delete customer</span>
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
    rewardRegOrUpdateTitle: "",
    whatToDo: "",
    rewardRegistrationError: "",

    rewardName: "",
    rewardDescription: "",

    headers: [
      {
        text: " Name",
        align: "start",
        value: "name",
      },
      {
        text: "Description",

        value: "rewardDescription",
      },
      {
        text: "Point",

        value: "point",
      },
      {
        text: "Level",

        value: "level",
      },
      {
        text: "Expiry Date",

        value: "expityDate",
      },
      {
        text: "Code",

        value: "code",
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
    async deleteReward(item) {
      const deleteConfirmation = confirm(
        "Are you sure you want to delete this(these) offer(s) ?"
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
      this.customerDialog = true;
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
      this.customerLoading = false;
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

