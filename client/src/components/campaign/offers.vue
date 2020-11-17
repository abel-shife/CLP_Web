<template>
  <div>
    <div v-if="$store.state.isAdminLoggedIn" class="white container pt-3">
      <p>
        <span class="headline">Offers/</span>
        <span class="grey--text">&nbsp;List of offers</span>
        <br />
        <span
          v-if="offerRegistrationSuccess"
          class="ml-10 green--text text-center"
          >{{ offerRegistrationSuccess }}</span
        >
        <span
          v-if="offerRegistrationError"
          class="ml-10 pl-10 red--text text-center"
          >{{ offerRegistrationError }}</span
        >
        <span
          v-if="getAllOfferError"
          class="ml-10 pl-10 red--text text-center"
          >{{ getAllOfferError }}</span
        >
      </p>
      <div class="text-center">
        <v-btn text :loading="offerLoading" v-if="offerLoading">
          <span>loading...</span>
        </v-btn>
        <v-data-table
          v-if="!offerLoading"
          :search="search"
          v-model="selectedOffer"
          :headers="headers"
          :items="getAllOffers"
          :single-select="singleSelect"
          item-key="serviceName"
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
              <v-flex xs12 md3 v-if="selectedOffer.length > 1 && !singleSelect">
                <v-btn
                  text
                  :loading="deleteOfferLoading"
                  class="mt-5 grey lighten-4"
                  @click="deleteOffer(selectedOffer)"
                >
                  <span class="text-capitalize">
                    <v-icon class="red--text" left>delete</v-icon>Delete
                    selected offers
                  </span>
                </v-btn>
              </v-flex>
              <v-flex xs12 md3>
                <v-dialog v-model="offerDialog" max-width="800px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      text
                      class="ma-5 green pl-10 pr-10"
                      dark
                      @click="getAllServiceName"
                    >
                      <span class="text-capitalize">Add Offer</span>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ offerRegOrUpdateTitle }}</span>
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        class="grey lighten-4 pl-10 pr-10 ml-6 mt-2"
                        @click="offerDialog = false"
                      >
                        <span class="text-capitalize">
                          <v-icon left class="red--text">close</v-icon>close
                        </span>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <p class="text-center red--text">
                        {{ getAllServiceError }}
                        <span
                          v-if="offerRegistrationError"
                          class="ml-10 pl-10 red--text text-center"
                          >{{ offerRegistrationError }}</span
                        >
                      </p>
                      <v-form v-model="checkValidity">
                        <v-layout row wrap justify-space-around>
                          <v-flex xs12 md4 class="pa-2">
                            <v-text-field
                              v-model="offerTitle"
                              :rules="offerTitleValidation"
                              label="Offer Titel"
                              prepend-icon="title"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs12 md4 class="pa-2">
                            <v-select
                              denses
                              placeholder="Select Level"
                              v-model="selectedLevel"
                              :items="levels"
                              prepend-icon="signal_cellular_alt"
                            ></v-select>
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
                getAllOffers.indexOf(selectedOffer[0]) ==
                  getAllOffers.indexOf(item) && singleSelect
              "
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="blue--text mr-2"
                    @click="editOffer(item)"
                    >edit</v-icon
                  >
                </template>
                <span>Update offer</span>
              </v-tooltip>

              <v-tooltip top dark>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="red--text ml-2"
                    @click="deleteOffer(item)"
                    >delete</v-icon
                  >
                </template>
                <span>Delete offer</span>
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
    offerRegistrationSuccess: "",
    offerRegistrationError: "",
    getAllOfferError: "",
    offerLoading: false,
    singleSelect: true,
    offerDialog: false,
    checkValidity: false,
    offerRegistrationLoading: false,
    deleteOfferLoading: false,
    getAllServices: [],
    allServiceNames: [],

    search: "",
    offerTitle: "",
    selectedLevel: "",
    selectedServiceName: "",
    servicePrice: "",
    discountRate: 0,
    priceAfterDiscount: "",
    limitedNumberPeople: 0,
    serviceImage: "",
    selectedServiceCatagory: "",
    selectedServiceSubCatagory: "",
    offerRegOrUpdateTitle: "",
    whatToDo: "",
    offerSelectedItem: "",

    levels: ["Gold", "Bronze", "silver"],

    selectedOffer: [],
    getAllOffers: [],

    startMenu: false,
    endMenu: false,
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),

    offerTitleValidation: [
      (v) =>
        /^[A-Za-z 0-9ሀ-ፐ]{2,32}/.test(v) ||
        "Invalid offer title, it contains A-Z, a-z, , 0-9, ሀ-ፐ and minimum 2 and maximum 32 characters",
    ],
    headers: [
      {
        text: "Offer Title",
        align: "start",
        value: "offerTitle",
      },
      {
        text: "Service Name",

        value: "serviceName",
      },
      {
        text: "Start Date",

        value: "startDate",
      },
      {
        text: "End Date",

        value: "endDate",
      },
      {
        text: "Service Price",

        value: "servicePrice",
      },
      {
        text: "Discaount Rate",

        value: "discountPercent",
      },
      {
        text: "Discount Price",

        value: "discountPrice",
      },
      {
        text: "Offered Level",

        value: "selectedLevel",
      },
      {
        text: "No People",

        value: "numberOfPeople",
      },
      {
        text: "Actions",

        value: "actions",
      },
    ],
  }),

  methods: {
    async getAllServiceName() {
      this.whatToDo = "add";
      this.offerRegOrUpdateTitle = "Offer registration";
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
      }
    },
    getServicePrice() {
      let index = 0;
      for (index = 0; index < this.getAllServices.length; index++) {
        if (
          this.selectedServiceName == this.getAllServices[index].serviceName
        ) {
          this.servicePrice = this.getAllServices[index].servicePrice;
          this.serviceImage = this.getAllServices[index].serviceImage;
          this.selectedServiceCatagory = this.getAllServices[
            index
          ].selectedServiceCatagory;
          this.selectedServiceSubCatagory = this.getAllServices[
            index
          ].selectedServiceSubCatagory;
          break;
        }
      }
    },

    async saveOffer() {
      this.offerRegistrationError = "";
      this.offerRegistrationSuccess = "";
      if (this.checkValidity) {
        if (this.selectedServiceName != "") {
          if (this.discountRate > 0 && this.discountRate <= 100) {
            if (this.limitedNumberPeople < 0) {
              this.offerRegistrationError =
                "Number of people can not be negative";
            } else {
              if (this.whatToDo == "add") {
                if (
                  this.startDate <= this.endDate &&
                  this.startDate >= new Date().toISOString().substr(0, 10) &&
                  this.endDate >= new Date().toISOString().substr(0, 10)
                ) {
                  this.offerRegistrationLoading = true;
                  try {
                    const offerResponsee = await apiService.saveOffer({
                      offerTitle: this.offerTitle,
                      serviceName: this.selectedServiceName,
                      servicePrice: this.servicePrice,
                      selectedLevel: this.selectedLevel,
                      selectedServiceCatagory: this.selectedServiceCatagory,
                      selectedServiceSubCatagory: this
                        .selectedServiceSubCatagory,
                      serviceImage: this.serviceImage,
                      discountPercent: this.discountRate,
                      discountPrice:
                        this.servicePrice -
                        (this.discountRate / 100) * this.servicePrice,

                      numberOfPeople: this.limitedNumberPeople,
                      startDate: this.startDate,
                      endDate: this.endDate,
                    });

                    this.getAllOffers.push(offerResponsee.data.offer);
                    this.offerRegistrationSuccess =
                      "Offer registered successfully!";
                    this.offerRegistrationError = "";
                    this.offerRegistrationLoading = false;
                    this.offerDialog = false;
                  } catch (err) {
                    this.offerRegistrationLoading = false;
                    this.offerRegistrationSuccess = "";
                    if (err.response) {
                      if (err.response.data.error == 0) {
                        this.$store.dispatch("setAdmin", "");
                        this.$store.dispatch("setAdminToken", "");
                        this.$store.dispatch("setSession", false);
                        this.$router.push({ name: "adminLoginPage" });
                      } else
                        this.offerRegistrationError = err.response.data.error;
                    } else
                      this.offerRegistrationError =
                        "Connection to server failed";
                  }
                } else
                  this.offerRegistrationError =
                    "Please make sure start date and end date are correct";
              } else if (this.whatToDo == "update") {
                this.offerRegistrationLoading = true;
                try {
                  await apiService.updateOfferInfo({
                    offerTitle: this.offerTitle,
                    serviceName: this.selectedServiceName,
                    servicePrice: this.servicePrice,
                    selectedLevel: this.selectedLevel,
                    selectedServiceCatagory: this.selectedServiceCatagory,
                    selectedServiceSubCatagory: this.selectedServiceSubCatagory,
                    serviceImage: this.serviceImage,
                    discountPercent: this.discountRate,
                    discountPrice:
                      this.servicePrice -
                      (this.discountRate / 100) * this.servicePrice,

                    numberOfPeople: this.limitedNumberPeople,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    offerId: this.offerSelectedItem._id,
                  });

                  Object.assign(
                    this.getAllOffers[
                      this.getAllOffers.indexOf(this.offerSelectedItem)
                    ],
                    {
                      offerTitle: this.offerTitle,
                      serviceName: this.selectedServiceName,
                      servicePrice: this.servicePrice,
                      selectedLevel: this.selectedLevel,
                      selectedServiceCatagory: this.selectedServiceCatagory,
                      selectedServiceSubCatagory: this
                        .selectedServiceSubCatagory,
                      serviceImage: this.serviceImage,
                      discountPercent: this.discountRate,
                      discountPrice:
                        this.servicePrice -
                        (this.discountRate / 100) * this.servicePrice,

                      numberOfPeople: this.limitedNumberPeople,
                      startDate: this.startDate,
                      endDate: this.endDate,
                    }
                  );

                  this.offerRegistrationSuccess = "Offer updated successfully!";
                  this.offerRegistrationError = "";
                  this.offerRegistrationLoading = false;
                  this.offerDialog = false;
                } catch (err) {
                  this.offerRegistrationLoading = false;
                  this.offerRegistrationSuccess = "";
                  if (err.response) {
                    if (err.response.data.error == 0) {
                      this.$store.dispatch("setAdmin", "");
                      this.$store.dispatch("setAdminToken", "");
                      this.$store.dispatch("setSession", false);
                      this.$router.push({ name: "adminLoginPage" });
                    } else
                      this.offerRegistrationError = err.response.data.error;
                  } else
                    this.offerRegistrationError = "Connection to server failed";
                }
              }
            }
          } else
            this.offerRegistrationError =
              "Discount rate must be greater than 0  and less than or equal to 100 percent";
        } else this.offerRegistrationError = "Please choose service name";
      } else
        this.offerRegistrationError = "Please fill all the required fields";

      setTimeout(() => {
        this.offerRegistrationError = "";
        this.offerRegistrationSuccess = "";
        this.getAllOfferError = "";
      }, 5000);
    },
    async deleteOffer(item) {
      const deleteConfirmation = confirm(
        "Are you sure you want to delete this(these) offer(s) ?"
      );
      if (deleteConfirmation) {
        let count = 0;
        try {
          if (this.singleSelect) {
            await apiService.deleteOffer({
              offerId: item._id,
            });
            this.getAllOffers.splice(this.getAllOffers.indexOf(item), 1);
            this.selectedOffer = [];
            this.offerRegistrationError = "Offer deleted";
          } else {
            this.deleteOfferLoading = true;
            let i = 0;
            for (i = 0; i < item.length; i++) {
              await apiService.deleteOffer({
                offerId: item[i]._id,
              });
              this.getAllOffers.splice(this.getAllOffers.indexOf(item[i]), 1);
              count++;
            }
            this.offerRegistrationError = count + " Offers deleted";
            this.deleteOfferLoading = false;

            this.selectedOffer = [];
            count = 0;
          }
        } catch (err) {
          this.deleteOfferLoading = false;
          if (err.response) {
            if (err.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else this.offerRegistrationError = err.response.data.error;
          } else this.offerRegistrationError = "Connection to server  failed";
        }
      }
      setTimeout(() => {
        this.offerRegistrationError = "";
        this.offerRegistrationSuccess = "";
        this.getAllOfferError = "";
      }, 5000);
    },
    editOffer(item) {
      this.getAllServiceName();
      this.whatToDo = "update";
      this.offerRegOrUpdateTitle = "Update offer";
      this.offerDialog = true;
      this.offerTitle = item.offerTitle;
      this.selectedServiceName = item.serviceName;
      this.servicePrice = item.servicePrice;
      this.selectedLevel = item.selectedLevel;
      this.selectedServiceCatagory = item.selectedServiceCatagory;
      this.selectedServiceSubCatagory = item.selectedServiceSubCatagory;
      this.serviceImage = item.serviceImage;
      this.discountRate = item.discountPercent;
      this.limitedNumberPeople = item.numberOfPeople;
      this.startDate = item.startDate;
      this.endDate = item.endDate;

      this.offerSelectedItem = item;
    },
  },
  async created() {
    this.getAllOfferError = "";
    this.offerLoading = true;

    try {
      const response = await apiService.getAllOffers();
      this.offerLoading = false;
      this.getAllOffers = response.data.allOffers;
    } catch (error) {
      this.offerLoading = false;
      if (error.response) {
        if (error.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        } else this.getAllOfferError = error.response.data.error;
      } else this.getAllOfferError = "Connection to server failed";
    }
    setTimeout(() => {
      this.offerRegistrationError = "";
      this.offerRegistrationSuccess = "";
      this.getAllOfferError = "";
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

