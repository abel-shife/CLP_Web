<template>
  <div>
    <v-dialog max-width="400px" v-model="serviceCatagoryPopup">
      <template v-slot:activator="{ on }">
        <v-btn
          dark
          text
          class="primary lighten-2 mr-10"
          v-on="on"
          @click="allCatagories"
        >
          <span class="text-capitalize">Add catagory</span>
        </v-btn>
      </template>
      <v-card class="pa-5">
        <v-card-title>
          <span>Add catagory</span>
          <v-spacer></v-spacer>
          <v-btn text class @click="serviceCatagoryPopup = false">
            <span>
              <v-icon class="red--text" large>close</v-icon>
            </span>
          </v-btn>
        </v-card-title>
        <v-layout row wrap>
          <div class="text-center red--text" v-html="deleteCatagoryError" />
          <v-flex xs10 md10>
            <v-select
              class="ml-10"
              @change="allSubCatagories"
              placeholder="already registerd catagories"
              :items="catagoryName"
              v-model="selectedServiceCatagory"
            ></v-select>
          </v-flex>
          <v-flex xs1 md1 class="mt-4" v-if="selectedServiceCatagory">
            <v-tooltip top dark>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  small
                  class="red--text ml-2"
                  @click="deleteCatagory(selectedServiceCatagory, 'catagory')"
                  >delete</v-icon
                >
              </template>
              <span>Delete</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs10 md10>
            <v-select
              class="ml-10"
              v-if="subCatagoryName.length >= 1"
              v-model="selectedServiceSubCatagory"
              placeholder="Sub catagories "
              :items="subCatagoryName"
            ></v-select>
          </v-flex>
          <v-flex xs1 md1 class="mt-4" v-if="selectedServiceSubCatagory">
            <v-tooltip top dark>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  small
                  class="red--text ml-2"
                  @click="
                    deleteCatagory(selectedServiceSubCatagory, 'subCatagory')
                  "
                  >delete</v-icon
                >
              </template>
              <span>Delete</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <hr />
        <v-card-text class="mt-3">
          <v-form v-model="checkValidity">
            <p class="text-center">Registration form</p>
            <div
              v-if="serviceCatagoryError"
              class="text-center red--text"
              v-html="serviceCatagoryError"
            />
            <div
              v-if="sreviceCatatagorySuccess"
              class="text-center green--text"
              v-html="sreviceCatatagorySuccess"
            />
            <v-layout row wrap justify-space-around>
              <v-flex xs12>
                <v-text-field
                  label="Catagory"
                  v-model="serviceCatagory"
                  :rules="catagoryValidation"
                ></v-text-field>
                <v-text-field
                  label="Sub catagory"
                  v-model="serviceSubCatagory"
                  :rules="catagoryValidation"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-btn
                  text
                  class="primary"
                  :loading="categoryRegistrationLoading"
                  @click="serviceCatagoryRegistration"
                >
                  <span class="text-capitalize">Save</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import apiService from "../../services/apiService";
export default {
  props: ["listOfServiceCatagory"],
  data() {
    return {
      catagoryName: [],
      subCatagoryName: [],
      selectedServiceCatagory: "",
      selectedServiceSubCatagory: "",
      serviceCatagoryPopup: false,
      checkValidity: false,
      serviceCatagory: "",
      serviceSubCatagory: "",
      sreviceCatatagorySuccess: "",
      serviceCatagoryError: "",
      deleteCatagoryError: "",
      categoryRegistrationLoading: false,
      catagoryValidation: [
        (input) => /^[a-zA-z.0-9 ]{2,100}$/.test(input) || "Inavalid input",
      ],
    };
  },
  methods: {
    async serviceCatagoryRegistration() {
      if (this.serviceCatagory != "") {
        this.categoryRegistrationLoading = true;
        try {
          const response = await apiService.serviceCatagoryRegistration({
            serviceCatagory: this.serviceCatagory,
            serviceSubCatagory: this.serviceSubCatagory,
          });
          this.serviceCatagoryError = "";
          this.sreviceCatatagorySuccess = response.data.success;
          this.categoryRegistrationLoading = false;
        } catch (err) {
          this.sreviceCatatagorySuccess = "";

          this.categoryRegistrationLoading = false;
          if (err.response) {
            this.serviceCatagoryError = err.response.data.error;
          } else this.serviceCatagoryError = "Connection to server failed";
        }
      } else {
        this.serviceCatagoryError = "Catagory is required";
      }
      setTimeout(() => {
        this.sreviceCatatagorySuccess = "";
        this.serviceCatagoryError = "";
      }, 5000);
    },

    allCatagories() {
      this.selectedServiceCatagory = "";
      this.catagoryName = [];
      for (let i = 0; i < this.listOfServiceCatagory.length; i++) {
        this.catagoryName.push(this.listOfServiceCatagory[i].catagoryName);
      }
    },
    allSubCatagories() {
      this.subCatagoryName = [];
      this.selectedServiceSubCatagory = "";
      let i = 0;
      for (i = 0; i < this.listOfServiceCatagory.length; i++) {
        if (
          this.selectedServiceCatagory ==
          this.listOfServiceCatagory[i].catagoryName
        ) {
          for (
            let k = 0;
            k < this.listOfServiceCatagory[i].subCatagory.length;
            k++
          ) {
            this.subCatagoryName.push(
              this.listOfServiceCatagory[i].subCatagory[k].subCatagoryName
            );
          }
        }
      }
    },

    async deleteCatagory(catagoryToDelete, whichOneToDelete) {
      const confirmDeletion = confirm(
        "Are you sure you want to delete this catagory or sub catagory"
      );

      if (confirmDeletion) {
        try {
          let i = 0;
          for (i = 0; i < this.listOfServiceCatagory.length; i++) {
            if (whichOneToDelete == "catagory") {
              if (
                catagoryToDelete == this.listOfServiceCatagory[i].catagoryName
              ) {
                await apiService.deleteCatagory({
                  catagoryId: this.listOfServiceCatagory[i]._id,
                  whichOneToDelete: whichOneToDelete,
                });
                this.catagoryName.splice(
                  this.catagoryName.indexOf(catagoryToDelete),
                  1
                );
                this.subCatagoryName = "";
                this.selectedServiceSubCatagory = "";
                this.selectedServiceCatagory = "";
                this.deleteCatagoryError = "Catagory was deleted";
              }
            } else {
              let k = 0;
              for (
                k = 0;
                k < this.listOfServiceCatagory[i].subCatagory.length;
                k++
              ) {
                if (
                  catagoryToDelete ==
                  this.listOfServiceCatagory[i].subCatagory[k].subCatagoryName
                ) {
                  await apiService.deleteCatagory({
                    catagoryId: this.listOfServiceCatagory[i]._id,
                    subCatagoryId: this.listOfServiceCatagory[i].subCatagory[k]
                      ._id,
                    whichOneToDelete: whichOneToDelete,
                  });
                  this.subCatagoryName.splice(
                    this.subCatagoryName.indexOf(catagoryToDelete),
                    1
                  );
                  this.selectedServiceSubCatagory = "";
                  this.deleteCatagoryError = "Sub catagory was deleted";
                }
              }
            }
          }
        } catch (err) {
          this.deleteCatagoryError = err.response.data.error;
        }
        setTimeout(() => {
          this.deleteCatagoryError = "";
        }, 5000);
      }
    },
  },
};
</script>
