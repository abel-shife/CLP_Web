<template>
  <div>
    <div v-if="$store.state.isAdminLoggedIn" class="white pt-3 pa-10">
      <p>
        <span class="headline">Levels/</span>
        <span class="grey--text">&nbsp;List of levels</span>

        <span
          v-if="getAllLevelsError"
          class="ml-10 pl-10 red--text text-center"
        >
          <br />{{ getAllLevelsError }}</span
        >
        <span
          v-if="levelRegistrationSuccess"
          class="ml-10 pl-10 green--text text-center"
        >
          <br />{{ levelRegistrationSuccess }}</span
        >
      </p>
      <div>
        <v-btn text :loading="levelLoading" v-if="levelLoading">
          <span>loading...</span>
        </v-btn>
        <v-data-table
          v-if="!levelLoading"
          :search="search"
          v-model="selectedLevel"
          :headers="headers"
          :items="allLevels"
          :single-select="singleSelect"
          item-key="levelName"
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
              <v-flex xs12 md3 v-if="selectedLevel.length > 1 && !singleSelect">
                <v-btn
                  text
                  :loading="deleteLevelLoading"
                  class="mt-5 grey lighten-4"
                  @click="deleteLevel(selectedLevel)"
                >
                  <span class="text-capitalize">
                    <v-icon class="red--text" left>delete</v-icon>Delete
                    selected levels
                  </span>
                </v-btn>
              </v-flex>
              <v-flex xs12 md3>
                <v-dialog v-model="levelDialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      text
                      class="ma-5 green pl-10 pr-10"
                      dark
                      @click="addLevelClicked"
                    >
                      <span class="text-capitalize">Add level</span>
                    </v-btn>
                  </template>
                  <v-card class="pa-10">
                    <v-card-title>
                      <span class="headline">{{ levelRegOrUpdateTitle }}</span>
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        class="grey lighten-4 pl-3 pr-3 ml-3 mt-2"
                        @click="levelDialog = false"
                      >
                        <span class="text-capitalize">
                          <v-icon left class="red--text">close</v-icon>close
                        </span>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <p class="red--text">
                        <span
                          v-if="levelRegistrationError"
                          class="ml-10 pl-10 red--text"
                          >{{ levelRegistrationError }}</span
                        >
                      </p>
                      <v-form v-model="checkValidity">
                        <v-layout row wrap justify-space-around>
                          <v-flex xs12 md12 class="pa-2">
                            <v-text-field
                              v-model="levelName"
                              :rules="levelNameValidation"
                              label="Level Name"
                              prepend-icon="title"
                            >
                            </v-text-field>
                            <br />
                            <v-textarea
                              auto-grow
                              rows="1"
                              row-height="10"
                              outlined
                              label="Level description"
                              v-model="levelDescription"
                              :rules="levelDescriptionValidation"
                              prepend-icon="note"
                            ></v-textarea>
                          </v-flex>
                          <v-flex xs12 md5>
                            <v-text-field
                              v-model="minimumRange"
                              label="Minimum range "
                              type="number"
                              min="0"
                              prepend-icon="event"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs12 md5>
                            <v-text-field
                              v-model="maximumRange"
                              label="Maximum range "
                              type="number"
                              min="0"
                              prepend-icon="event"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs12 md6 class="pa-2">
                            <v-btn
                              dark
                              text
                              class="primary pl-2 pr-2"
                              @click="saveLevel"
                              :loading="levelRegistrationLoading"
                            >
                              <span class="text-capitalize">Save Level</span>
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
                allLevels.indexOf(selectedLevel[0]) ==
                  allLevels.indexOf(item) && singleSelect
              "
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="blue--text mr-2"
                    @click="editLevel(item)"
                    >edit</v-icon
                  >
                </template>
                <span>Update level</span>
              </v-tooltip>

              <v-tooltip top dark>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="red--text ml-2"
                    @click="deleteLevel(item)"
                    >delete</v-icon
                  >
                </template>
                <span>Delete level</span>
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
    selectedLevel: [],
    allLevels: [],
    getAllLevelsError: "",
    levelRegistrationSuccess: "",
    levelRegistrationError: "",
    search: "",

    deleteLevelLoading: false,
    levelRegistrationLoading: false,
    levelLoading: false,
    singleSelect: true,
    levelDialog: false,
    checkValidity: false,

    levelRegOrUpdateTitle: "",
    whatToDo: "",

    levelName: "",
    levelDescription: "",
    minimumRange: "",
    maximumRange: "",

    levelNameValidation: [
      (v) =>
        /^[A-Za-z 0-9ሀ-ፐ]{2,32}/.test(v) ||
        "Invalid level name, it contains A-Z, a-z, , 0-9, ሀ-ፐ and minimum 2 and maximum 32 characters",
    ],
    levelDescriptionValidation: [
      (v) =>
        /^[a-zA-Zሀ-ፐ .]{2,250}/.test(v) ||
        "Invalide description, it contains a-z, A-Z,ሀ-ፐ, ,., with minumum 2 and maximum 250 characters.",
    ],
    headers: [
      {
        text: "Level Name",
        align: "start",
        value: "levelName",
      },
      {
        text: "Description",

        value: "levelDescription",
      },
      {
        text: "Min Range",

        value: "minimumRange",
      },
      {
        text: "Max Range",

        value: "maximumRange",
      },
      {
        text: "Customer At This Level",

        value: "noCustomers",
      },
      {
        text: "Actions",

        value: "actions",
      },
    ],
  }),

  methods: {
    addLevelClicked() {
      this.whatToDo = "add";
      this.levelRegOrUpdateTitle = "Add Level";
    },
    async saveLevel() {
      this.levelRegistrationSuccess = "";
      this.levelRegistrationError = "";
      if (this.checkValidity) {
        if (
          this.minimumRange > 0 &&
          this.maximumRange > 0 &&
          this.minimumRange <= this.maximumRange
        ) {
          if (this.whatToDo == "add") {
            this.levelRegistrationLoading = true;
            try {
              const levelResponsee = await apiService.saveLevel({
                levelName: this.levelName,
                levelDescription: this.levelDescription,
                maximumRange: this.maximumRange,
                minimumRange: this.minimumRange,
              });

              this.allLevels.push(levelResponsee.data.level);
              this.levelRegistrationSuccess = "Level registered successfully!";
              this.levelRegistrationError = "";
              this.levelRegistrationLoading = false;
              this.levelDialog = false;
            } catch (err) {
              this.levelRegistrationLoading = false;
              this.levelRegistrationSuccess = "";
              if (err.response) {
                if (err.response.data.error == 0) {
                  this.$store.dispatch("setAdmin", "");
                  this.$store.dispatch("setAdminToken", "");
                  this.$store.dispatch("setSession", false);
                  this.$router.push({ name: "adminLoginPage" });
                } else this.levelRegistrationError = err.response.data.error;
              } else
                this.levelRegistrationError = "Connection to server failed";
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
          this.levelRegistrationError =
            "Minimum and Maximum ranges must be positive And Minimum range must be less than Maximum range";
      } else
        this.levelRegistrationError = "Please fill all the required fields";

      setTimeout(() => {
        this.levelRegistrationError = "";
        this.levelRegistrationSuccess = "";
      }, 10000);
    },
    async deleteLevel(item) {
      const deleteConfirmation = confirm(
        "Are you sure you want to delete this(these) offer(s) ?"
      );
      if (deleteConfirmation) {
        let count = 0;
        try {
          if (this.singleSelect) {
            await apiService.deleteLevel({
              LevelId: item._id,
            });
            this.allLevels.splice(this.allLevels.indexOf(item), 1);
            this.selectedLevel = [];
            this.getAllLevelsError = "Level deleted";
          } else {
            this.deleteLevelLoading = true;
            let i = 0;
            for (i = 0; i < item.length; i++) {
              await apiService.deleteLevel({
                levelId: item[i]._id,
              });
              this.allLevels.splice(this.allLevels.indexOf(item[i]), 1);
              count++;
            }
            this.getAllLevelsError = count + " Levels deleted";
            this.deleteLevelLoading = false;

            this.selectedLevel = [];
            count = 0;
          }
        } catch (err) {
          this.deleteLevelLoading = false;
          if (err.response) {
            if (err.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else this.getAllLevelsError = err.response.data.error;
          } else this.getAllLevelsError = "Connection to server  failed";
        }
      }
      setTimeout(() => {
        this.getAllLevelsError = "";
      }, 5000);
    },

    editLevel(item) {
      this.levelDialog = true;
    },
  },
  async created() {
    this.getAllCustomersError = "";
    this.customerLoading = true;

    try {
      const response = await apiService.getAllCustomers();
      this.customerLoading = false;
      this.allCustomers = response.data.allCustomers;
    } catch (error) {
      this.customerLoading = false;
      if (error.response) {
        if (error.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        } else this.getAllCustomersError = error.response.data.error;
      } else this.getAllCustomersError = "Connection to server failed";
    }
    setTimeout(() => {
      this.getAllCustomersError = "";
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

