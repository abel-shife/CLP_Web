<template>
  <div>
    <div
      class="mt-5 text-center"
      id="adminRegistrationForm"
      v-if="$store.state.admin.actor == 'supper'"
    >
      <div></div>
      <v-form
        enctype="multipart/form-data"
        class="white mt-5 pa-10"
        id="adminRegistrationPageLayout"
        v-model="isValidityChecked"
      >
        <p class="headline grey--text">Registration Form</p>
        <div class="green--text" v-html="adminRegistrationSuccess" />
        <div class="red--text" v-html="adminRegistrationError" />
        <v-layout row wrap class="pt-4">
          <v-flex xs12 md4>
            <v-text-field
              :rules="nameValidation"
              label="First Name"
              prepend-icon="person"
              v-model="firstName"
              class="ma-3"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md4>
            <v-text-field
              :rules="nameValidation"
              label="Middle Name"
              prepend-icon="person"
              v-model="middleName"
              class="ma-3"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md4>
            <v-text-field
              :rules="nameValidation"
              label="Last Name"
              prepend-icon="person"
              v-model="lastName"
              class="ma-3"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md4>
            <v-text-field
              :rules="phoneValidation"
              label="Phone Number"
              prepend-icon="phone"
              v-model="phoneNumber"
              class="ma-3"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md5>
            <v-text-field
              :rules="addressValidation"
              label="Address"
              prepend-icon="add"
              v-model="address"
              class="ma-3"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md3 class="ml-2">
            <div class="grey lighten-2 ma-2" id="imageUploadBox">
              <input
                type="file"
                class="mb-10 input-file"
                ref="image"
                @change="selectFile"
                accept="image/*"
              />
              <p class="text-center pt-3">
                <v-icon left>cloud_upload</v-icon> image
              </p>
            </div>
          </v-flex>
          <v-flex xs12 md3 v-if="imagePreview">
            <img
              v-if="imagePreview"
              conatain
              :src="imagePreview"
              alt="Image"
              height="150"
              width="150"
            />
          </v-flex>
          <v-flex xs12 md3>
            <v-btn
              text
              dark
              class="green pr-10 pl-10 ma-5"
              @click="adminRegistration"
              :loading="loading"
            >
              <span class="text-capitalize">Register</span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </div>
    <div v-else>
      <span class="headline red--text"
        >You do not have access.only supper admin has access to this
        resource</span
      >
    </div>
  </div>
</template>

<script>
import apiService from "../../services/apiService";
export default {
  data() {
    return {
      adminImageBinary: "",
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      imagePreview: "",
      isStayLoggedInChecked: false,
      isValidityChecked: false,
      loading: false,
      adminRegistrationSuccess: "",
      adminRegistrationError: "",
      imageURL: "",
      nameValidation: [
        (input) =>
          /^[a-zA-Z ]{2,32}$/.test(input) ||
          "Invalid name. it contains a-z or A-Z, with minimum 2 characters and maximum 32 characters",
      ],
      phoneValidation: [
        (input) =>
          /^[+]{1}[0-9]{12,13}$/.test(input) ||
          "Invalid phone number. it contains country code and followed by phone number",
      ],
      addressValidation: [
        (input) =>
          /^[a-zA-Z0-9 .]{2,32}$/.test(input) ||
          "Invalid address. it contains a-z" + ",A-Z, 0-9, , and . ",
      ],
    };
  },
  methods: {
    selectFile() {
      this.adminImageBinary = this.$refs.image.files[0];
      const image = this.adminImageBinary;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
    },
    async adminRegistration() {
      if (this.isValidityChecked) {
        const formData = new FormData();
        formData.append("img", this.adminImageBinary);
        this.loading = true;
        try {
          if (this.imagePreview) {
            const adminPictureResponse = await apiService.uploadImage(formData);
            this.imageURL = adminPictureResponse.data.imageUrl;
          }
          const adminResponse = await apiService.adminRegistration({
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            address: this.address,
            adminPicture: this.imageURL,
          });
          this.loading = false;
          this.adminRegistrationError = "";
          window.scrollTo(0, 0);
          this.adminRegistrationSuccess =
            adminResponse.data.admin.firstName + " is registered successfully!";
        } catch (error) {
          this.adminRegistrationSuccess = "";
          this.loading = false;
          window.scrollTo(0, 0);
          this.adminRegistrationError = error.response.data.error;
        }
      } else {
        this.adminRegistrationSuccess = "";
        window.scrollTo(0, 0);
        this.adminRegistrationError = " Please fill all the requirements";
      }
    },
  },
};
</script>

<style scoped>
#adminRegistrationPageLayout {
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
  max-width: 900px;
  margin: auto;
}
#adminRegistrationForm {
  font-family: sans-serif;
}
#helpBtn {
  float: right;
  clear: right;
}
.input-file {
  opacity: 0;
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
</style>
