<template>
  <div>
    <div v-if="$store.state.isAdminLoggedIn" class="white pt-3 pa-1">
      <p>
        <span class="headline">Customers/</span>
        <span class="grey--text">&nbsp;List of customers</span>
        <br />
        <span
          v-if="getAllCustomersError"
          class="ml-10 pl-10 red--text text-center"
          >{{ getAllCustomersError }}</span
        >
      </p>
      <div class="text-center">
        <v-btn text :loading="customerLoading" v-if="customerLoading">
          <span>loading...</span>
        </v-btn>
        <v-data-table
          v-if="!customerLoading"
          :search="search"
          v-model="selectedCustomer"
          :headers="headers"
          :items="allCustomers"
          :single-select="singleSelect"
          item-key="phoneNumber"
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
                v-if="selectedCustomer.length > 1 && !singleSelect"
              >
                <v-btn
                  text
                  :loading="deleteCustomerLoading"
                  class="mt-5 grey lighten-4"
                  @click="deleteCustomer(selectedCustomer)"
                >
                  <span class="text-capitalize">
                    <v-icon class="red--text" left>delete</v-icon>Delete
                    selected customers
                  </span>
                </v-btn>
              </v-flex>
              <v-flex xs12 md3>
                <v-dialog
                  v-model="customerDialog"
                  max-width="800px"
                  v-if="customerDialog"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" text class="ma-5 green pl-10 pr-10" dark>
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
    selectedCustomer: [],
    allCustomers: [],
    getAllCustomersError: "",
    search: "",
    deleteCustomerLoading: false,
    customerLoading: false,
    singleSelect: true,
    customerDialog: false,

    headers: [
      {
        text: "First Name",
        align: "start",
        value: "firstName",
      },
      {
        text: "Last Name",

        value: "lastName",
      },
      {
        text: "Age",

        value: "age",
      },
      {
        text: "BirthDate",

        value: "birthDate",
      },
      {
        text: "Gender",

        value: "gender",
      },
      {
        text: "Phone No",

        value: "phoneNumber",
      },
      {
        text: "Address",

        value: "address",
      },
      {
        text: "Referral Code",

        value: "referralCode",
      },
      {
        text: "Card No",

        value: "cardNumber",
      },
      {
        text: "Registered Date",

        value: "registeredDate",
      },
      {
        text: "Is Refered",

        value: "isRefered",
      },
      {
        text: "Actions",

        value: "actions",
      },
    ],
  }),

  methods: {
    async deleteCustomer(item) {
      const deleteConfirmation = confirm(
        "Are you sure you want to delete this(these) offer(s) ?"
      );
      if (deleteConfirmation) {
        let count = 0;
        try {
          if (this.singleSelect) {
            await apiService.deleteCustomer({
              customerId: item._id,
            });
            this.allCustomers.splice(this.allCustomers.indexOf(item), 1);
            this.selectedCustomer = [];
            this.getAllCustomersError = "Customer deleted";
          } else {
            this.deleteCustomerLoading = true;
            let i = 0;
            for (i = 0; i < item.length; i++) {
              await apiService.deleteCustomer({
                customerId: item[i]._id,
              });
              this.allCustomers.splice(this.allCustomers.indexOf(item[i]), 1);
              count++;
            }
            this.getAllCustomersError = count + " Customers deleted";
            this.deleteCustomerLoading = false;

            this.selectedCustomer = [];
            count = 0;
          }
        } catch (err) {
          this.deleteCustomerLoading = false;
          if (err.response) {
            if (err.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else this.getAllCustomersError = err.response.data.error;
          } else this.getAllCustomersError = "Connection to server  failed";
        }
      }
      setTimeout(() => {
        this.getAllCustomersError = "";
      }, 5000);
    },

    editCustomer(item) {
      this.customerDialog = true;
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

