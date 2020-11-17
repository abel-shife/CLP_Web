<template>
  <div>
    <div
      v-if="
        $store.state.isAdminLoggedIn && $store.state.admin.actor == 'supper'
      "
    >
      <span class="headline ml-10 pl-10">Branch/</span>
      <span class="grey--text">&nbsp;List of branchs</span>

      <div class="text-center container">
        <v-btn text :loading="branchLoading" v-if="branchLoading">
          <span>loading...</span>
        </v-btn>

        <v-data-table
          v-if="!branchLoading"
          :search="search"
          v-model="selectedBranch"
          :headers="headers"
          :items="allBranchs"
          :single-select="singleSelect"
          item-key="branchTelephone"
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
                v-if="selectedBranch.length > 1 && !singleSelect"
              >
                <v-btn
                  :loading="deleteBranchLoading"
                  text
                  class="mt-5 grey lighten-4"
                  @click="deleteBranch(selectedBranch)"
                >
                  <span class="text-capitalize">
                    <v-icon class="red--text" left>delete</v-icon>Delete all
                    selected
                  </span>
                </v-btn>
              </v-flex>
              <v-flex xs12 md2>
                <v-dialog v-model="branchDialog" max-width="400px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      dark
                      class="ma-5 green pl-10 pr-10"
                      v-on="on"
                      @click="addBranchClicked"
                    >
                      <span class="text-capitalize">
                        <v-icon class="white--text">add</v-icon>Add Branch
                      </span>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ branchRegOrUpdateTitle }}</span>
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        class="pr-10 mt-2"
                        @click="branchDialog = false"
                      >
                        <span class="text-capitalize">
                          <v-icon left class="red--text">close</v-icon>close
                        </span>
                      </v-btn>
                    </v-card-title>
                    <div id="branchRegistration" class="text-center pa-4">
                      <v-form v-model="checkValidity" @submit.prevent>
                        <v-flex xs12>
                          <v-text-field
                            v-model="branchName"
                            label="Branch name"
                            outlined
                            prepend-icon="hotel"
                            :rules="branchNameRule"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field
                            v-model="branchCity"
                            label="City"
                            outlined
                            prepend-icon="language"
                            :rules="branchCityRule"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field
                            v-model="branchRegion"
                            label="Region"
                            outlined
                            prepend-icon="book"
                            :rules="branchRegionRule"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field
                            v-model="branchTelephone"
                            label="Telephone"
                            outlined
                            prepend-icon="phone"
                            :rules="branchTelephoneRule"
                          ></v-text-field>
                        </v-flex>
                        <v-btn
                          type="submit"
                          text
                          dark
                          class="green"
                          @click="saveBranchInfo"
                          :loading="branchSaveLoading"
                        >
                          <span class="text-capitalize">Save</span>
                        </v-btn>
                      </v-form>
                    </div>
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
          <template v-slot:[`item.branchAdminId`]="{ item }">
            <div v-if="!item.branchAdminId">
              <v-btn
                :id="`${item._id}`"
                text
                dark
                v-if="!item.branchAdminId && item._id != assignAdminIdIndex"
                @click="assignAdminId($event)"
              >
                <span class="text-capitalize blue--text"> Assign admin </span>
              </v-btn>
              <v-flex
                xs8
                v-if="!item.branchAdminId && item._id == assignAdminIdIndex"
              >
                <v-form class="text-center" @submit.prevent>
                  <v-select
                    v-if="!item.branchAdminId"
                    v-model="selectedAdmin"
                    placeholder="Choose admin"
                    :items="allAdminName"
                  ></v-select>
                  <v-btn
                    type="submit"
                    @click="assignAdmin(item)"
                    dark
                    text
                    class="blue mb-2"
                    v-if="selectedAdmin"
                    :loading="adminAssignLoading"
                  >
                    <span class="text-capitalize">Save</span>
                  </v-btn>
                </v-form>
              </v-flex>
            </div>
            <div v-else>
              <span v-for="(admins, index) in allAdmins" :key="index">
                <span v-if="item.branchAdminId == admins._id">{{
                  admins.firstName + " " + admins.middleName
                }}</span>
              </span>
            </div>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div
              v-if="
                allBranchs.indexOf(selectedBranch[0]) ==
                  allBranchs.indexOf(item) && singleSelect
              "
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="blue--text mr-2"
                    @click="editBranch(item)"
                    >edit</v-icon
                  >
                </template>
                <span>Update branch</span>
              </v-tooltip>

              <v-tooltip top dark>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="red--text ml-2"
                    @click="deleteBranch(item)"
                    >delete</v-icon
                  >
                </template>
                <span>Delete Branch</span>
              </v-tooltip>
              <span v-if="item.branchAdminId">
                <a
                  v-if="item.branchAdminId"
                  @click="shiftAdminClicked(item)"
                  class="ml-5"
                >
                  Shift admin
                </a>
                <v-flex
                  xs8
                  v-if="item.branchAdminId && item._id == shiftAdminIdIndex"
                >
                  <v-form class="text-center" @submit.prevent>
                    <v-select
                      v-if="item.branchAdminId"
                      v-model="selectedBranchForShift"
                      placeholder="Choose branch"
                      :items="allBranchsName"
                    ></v-select>
                    <v-btn
                      type="submit"
                      :loading="adminShiftLoading"
                      @click="shiftAdmin(item)"
                      text
                      class="blue"
                      dark
                      v-if="selectedBranchForShift"
                    >
                      <span class="text-capitalize">Shift</span>
                    </v-btn>
                  </v-form>
                </v-flex>

                <v-btn
                  text
                  :loading="deleteAdminLoading"
                  v-if="item.branchAdminId"
                  @click="deleteAdmin(item)"
                  ><span class="blue--text text-capitalize"
                    >Delete admin</span
                  ></v-btn
                >
              </span>
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
  data() {
    return {
      branchLoading: false,
      singleSelect: true,
      search: "",
      branchName: "",
      branchCity: "",
      branchRegion: "",
      branchTelephone: "",
      branchDialog: false,
      checkValidity: false,
      branchSaveLoading: false,
      adminAssignLoading: false,
      assignAdminDialog: false,
      deleteBranchLoading: false,
      adminShiftLoading: false,
      deleteAdminLoading: false,
      selectedAdmin: "",
      selectedBranchForShift: "",
      assignAdminIdIndex: "",
      shiftAdminIdIndex: "",
      adminId: "",
      adminPhone: "",
      branchSelectedItem: "",
      branchRegOrUpdateTitle: "",
      whatToDo: "",

      headers: [
        {
          text: "Branch name",
          align: "start",
          value: "branchName",
        },
        { text: "City", value: "branchCity" },
        { text: "Region", value: "branchRegion" },
        { text: "Telephone", value: "branchTelephone" },
        { text: "Admin", value: "branchAdminId" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      selectedBranch: [],
      allBranchs: [],
      allAdmins: [],
      allAdminName: [],
      allBranchsName: [],
      branchNameRule: [
        (v) =>
          /^[a-zA-Z 0-9]{2,32}$/.test(v) ||
          "Please enter valid branch name. It contains a-z, A-Z or 0-9",
      ],
      branchCityRule: [
        (v) =>
          /^[a-zA-Z 0-9]{2,32}$/.test(v) ||
          "Please enter valid branch city. It contains a-z, A-Z or 0-9",
      ],
      branchRegionRule: [
        (v) =>
          /^[a-zA-Z 0-9]{2,32}$/.test(v) ||
          "Please enter valid branch region. It contains a-z, A-Z or 0-9",
      ],
      branchTelephoneRule: [
        (v) =>
          /^[+]{1}[2]{1}[5]{1}[1]{1}[0-9]{9}$/.test(v) ||
          "Please enter valid telephone. Like +2513488348907",
      ],
    };
  },
  methods: {
    addBranchClicked() {
      this.whatToDo = "add";
      this.branchRegOrUpdateTitle = "Branch registration";
      this.branchName = "";
      this.branchCity = "";
      this.branchRegion = "";
      this.branchTelephone = "";
    },
    shiftAdminClicked(item) {
      this.allBranchsName.splice(
        this.allBranchsName.indexOf(
          item.branchName + " " + item.branchTelephone
        ),
        1
      );
      this.shiftAdminIdIndex = item._id;
    },
    assignAdminId(event) {
      this.assignAdminIdIndex = event.currentTarget.id;
    },
    async saveBranchInfo() {
      if (this.checkValidity) {
        this.branchSaveLoading = true;
        if (this.whatToDo == "add") {
          try {
            const branchResponse = await apiService.saveBranchInfo({
              branchName: this.branchName,
              branchCity: this.branchCity,
              branchRegion: this.branchRegion,
              branchTelephone: this.branchTelephone,
            });
            this.allBranchs.push(branchResponse.data.branchInfo);
            alert("Branch registered successfully!");
            this.branchDialog = false;
            this.branchSaveLoading = false;
          } catch (err) {
            this.branchSaveLoading = false;
            if (err.response) {
              if (err.response.data.error == 0) {
                this.$store.dispatch("setAdmin", "");
                this.$store.dispatch("setAdminToken", "");
                this.$store.dispatch("setSession", false);
                this.$router.push({ name: "adminLoginPage" });
              } else alert(err.response.data.error);
            } else alert("Connection to server failed");
          }
        } else if (this.whatToDo == "update") {
          try {
            await apiService.updateBranchInfo({
              branchName: this.branchName,
              branchCity: this.branchCity,
              branchRegion: this.branchRegion,
              branchTelephone: this.branchTelephone,
              branchId: this.branchSelectedItem._id,
            });

            alert("Branch updated successfully!");

            Object.assign(
              this.allBranchs[this.allBranchs.indexOf(this.branchSelectedItem)],
              {
                branchName: this.branchName,
                branchCity: this.branchCity,
                branchRegion: this.branchRegion,
                branchTelephone: this.branchTelephone,
              }
            );

            this.branchDialog = false;
            this.branchSaveLoading = false;
          } catch (err) {
            this.branchSaveLoading = false;
            if (err.response) {
              if (err.response.data.error == 0) {
                this.$store.dispatch("setAdmin", "");
                this.$store.dispatch("setAdminToken", "");
                this.$store.dispatch("setSession", false);
                this.$router.push({ name: "adminLoginPage" });
              } else alert(err.response.data.error);
            } else alert("Connection to server failed");
          }
        }
      } else alert("Please fill all the requirements");
    },

    async assignAdmin(item) {
      let counter = 0;
      for (counter = 0; counter < this.allAdmins.length; counter++) {
        if (
          this.selectedAdmin ==
          this.allAdmins[counter].firstName +
            " " +
            this.allAdmins[counter].middleName +
            " " +
            this.allAdmins[counter].lastName +
            " " +
            this.allAdmins[counter].phoneNumber
        ) {
          this.adminId = this.allAdmins[counter]._id;
          this.adminPhone = this.allAdmins[counter].phoneNumber;
        }
      }
      try {
        this.adminAssignLoading = true;
        await apiService.assignAdmin({
          branchId: item._id,
          branchAdminId: this.adminId,
          branchName: item.branchName,
          adminPhone: this.adminPhone,
        });
        alert("Admin assigned for " + item.branchName);
        this.allAdminName.splice(
          this.allAdminName.indexOf(this.selectedAdmin),
          1
        );
        const index = this.allBranchs.indexOf(item);
        this.allBranchs[index].branchAdminId = this.adminId;
        this.adminAssignLoading = false;
        this.assignAdminDialog = false;
        this.selectedAdmin = "";
      } catch (err) {
        this.adminAssignLoading = false;
        if (err.response) {
          if (err.response.data.error == 0) {
            this.$store.dispatch("setAdmin", "");
            this.$store.dispatch("setAdminToken", "");
            this.$store.dispatch("setSession", false);
            this.$router.push({ name: "adminLoginPage" });
          } else alert(err.response.data.error);
        } else alert("Connection to server failed");
      }
    },
    editBranch(item) {
      this.whatToDo = "update";

      this.branchName = item.branchName;
      this.branchCity = item.branchCity;
      this.branchRegion = item.branchRegion;
      this.branchTelephone = item.branchTelephone;
      this.branchRegOrUpdateTitle = "Update branch";
      this.branchDialog = true;
      this.branchSelectedItem = item;
    },

    async deleteBranch(item) {
      const deleteConfirmation = confirm(
        "Are you sure you want to delete this(these) branch(s)?"
      );

      if (deleteConfirmation == true) {
        let count = 0;
        try {
          if (this.singleSelect) {
            await apiService.deleteBranch({
              branchId: item._id,
              branchAdminId: item.branchAdminId,
            });
            this.allBranchs.splice(this.allBranchs.indexOf(item), 1);
            this.selectedBranch = [];
            alert("Branch deleted");
          } else {
            this.deleteBranchLoading = true;
            let i = 0;
            for (i = 0; i < item.length; i++) {
              await apiService.deleteBranch({
                branchId: item[i]._id,
                branchAdminId: item[i].branchAdminId,
              });
              this.allBranchs.splice(this.allBranchs.indexOf(item[i]), 1);
              count++;
            }
            alert(count + " Branchs deleted");
            this.deleteBranchLoading = false;

            this.selectedBranch = [];
            count = 0;
          }
        } catch (err) {
          this.deleteBranchLoading = false;
          if (err.response) {
            if (err.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else alert(err.response.data.error);
          } else alert("Connection to server  failed");
        }
      }
    },

    async shiftAdmin(item) {
      let counter = 0;
      let index = 0;
      var destinationBranchId = "";
      var destinationBranchName = "";
      var destinationAdminId = "";
      var adminName = "";
      for (counter = 0; counter < this.allBranchs.length; counter++) {
        if (
          this.selectedBranchForShift ==
          this.allBranchs[counter].branchName +
            " " +
            this.allBranchs[counter].branchTelephone
        ) {
          destinationBranchId = this.allBranchs[counter]._id;
          destinationBranchName = this.allBranchs[counter].branchName;
          destinationAdminId = this.allBranchs[counter].branchAdminId;
          break;
        }
      }
      for (index = 0; index < this.allAdmins.length; index++) {
        if (item.branchAdminId == this.allAdmins[index]._id) {
          adminName =
            this.allAdmins[index].firstName +
            " " +
            this.allAdmins[index].middleName;
          break;
        }
      }

      const shiftConfirmation = confirm(
        "Are you sure you want to shift " +
          adminName +
          " from " +
          item.branchName +
          " to " +
          destinationBranchName +
          " ?"
      );

      if (shiftConfirmation) {
        try {
          this.adminShiftLoading = true;
          await apiService.shiftAdmin({
            firstBranchId: item._id,
            secondBranchId: destinationBranchId,
            adminId: item.branchAdminId,
            destinationBranchName: destinationBranchName,
            destinationAdminId: destinationAdminId,
          });
          this.adminShiftLoading = false;
          this.selectedBranchForShift = "";
          this.allBranchs[counter].branchAdminId = item.branchAdminId;
          this.allBranchs[this.allBranchs.indexOf(item)].branchAdminId = "";
          alert("Admin shifted successfully");
        } catch (err) {
          this.adminShiftLoading = false;
          if (err.response) {
            if (err.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else alert(err.response.data.error);
          } else alert("Connection to server failed");
        }
      }
      this.allBranchsName.push(item.branchName + " " + item.branchTelephone);
      this.selectedBranchForShift = "";
      this.shiftAdminIdIndex = "";
    },
    async deleteAdmin(item) {
      const deleteConfirmation = confirm(
        "Are you sure you want to delete this admin from " +
          item.branchName +
          " ?"
      );
      if (deleteConfirmation) {
        var adminCounter = 0;
        var adminNameCounter = 0;
        for (
          adminCounter = 0;
          adminCounter < this.allAdmins.length;
          adminCounter++
        ) {
          if (item.branchAdminId == this.allAdmins[adminCounter]._id) {
            for (
              adminNameCounter = 0;
              adminNameCounter < this.allAdminName.length;
              adminNameCounter++
            ) {
              if (
                this.allAdminName[adminNameCounter] ==
                this.allAdmins[adminCounter].firstName +
                  " " +
                  this.allAdmins[adminCounter].middleName +
                  " " +
                  this.allAdmins[adminCounter].lastName +
                  " " +
                  this.allAdmins[adminCounter].phoneNumber
              ) {
                break;
              }
            }
            break;
          }
        }
        try {
          this.deleteAdminLoading = true;
          await apiService.deleteBranchAdmin({
            branchId: item._id,
            branchAdminId: item.branchAdminId,
          });

          this.allBranchs[this.allBranchs.indexOf(item)].branchAdminId = "";
          this.allAdmins.splice(adminCounter, 1);
          this.allAdminName.splice(adminNameCounter, 1);
          alert("Admin deleted successfully");
        } catch (err) {
          this.deleteAdminLoading = false;
          if (err.response) {
            if (err.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else alert(err.response.data.error);
          } else alert("Connection to server failed");
        }
      }
    },
  },
  async created() {
    this.branchLoading = true;
    try {
      const allBranchResponse = await apiService.getAllBranchs();
      this.branchLoading = false;
      this.allBranchs = allBranchResponse.data.allBranchs;
      let count = 0;
      for (count = 0; count < this.allBranchs.length; count++) {
        this.allBranchsName.push(
          this.allBranchs[count].branchName +
            " " +
            this.allBranchs[count].branchTelephone
        );
      }
    } catch (err) {
      this.branchLoading = false;
      if (err.response) {
        if (err.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        } else alert(err.response.data.error);
      } else alert("Connection to server failed");
    }
    this.branchLoading = true;
    try {
      const allAdminsResponse = await apiService.getAllAdmins();
      this.branchLoading = false;
      var allAdmin = allAdminsResponse.data.allAdmins;
      this.allAdmins = allAdmin;
      let counter = 0;
      for (counter = 0; counter < allAdmin.length; counter++) {
        if (allAdmin[counter].adminAssigned == false) {
          this.allAdminName.push(
            allAdmin[counter].firstName +
              " " +
              allAdmin[counter].middleName +
              " " +
              allAdmin[counter].lastName +
              " " +
              allAdmin[counter].phoneNumber
          );
        }
      }
    } catch (err) {
      this.branchLoading = false;
      if (err.response) {
        if (err.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        } else alert(err.response.data.error);
      } else alert("Connection to server failed");
    }
  },
};
</script>
<style scopped>
#branchRegistration {
  max-width: 300px;
  margin: auto;
}
</style>
