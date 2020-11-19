<template>
  <div>
    <div class="container white pt-3" v-if="$store.state.isAdminLoggedIn">
      <p>
        <span class="headline">Earning point rules</span>
      </p>
      <div class="text-center">
        <v-layout row wrap justify-space-around>
          <v-flex xs12 md6 class>
            <span class="text-center mb-2">Purchase rules</span>
            <p v-if="addingPointRuleSuccess" class="green--text text-center">
              {{ addingPointRuleSuccess }}
            </p>
            <p v-if="addingPointRuleError" class="red--text text-center">
              {{ addingPointRuleError }}
            </p>
            <p v-if="getPurchaseRuleError" class="red--text text-center">
              {{ getPurchaseRuleError }}
            </p>
            <v-btn
              text
              :loading="purchaseRuleLoading"
              v-if="purchaseRuleLoading"
            >
              <span>loading...</span>
            </v-btn>
            <v-data-table
              v-if="!purchaseRuleLoading"
              id="pointRuleTable"
              show-select
              :headers="headers"
              :items="allPurchasePointRules"
              :search="purchaseSearch"
              item-key="serviceName"
              :single-select="purchaseSingleSelect"
              class="ma-1 elevation-0"
              v-model="selectedPurchasePoint"
            >
              <template v-slot:top>
                <v-layout row wrap justify-space-around>
                  <v-flex xs12 md2>
                    <v-switch
                      v-model="purchaseSingleSelect"
                      label="Single select"
                      class="pa-3"
                    ></v-switch>
                  </v-flex>
                  <v-flex
                    xs12
                    md2
                    v-if="
                      selectedPurchasePoint.length > 1 && !purchaseSingleSelect
                    "
                  >
                    <v-btn
                      text
                      :loading="purchasePointDeleteLoading"
                      class="mt-5 grey lighten-4"
                      @click="deletePurchasePoint(selectedPurchasePoint)"
                    >
                      <span class="text-capitalize">
                        <v-icon class="red--text" left>delete</v-icon>Delete
                      </span>
                    </v-btn>
                  </v-flex>

                  <v-flex xs12 md2 class="mt-5">
                    <v-dialog max-width="400px" v-model="purchaseDialog">
                      <template v-slot:activator="{ on }">
                        <v-btn
                          dark
                          v-on="on"
                          text
                          class="green"
                          @click="getAllServiceName"
                        >
                          <span class="text-capitalize">Add</span>
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-center">{{
                            purchasePointRegOrUpdateTitle
                          }}</span>
                        </v-card-title>
                        <v-card-text>
                          <p class="red--text text-center">
                            {{ getAllServiceError }}
                          </p>
                          <p class="green--text text-center">
                            {{ addingPointRuleSuccess }}
                          </p>
                          <p class="red--text text-center">
                            {{ addingPointRuleError }}
                          </p>
                          <v-layout row wrap class="pl-10 pr-10">
                            <v-flex xs12 md12>
                              <v-select
                                v-if="whatToDo == 'add'"
                                :items="allServiceNames"
                                label="Choose service"
                                v-model="selectedService"
                                @change="getServicePrice"
                              ></v-select>
                              <p
                                v-if="servicePrice"
                                class="red--text text-center"
                              >
                                Service Price: {{ servicePrice }} Birr
                              </p>
                              <br />
                              <v-text-field
                                v-model="purchasePoint"
                                label="Give purchase point"
                                type="number"
                                min="0"
                              >
                              </v-text-field>
                              <br />
                              <div class="text-center">
                                <v-btn
                                  dark
                                  text
                                  class="primary"
                                  @click="savePurchasePoint"
                                  :loading="purchasePointAddLoading"
                                >
                                  <span class="text-capitalize">Set point</span>
                                </v-btn>
                              </div>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs12 md3 class="mr-5 ml-5" offest-2>
                    <v-text-field
                      class="mt-2"
                      v-model="purchaseSearch"
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
                    allPurchasePointRules.indexOf(selectedPurchasePoint[0]) ==
                      allPurchasePointRules.indexOf(item) &&
                    purchaseSingleSelect
                  "
                >
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        v-on="on"
                        small
                        class="blue--text mr-2"
                        @click="editPurchasePoint(item)"
                        >edit</v-icon
                      >
                    </template>
                    <span>Update purchase point rule</span>
                  </v-tooltip>

                  <v-tooltip top dark>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        v-on="on"
                        small
                        class="red--text ml-2"
                        @click="deletePurchasePoint(item)"
                        >delete</v-icon
                      >
                    </template>
                    <span>Delete purchase point rule</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-flex>
          <v-flex xs12 md6 class>
            <span class="text-center mb-2">Other rules</span><br />
            <p
              v-if="addingOtherPointRuleSuccess"
              class="green--text text-center"
            >
              {{ addingOtherPointRuleSuccess }}
            </p>
            <p v-if="getOtherPointRuleError" class="red--text text-center">
              {{ getOtherPointRuleError }}
            </p>
            <v-btn text :loading="otherRuleLoading" v-if="otherRuleLoading">
              <span>loading...</span>
            </v-btn>
            <v-data-table
              v-if="!otherRuleLoading"
              id="pointRuleTable"
              show-select
              :headers="otherHeaders"
              :items="otherPointRules"
              :search="otherSearch"
              item-key="cause"
              :single-select="othersSingleSelect"
              class="ma-1 elevation-0"
              v-model="otherSelectedPointRules"
            >
              <template v-slot:top>
                <v-layout row wrap justify-space-around>
                  <v-flex xs12 md2>
                    <v-switch
                      v-model="othersSingleSelect"
                      label="Select"
                    ></v-switch>
                  </v-flex>
                  <v-flex
                    xs12
                    md2
                    v-if="
                      otherSelectedPointRules.length > 1 && !othersSingleSelect
                    "
                  >
                    <v-btn
                      text
                      :loading="otherPointDeleteLoading"
                      class="mt-5 grey lighten-4"
                      @click="deleteOtherPoint(otherSelectedPointRules)"
                    >
                      <span class="text-capitalize">
                        <v-icon class="red--text" left>delete</v-icon>Delete
                      </span>
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 md2 class="mt-5">
                    <v-dialog max-width="400px" v-model="otherRuleDialog">
                      <template v-slot:activator="{ on }">
                        <v-btn
                          dark
                          v-on="on"
                          text
                          class="green"
                          @click="otherAddClicked"
                        >
                          <span class="text-capitalize">Add</span>
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-center">{{
                            otherPointRegOrUpdateTitle
                          }}</span>
                        </v-card-title>
                        <v-card-text>
                          <p class="green--text text-center">
                            {{ addingOtherPointRuleSuccess }}
                          </p>
                          <p class="red--text text-center">
                            {{ addingOtherPointRuleError }}
                          </p>
                          <v-layout row wrap class="pl-10 pr-10">
                            <v-flex xs12 md12>
                              <v-select
                                v-if="whatToDoOther == 'add'"
                                :items="listOfOtherRules"
                                label="Choose cause"
                                v-model="selectedOtherRule"
                              ></v-select>
                              <v-text-field
                                v-model="otherRulePoint"
                                label="Give point"
                                type="number"
                                min="0"
                              >
                              </v-text-field>
                              <div class="text-center">
                                <v-btn
                                  dark
                                  text
                                  class="primary"
                                  @click="saveOtherPoint"
                                  :loading="otherPointAddLoading"
                                >
                                  <span class="text-capitalize">Set point</span>
                                </v-btn>
                              </div>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs12 md3 class="mr-5 ml-5" offest-2>
                    <v-text-field
                      class="mt-2"
                      v-model="otherSearch"
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
                    otherPointRules.indexOf(otherSelectedPointRules[0]) ==
                      otherPointRules.indexOf(item) && othersSingleSelect
                  "
                >
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        v-on="on"
                        small
                        class="blue--text mr-2"
                        @click="editOtherPoint(item)"
                        >edit</v-icon
                      >
                    </template>
                    <span>Update other point rule</span>
                  </v-tooltip>

                  <v-tooltip top dark>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        v-on="on"
                        small
                        class="red--text ml-2"
                        @click="deleteOtherPoint(item)"
                        >delete</v-icon
                      >
                    </template>
                    <span>Delete other point rule</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
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
    selectedService: "",
    //  selectedType: "",
    allServiceNames: [],
    getAllServices: [],
    allPurchasePointRules: [],

    selectedPurchasePoint: [],
    getAllServiceError: "",
    purchaseItemToUpdate: "",
    servicePrice: "",
    purchasePoint: "",
    addingPointRuleError: "",
    addingPointRuleSuccess: "",
    purchasePointAddLoading: false,
    purchaseRuleLoading: false,
    purchasePointDeleteLoading: false,
    getPurchaseRuleError: "",
    purchaseSearch: "",
    purchasePointRegOrUpdateTitle: "",
    whatToDo: "",
    purchaseDialog: false,
    purchaseSingleSelect: true,

    otherSearch: "",
    otherPointRules: [],
    othersSingleSelect: true,
    otherRuleDialog: false,
    otherPointRegOrUpdateTitle: "",
    addingOtherPointRuleSuccess: "",
    addingOtherPointRuleError: "",
    selectedOtherRule: "",
    otherRulePoint: "",
    otherPointAddLoading: false,
    otherPointDeleteLoading: false,
    otherRuleLoading: false,
    whatToDoOther: "",
    getOtherPointRuleError: "",
    otherSelectedPointRules: [],
    otherSelectedItem: "",

    listOfOtherRules: ["Sign Up", "Refer to Friend", "Share"],
    headers: [
      {
        text: "Causes",
        align: "left",
        value: "serviceName",
      },
      { text: "Service Price", value: "servicePrice" },
      { text: "Points", value: "point" },
      { text: "Actions", value: "actions" },
    ],
    otherHeaders: [
      {
        text: "Causes",
        align: "left",
        value: "cause",
      },

      { text: "Points", value: "point" },
      { text: "Actions", value: "actions" },
    ],
  }),

  methods: {
    otherAddClicked() {
      this.whatToDoOther = "add";
      this.otherPointRegOrUpdateTitle = "Add other earning point rule";
    },
    async getAllServiceName() {
      this.whatToDo = "add";
      this.purchasePointRegOrUpdateTitle = "Purchase point rule registration";
      this.getAllServiceError = "";
      try {
        const response = await apiService.getAllServices();
        this.getAllServices = response.data.allServices;
        let count = 0;
        for (count = 0; count < this.getAllServices.length; count++) {
          this.allServiceNames.push(this.getAllServices[count].serviceName);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.data.error == 0) {
            this.$store.dispatch("setAdmin", "");
            this.$store.dispatch("setAdminToken", "");
            this.$store.dispatch("setSession", false);
            this.$router.push({ name: "adminLoginPage" });
          } else {
            this.getAllServiceError = error.response.data.error;
          }
        } else this.getAllServiceError = "Connection to server failed";
        setTimeout(() => {
          this.getAllServiceError = "";
        }, 10000);
      }
    },

    getServicePrice() {
      let index = 0;
      for (index = 0; index < this.getAllServices.length; index++) {
        if (this.selectedService == this.getAllServices[index].serviceName) {
          this.servicePrice = this.getAllServices[index].servicePrice;
          // this.serviceImage = this.getAllServices[index].serviceImage;
          // this.selectedServiceCatagory = this.getAllServices[
          //   index
          // ].selectedServiceCatagory;
          // this.selectedServiceSubCatagory = this.getAllServices[
          //   index
          // ].selectedServiceSubCatagory;
          break;
        }
      }
    },

    async savePurchasePoint() {
      if (this.selectedService == "" || this.purchasePoint == "") {
        this.addingPointRuleError = "Please fill all the requirements";
      } else {
        if (this.whatToDo == "add") {
          this.purchasePointAddLoading = true;
          try {
            const response = await apiService.addPurchasePointRules({
              serviceName: this.selectedService,
              servicePrice: this.servicePrice,
              point: this.purchasePoint,
            });
            this.purchasePointAddLoading = false;
            this.addingPointRuleError = "";
            this.allPurchasePointRules.push(response.data.point);
            this.addingPointRuleSuccess = "Purchase point rule  added";
            this.purchaseDialog = false;
          } catch (error) {
            this.addingPointRuleSuccess = "";
            this.purchasePointAddLoading = false;
            if (error.response) {
              if (error.response.data.error == 0) {
                this.$store.dispatch("setAdmin", "");
                this.$store.dispatch("setAdminToken", "");
                this.$store.dispatch("setSession", false);
                this.$router.push({ name: "adminLoginPage" });
              } else {
                this.addingPointRuleError = error.response.data.error;
              }
            } else this.addingPointRuleError = "Connection to server failed";
          }
        } else if (this.whatToDo == "update") {
          this.purchasePointAddLoading = true;
          try {
            await apiService.updatePurchasePointRules({
              purchasePointId: this.purchaseItemToUpdate._id,
              point: this.purchasePoint,
            });
            this.purchasePointAddLoading = false;
            this.addingPointRuleError = "";

            Object.assign(
              this.allPurchasePointRules[
                this.allPurchasePointRules.indexOf(this.purchaseItemToUpdate)
              ],
              {
                serviceName: this.selectedService,
                servicePrice: this.servicePrice,
                point: this.purchasePoint,
              }
            );

            this.addingPointRuleSuccess = "Purchase point rule updated";
            this.purchaseDialog = false;
          } catch (error) {
            this.addingPointRuleSuccess = "";
            this.purchasePointAddLoading = false;
            if (error.response) {
              if (error.response.data.error == 0) {
                this.$store.dispatch("setAdmin", "");
                this.$store.dispatch("setAdminToken", "");
                this.$store.dispatch("setSession", false);
                this.$router.push({ name: "adminLoginPage" });
              } else {
                this.addingPointRuleError = error.response.data.error;
              }
            } else this.addingPointRuleError = "Connection to server failed";
          }
        }
      }
      setTimeout(() => {
        this.addingPointRuleError = "";
        this.addingPointRuleSuccess = "";
        this.getAllServiceError = "";
      }, 10000);
    },
    async saveOtherPoint() {
      if (this.selectedOtherRule == "" || this.otherRulePoint == "") {
        this.addingOtherPointRuleError = "Please fill all the requirements";
      } else {
        if (this.whatToDoOther == "add") {
          this.otherPointAddLoading = true;
          try {
            const response = await apiService.addOtherPointRules({
              cause: this.selectedOtherRule,
              point: this.otherRulePoint,
            });
            this.otherPointAddLoading = false;
            this.addingOtherPointRuleError = "";
            this.otherPointRules.push(response.data.point);
            this.addingOtherPointRuleSuccess = "Other point rule  added";
            this.otherRuleDialog = false;
          } catch (error) {
            this.addingOtherPointRuleSuccess = "";
            this.otherPointAddLoading = false;
            if (error.response) {
              if (error.response.data.error == 0) {
                this.$store.dispatch("setAdmin", "");
                this.$store.dispatch("setAdminToken", "");
                this.$store.dispatch("setSession", false);
                this.$router.push({ name: "adminLoginPage" });
              } else {
                this.addingOtherPointRuleError = error.response.data.error;
              }
            } else
              this.addingOtherPointRuleError = "Connection to server failed";
          }
        } else if (this.whatToDoOther == "update") {
          this.otherPointAddLoading = true;
          try {
            await apiService.updateOtherPointRules({
              otherPointId: this.otherSelectedItem._id,
              point: this.otherRulePoint,
            });
            this.otherPointAddLoading = false;
            this.addingOtherPointRuleError = "";

            Object.assign(
              this.otherPointRules[
                this.otherPointRules.indexOf(this.otherSelectedItem)
              ],
              {
                cause: this.selectedOtherRule,
                point: this.otherRulePoint,
              }
            );

            this.addingOtherPointRuleSuccess = "Purchase point rule updated";
            this.otherRuleDialog = false;
          } catch (error) {
            this.addingOtherPointRuleSuccess = "";
            this.otherPointAddLoading = false;
            if (error.response) {
              if (error.response.data.error == 0) {
                this.$store.dispatch("setAdmin", "");
                this.$store.dispatch("setAdminToken", "");
                this.$store.dispatch("setSession", false);
                this.$router.push({ name: "adminLoginPage" });
              } else {
                this.addingOtherPointRuleError = error.response.data.error;
              }
            } else
              this.addingOtherPointRuleError = "Connection to server failed";
          }
        }
      }
      setTimeout(() => {
        this.addingOtherPointRuleSuccess = "";
        this.addingOtherPointRuleError = "";
      }, 10000);
    },

    editPurchasePoint(item) {
      this.whatToDo = "update";
      this.purchasePointRegOrUpdateTitle = "Update Purchase point rule ";
      this.purchaseDialog = true;
      this.purchaseItemToUpdate = item;

      this.purchasePoint = item.point;
      this.servicePrice = item.servicePrice;
      this.selectedService = item.serviceName;
    },
    editOtherPoint(item) {
      this.whatToDoOther = "update";
      this.otherPointRegOrUpdateTitle = "Update other point rule ";
      this.otherSelectedItem = item;
      this.otherRuleDialog = true;

      this.selectedOtherRule = item.cause;
      this.otherRulePoint = item.point;
    },

    async deletePurchasePoint(item) {
      const deleteConfirmation = confirm(
        "Are you sure you want to delete this(these) purchase point rule(s) ?"
      );
      if (deleteConfirmation) {
        let count = 0;
        try {
          if (this.purchaseSingleSelect) {
            await apiService.deletePurchasePoint({
              purchasePointId: item._id,
            });
            this.allPurchasePointRules.splice(
              this.allPurchasePointRules.indexOf(item),
              1
            );
            this.selectedPurchasePoint = [];
            this.getPurchaseRuleError = " Purchase point rule deleted";
          } else {
            this.purchasePointDeleteLoading = true;
            let i = 0;
            for (i = 0; i < item.length; i++) {
              await apiService.deletePurchasePoint({
                purchasePointId: item[i]._id,
              });
              this.allPurchasePointRules.splice(
                this.allPurchasePointRules.indexOf(item[i]),
                1
              );
              count++;
            }
            this.getPurchaseRuleError =
              count + "  Purchase point rules were deleted";
            this.purchasePointDeleteLoading = false;

            this.selectedPurchasePoint = [];
            count = 0;
          }
        } catch (err) {
          this.purchasePointDeleteLoading = false;
          if (err.response) {
            if (err.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else this.getPurchaseRuleError = err.response.data.error;
          } else this.getPurchaseRuleError = "Connection to server  failed";
        }
      }
      setTimeout(() => {
        this.getPurchaseRuleError = "";
      }, 5000);
    },

    async deleteOtherPoint(item) {
      const deleteConfirmation = confirm(
        "Are you sure you want to delete this(these) other point rule(s) ?"
      );
      if (deleteConfirmation) {
        let count = 0;
        try {
          if (this.othersSingleSelect) {
            await apiService.deleteOtherPoint({
              otherPointId: item._id,
            });
            this.otherPointRules.splice(this.otherPointRules.indexOf(item), 1);
            this.otherSelectedPointRules = [];
            this.getOtherPointRuleError = "Other point rule deleted";
          } else {
            this.otherPointDeleteLoading = true;
            let i = 0;
            for (i = 0; i < item.length; i++) {
              await apiService.deleteOtherPoint({
                otherPointId: item[i]._id,
              });
              this.otherPointRules.splice(
                this.otherPointRules.indexOf(item[i]),
                1
              );
              count++;
            }
            this.getOtherPointRuleError =
              count + "  Other point rules were deleted";
            this.otherPointDeleteLoading = false;

            this.otherSelectedPointRules = [];
            count = 0;
          }
        } catch (err) {
          this.otherPointDeleteLoading = false;
          if (err.response) {
            if (err.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else this.getOtherPointRuleError = err.response.data.error;
          } else this.getOtherPointRuleError = "Connection to server  failed";
        }
      }
      setTimeout(() => {
        this.getOtherPointRuleError = "";
      }, 10000);
    },
  },
  async created() {
    this.getPurchaseRuleError = "";
    this.purchaseRuleLoading = true;
    try {
      const response = await apiService.getPurchaseRules();
      this.allPurchasePointRules = response.data.purchasePointRules;
      this.purchaseRuleLoading = false;
    } catch (error) {
      this.purchaseRuleLoading = false;
      if (error.response) {
        if (error.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        } else {
          this.getPurchaseRuleError = error.response.data.error;
        }
      } else this.getPurchaseRuleError = "Connection to server failed";

      setTimeout(() => {
        this.getPurchaseRuleError = "";
      }, 10000);
    }
    this.otherRuleLoading = true;
    this.getOtherPointRuleError = "";
    try {
      const response = await apiService.getOtherRules();
      this.otherPointRules = response.data.otherPointRules;
      this.otherRuleLoading = false;
    } catch (error) {
      this.otherRuleLoading = false;
      if (error.response) {
        if (error.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        } else {
          this.getOtherPointRuleError = error.response.data.error;
        }
      } else this.getOtherPointRuleError = "Connection to server failed";

      setTimeout(() => {
        this.getOtherPointRuleError = "";
      }, 10000);
    }
  },
};
</script>
<style  scoped>
#pointRuleTable {
  border: 1px solid rgb(223, 218, 218);
}
</style>
