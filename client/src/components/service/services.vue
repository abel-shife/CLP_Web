<template>
  <div>
    <div v-if="$store.state.isAdminLoggedIn" class="container white pt-3">
      <p>
        <span class="headline">Services/</span>
        <span class="grey--text">&nbsp;List of services</span>
        <br />
        <span
          v-if="serviceRegistrationSuccess"
          class="ml-10 green--text text-center"
          >{{ serviceRegistrationSuccess }}</span
        >
        <span
          v-if="serviceRegistrationError"
          class="ml-10 pl-10 red--text text-center"
          >{{ serviceRegistrationError }}</span
        >
        <span
          v-if="getAllServiceError"
          class="ml-10 pl-10 red--text text-center"
          >{{ getAllServiceError }}</span
        >
      </p>

      <div class="text-center">
        <v-btn text :loading="serviceLoading" v-if="serviceLoading">
          <span>loading...</span>
        </v-btn>
        <v-data-table
          v-if="!serviceLoading"
          :search="search"
          v-model="selectedService"
          :headers="headers"
          :items="getAllServices"
          :single-select="singleSelect"
          item-key="serviceImage"
          show-select
          class="elevation-0"
          id="dataTable"
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
                v-if="selectedService.length >= 1 && !singleSelect"
              >
                <v-btn
                  text
                  class="mt-5 grey lighten-4"
                  @click="deleteService(selectedService)"
                >
                  <span class="text-capitalize">
                    <v-icon class="red--text" left>delete</v-icon>Delete
                    selected services
                  </span>
                </v-btn>
              </v-flex>
              <v-flex xs12 md2>
                <v-dialog v-model="serviceDialog" max-width="1000px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      dark
                      class="ma-5 green pl-10 pr-10"
                      v-on="on"
                      @click="addServicePopup"
                    >
                      <span class="text-capitalize">
                        <v-icon class="white--text">add</v-icon>Add Service
                      </span>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{
                        serviceRegUpdatePopupTitle
                      }}</span>
                      <v-spacer></v-spacer>
                      <serviceCatagory
                        :listOfServiceCatagory="listOfServiceCatagory"
                      />
                      <v-btn
                        text
                        class="grey lighten-4 pl-10 pr-10 ml-6 mt-2"
                        @click="serviceDialog = false"
                      >
                        <span class="text-capitalize">
                          <v-icon left class="red--text">close</v-icon>close
                        </span>
                      </v-btn>
                      <v-btn
                        text
                        class="grey lighten-4 pl-10 pr-10 ml-6 mt-2"
                        @click="clearServiceRegistrationForm"
                      >
                        <span class="red--text text-capitalize">Clear</span>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-form
                        enctype="multipart/form-data"
                        v-model="checkServiceInputValidity"
                      >
                        <div
                          class="red--text text-center"
                          v-html="serviceRegistrationError"
                        ></div>
                        <div
                          class="green--text text-center"
                          v-html="serviceRegistrationSuccess"
                        ></div>

                        <v-layout row wrap justify-space-around>
                          <v-flex xs12 md4>
                            <v-select
                              max-height="10"
                              denses
                              placeholder="Select catagory"
                              v-model="selectedServiceCatagory"
                              :items="catagoryName"
                              @change="getSubCatagories"
                            ></v-select>
                            <v-select
                              placeholder="Select sub catagory"
                              v-model="selectedServiceSubCatagory"
                              :items="subCatagoryName"
                            ></v-select>
                            <v-text-field
                              label="Service Name"
                              v-model="serviceName"
                              :rules="serviceNameValidation"
                            ></v-text-field>
                            <v-text-field
                              label="Price"
                              v-model="servicePrice"
                              :rules="servicePriceValidation"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 md4 class="mt-10">
                            <v-textarea
                              auto-grow
                              rows="1"
                              row-height="10"
                              outlined
                              label="Write description"
                              v-model="serviceDescription"
                              :rules="serviceDescriptionValidation"
                            ></v-textarea>
                            <v-layout row wrap>
                              <v-flex xs12 md5 class="mt-6">
                                <div
                                  class="grey lighten-2 ma-2"
                                  id="imageUploadBox"
                                >
                                  <input
                                    type="file"
                                    class="mb-10 input-file"
                                    ref="image"
                                    @change="selectServiceImage"
                                    accept="image/*"
                                  />
                                  <p class="text-center pt-3">
                                    <v-icon left>cloud_upload</v-icon>Upload
                                    image
                                  </p>
                                </div>
                              </v-flex>
                              <v-flex xs12 md5 class="mt-0">
                                <v-img
                                  cover
                                  v-if="
                                    serviceImagePreview && !isEditServiceClicked
                                  "
                                  :src="serviceImagePreview"
                                  contain
                                  height="150"
                                ></v-img>
                                <v-img
                                  cover
                                  v-if="isEditServiceClicked && serviceImage"
                                  :src="
                                    require(`../../../../server/images/${serviceImage}`)
                                  "
                                  contain
                                  height="150"
                                ></v-img>
                                <v-switch
                                  v-if="isRegOrUpdate == 'update'"
                                  v-model="isEditServiceClicked"
                                  label="Use old"
                                ></v-switch>

                                <v-btn
                                  :loading="loading"
                                  text
                                  dark
                                  class="primary mt-10 pl-10 pr-10 ml-10"
                                  @click="serviceRegistration"
                                >
                                  <span class="text-capitalize">Save</span>
                                </v-btn>
                              </v-flex>
                            </v-layout>
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
          <template v-slot:[`item.serviceDescription`]="{ item }">
            <p class="d-inline-block text-truncate" style="max-width: 100px">
              {{ item.serviceDescription }}
            </p>
          </template>

          <template v-slot:[`item.serviceImage`]="{ item }">
            <v-img
              v-if="item.serviceImage"
              :src="require(`../../../../server/images/${item.serviceImage}`)"
              alt="Image"
              contain
              height="50px"
              width="50px"
            ></v-img>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div
              v-if="
                getAllServices.indexOf(selectedService[0]) ==
                  getAllServices.indexOf(item) && singleSelect
              "
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="blue--text mr-2"
                    @click="editService(item)"
                    >edit</v-icon
                  >
                </template>
                <span>Edit</span>
              </v-tooltip>

              <v-tooltip top dark>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="red--text ml-2"
                    @click="deleteService(item)"
                    >delete</v-icon
                  >
                </template>
                <span>Delete</span>
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
import serviceCatagory from "../service/serviceCatagory";
export default {
  components: {
    serviceCatagory,
  },
  data() {
    return {
      selectedServiceCatagory: "",
      selectedServiceSubCatagory: "",
      serviceName: "",
      servicePrice: "",
      serviceDescription: "",
      serviceImage: "",

      isEditServiceClicked: false,
      isRegOrUpdate: "",
      serviceUpdateId: "",
      editedIndex: "",
      serviceImageToBinary: "",
      serviceImagePreview: "",
      serviceRegUpdatePopupTitle: "",
      checkServiceInputValidity: false,
      loading: false,
      serviceRegistrationSuccess: "",
      serviceRegistrationError: "",
      serviceDialog: false,

      listOfServiceCatagory: [],
      catagoryName: [],
      subCatagoryName: [],
      listOfServiceSubCatagory: [],

      serviceNameValidation: [
        (input) =>
          /^[a-zA-Z0-9 ]{2,32}$/.test(input) ||
          "Invalid service name. it contains a-z,A-Z,0-9 or" +
            " space and at least 2 characters are required",
      ],
      servicePriceValidation: [
        (input) =>
          /^[0-9]{1,100}[.]{1}[0-9]{2}$/.test(input) ||
          "Price must be numeric and with two decimal place",
      ],
      serviceDescriptionValidation: [
        (input) =>
          /^[a-zA-Z0-9.\n ]{8,100}$/.test(input) ||
          "Description  contains a-z,A-Z,0-9 or space and with at least 7 characters andd maximum 100 characters",
      ],
      getAllServiceError: "",

      singleSelect: true,
      serviceLoading: false,

      search: "",
      selectedService: [],
      headers: [
        {
          text: "Service Catagory",
          align: "start",
          value: "selectedServiceCatagory",
        },
        { text: "Sub Catagory", value: "selectedServiceSubCatagory" },
        { text: "Service Name", value: "serviceName" },
        { text: "Price", value: "servicePrice" },
        { text: "Description", value: "serviceDescription", sortable: false },
        { text: "Picture", value: "serviceImage", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      getAllServices: [],
    };
  },

  methods: {
    selectServiceImage() {
      this.serviceImageToBinary = this.$refs.image.files[0];
      const image = this.serviceImageToBinary;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.isEditServiceClicked = false;
        this.serviceImagePreview = e.target.result;
      };
    },
    async serviceRegistration() {
      if (this.checkServiceInputValidity) {
        this.loading = true;
        const formData = new FormData();
        formData.append("img", this.serviceImageToBinary);
        try {
          if (!this.isEditServiceClicked && this.serviceImagePreview) {
            const serviceImageResponse = await apiService.uploadImage(formData);
            this.serviceImage = serviceImageResponse.data.imageUrl;
          }

          const serviceResponse = await apiService.serviceRegistration({
            selectedServiceCatagory: this.selectedServiceCatagory,
            selectedServiceSubCatagory: this.selectedServiceSubCatagory,
            serviceName: this.serviceName,
            servicePrice: this.servicePrice,
            serviceDescription: this.serviceDescription,
            serviceImage: this.serviceImage,
            actionSendFrom: this.isRegOrUpdate,
            serviceUpdateId: this.serviceUpdateId,
          });

          this.loading = false;
          this.serviceRegistrationError = "";
          this.serviceRegistrationSuccess =
            "Service is registered successfully!";
          this.serviceDialog = false;
          window.scrollTo(0, 0);
          setTimeout(() => {
            if (this.isRegOrUpdate == "register") {
              this.getAllServices.push(serviceResponse.data.service);
            } else {
              Object.assign(this.getAllServices[this.editedIndex], {
                selectedServiceCatagory: this.selectedServiceCatagory,
                selectedServiceSubCatagory: this.selectedServiceSubCatagory,
                serviceName: this.serviceName,
                servicePrice: this.servicePrice,
                serviceDescription: this.serviceDescription,
                serviceImage: this.serviceImage,
              });
            }
            this.serviceRegistrationSuccess = "";
          }, 5000);
        } catch (error) {
          this.loading = false;
          this.serviceRegistrationSuccess = "";
          if (error.response) {
            if (error.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else {
              this.serviceRegistrationError = error.response.data.error;
              window.scrollTo(0, 0);
            }
          } else this.serviceRegistrationError = "Connection to server failed";
        }
      } else {
        window.scrollTo(0, 0);
        this.serviceRegistrationSuccess = "";
        this.serviceRegistrationError = "Please fill all the requirements";

        window.scrollTo(0, 0);
        setTimeout(() => {
          this.serviceRegistrationSuccess = "";
          this.serviceRegistrationError = "";
        }, 3000);
      }
    },
    clearServiceRegistrationForm() {
      (this.selectedServiceCatagory = ""),
        (this.selectedServiceSubCatagory = ""),
        (this.serviceName = ""),
        (this.servicePrice = ""),
        (this.serviceDescription = ""),
        (this.serviceImage = ""),
        (this.serviceImageToBinary = "");
      this.serviceImagePreview = "";
      this.checkServiceInputValidity = false;
      this.loading = false;
      this.serviceRegistrationSuccess = "";
      this.serviceRegistrationError = "";
    },
    addServicePopup() {
      this.listOfServiceCatagory = "";
      this.isRegOrUpdate = "register";
      this.serviceImagePreview = "";
      (this.selectedServiceCatagory = ""),
        (this.selectedServiceSubCatagory = ""),
        (this.serviceName = ""),
        (this.servicePrice = ""),
        (this.serviceDescription = ""),
        (this.serviceImage = ""),
        (this.serviceRegUpdatePopupTitle = "Add Service");
      this.loading = false;
      this.getAllCatagories();
    },
    async getAllCatagories() {
      try {
        this.catagoryName = [];
        const catagoryResponse = await apiService.getAllCatagory();
        this.listOfServiceCatagory = catagoryResponse.data.allCatagories;
        for (let i = 0; i < catagoryResponse.data.allCatagories.length; i++) {
          this.catagoryName.push(
            catagoryResponse.data.allCatagories[i].catagoryName
          );
        }
      } catch (err) {
        this.serviceRegistrationSuccess = "";
        if (err.response) {
          if (err.response.data.error == 0) {
            this.$store.dispatch("setAdmin", "");
            this.$store.dispatch("setAdminToken", "");
            this.$store.dispatch("setSession", false);
            this.$router.push({ name: "adminLoginPage" });
          } else this.serviceRegistrationError = err.response.data.error;
        } else this.serviceRegistrationError = "Connection to server failed";
        setTimeout(() => {
          this.serviceRegistrationError = "";
        }, 3000);
      }
    },
    getSubCatagories() {
      this.subCatagoryName = [];

      for (let i = 0; i < this.listOfServiceCatagory.length; i++) {
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
    async editService(item) {
      this.serviceUpdateId = item._id;
      this.editedIndex = this.getAllServices.indexOf(item);
      this.isRegOrUpdate = "update";
      this.serviceRegUpdatePopupTitle = "Edit Service";
      this.selectedServiceCatagory = item.selectedServiceCatagory;
      this.selectedServiceSubCatagory = item.selectedServiceSubCatagory;
      this.serviceName = item.serviceName;
      this.servicePrice = item.servicePrice;
      this.serviceDescription = item.serviceDescription;
      this.serviceImage = item.serviceImage;
      this.serviceDialog = true;
      this.loading = false;
      this.isEditServiceClicked = true;
      await this.getAllCatagories();
      await this.getSubCatagories();
    },

    deleteService(item) {
      const deletingConfirmation = confirm(
        "Are you sure you want to delete this service ?"
      );
      if (deletingConfirmation == true) {
        if (this.singleSelect) {
          this.serviceDeletingInstractions(item);
          this.selectedService = [];
        } else {
          let i = 0;
          for (i = 0; i < item.length; i++) {
            this.serviceDeletingInstractions(item[i]);
          }
          this.selectedService = [];
        }
      }
    },
    async serviceDeletingInstractions(item) {
      try {
        await apiService.deleteService({
          serviceIdToDelete: item._id,
        });

        this.serviceRegistrationError = "Service was deleted!";

        this.getAllServices.splice(this.getAllServices.indexOf(item), 1);
      } catch (error) {
        this.serviceRegistrationSuccess = "";
        if (error.response) {
          if (error.response.data.error == 0) {
            this.$store.dispatch("setAdmin", "");
            this.$store.dispatch("setAdminToken", "");
            this.$store.dispatch("setSession", false);
            this.$router.push({ name: "adminLoginPage" });
          } else this.serviceRegistrationError = error.response.data.error;
        } else this.serviceRegistrationError = "Connection to server failed";
      }

      setTimeout(() => {
        this.serviceRegistrationError = "";
      }, 5000);
    },
  },
  async created() {
    this.getAllServiceError = "";
    this.serviceLoading = true;

    try {
      const response = await apiService.getAllServices();
      this.serviceLoading = false;
      this.getAllServices = response.data.allServices;
    } catch (error) {
      this.serviceLoading = false;
      if (error.response) {
        if (error.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        } else this.getAllServiceError = error.response.data.error;
      } else this.getAllServiceError = "Connection to server failed";
    }
    setTimeout(() => {
      this.serviceRegistrationSuccess = "";
      this.serviceRegistrationError = "";
      this.getAllServiceError = "";
    }, 3000);
  },
};
</script>

<style lang="scss" scoped>
.input-file {
  opacity: 0; /* invisible but it's there! */
  position: absolute;
  height: 50px;
  width: 130px;
  cursor: pointer;
}
#imageUploadBox {
  width: 130px;
  height: 50px;
  border-radius: 6px;
}
.serviceSearch {
  float: left;
  clear: left;
  padding-top: 0;
  margin-top: 0;
}
.v-data-table {
  font-size: 24px;
  border: 1px solid rgb(223, 217, 217);
}
</style>
