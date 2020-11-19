<template>
  <div>
    <div v-if="$store.state.isAdminLoggedIn" class="container white pt-3">
      <p>
        <span class="headline">Events/</span>
        <span class="grey--text">&nbsp;List of events</span>

        <span
          v-if="eventRegistrationSuccess"
          class="ml-10 green--text text-center"
          >{{ eventRegistrationSuccess }}</span
        >
        <span
          v-if="eventRegistrationError"
          class="ml-10 pl-10 red--text text-center"
        >
          {{ eventRegistrationError }}
        </span>
        <span
          v-if="getAllEventsError"
          class="ml-10 pl-10 red--text text-center"
        >
          {{ getAllEventsError }}
        </span>
      </p>
      <div class="text-center">
        <v-btn text :loading="eventLoading" v-if="eventLoading">
          <span>loading...</span>
        </v-btn>
        <v-data-table
          v-if="!eventLoading"
          :search="search"
          v-model="selectedEvent"
          :headers="headers"
          :items="getAllEvents"
          :single-select="singleSelect"
          item-key="eventTitle"
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
              <v-flex xs12 md3 v-if="selectedEvent.length > 1 && !singleSelect">
                <v-btn
                  text
                  :loading="deleteEventLoading"
                  class="mt-5 grey lighten-4"
                  @click="deleteEvent(selectedEvent)"
                >
                  <span class="text-capitalize">
                    <v-icon class="red--text" left>delete</v-icon>Delete
                    selected events
                  </span>
                </v-btn>
              </v-flex>
              <v-flex xs12 md3>
                <v-dialog v-model="eventDialog" max-width="800px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      text
                      class="ma-5 green pl-10 pr-10"
                      dark
                      @click="eventAddClicked"
                    >
                      <span class="text-capitalize">Add Event</span>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ eventRegOrUpdateTitle }}</span>
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        class="grey lighten-4 pl-10 pr-10 ml-6 mt-2"
                        @click="eventDialog = false"
                      >
                        <span class="text-capitalize">
                          <v-icon left class="red--text">close</v-icon>close
                        </span>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <p class="text-center red--text">
                        <span
                          v-if="eventRegistrationError"
                          class="ml-10 pl-10 red--text text-center"
                          >{{ eventRegistrationError }}</span
                        >
                      </p>
                      <v-form v-model="checkValidity">
                        <v-layout row wrap justify-space-around>
                          <v-flex xs12 md4 class="pa-2">
                            <v-text-field
                              v-model="eventName"
                              :rules="eventNameValidation"
                              label="Event Title"
                              prepend-icon="title"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs12 md4 class="pa-2 mt-3">
                            <v-textarea
                              auto-grow
                              rows="1"
                              row-height="10"
                              outlined
                              label="Event description"
                              v-model="eventDescription"
                              :rules="eventDescriptionValidation"
                              prepend-icon="note"
                            ></v-textarea>
                          </v-flex>

                          <v-flex xs12 md3 class="pa-2 mt-3">
                            <div class="grey lighten-2" id="imageUploadBox">
                              <input
                                type="file"
                                class="mb-10 input-file"
                                ref="image"
                                @change="selectEventImage"
                                accept="image/*"
                              />
                              <p class="text-center pt-3">
                                <v-icon left>cloud_upload</v-icon>
                                Image
                              </p>
                            </div>
                          </v-flex>
                          <v-flex
                            xs12
                            md4
                            class="pt-0"
                            v-if="eventImagePreview || eventImage"
                          >
                            <v-img
                              cover
                              v-if="eventImagePreview && !isEditEventClicked"
                              :src="eventImagePreview"
                              contain
                              height="100"
                            ></v-img>
                            <v-img
                              cover
                              v-if="isEditEventClicked && eventImage"
                              :src="
                                require(`../../../../server/images/${eventImage}`)
                              "
                              contain
                              height="150"
                            ></v-img>
                            <v-switch
                              v-if="whatToDo == 'update'"
                              v-model="isEditEventClicked"
                              label="Use old"
                            ></v-switch>
                          </v-flex>

                          <v-flex xs12 md4 class="pa-2">
                            <v-menu
                              v-model="eventMenu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="eventDate"
                                  label="Event date"
                                  prepend-icon="event"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="eventDate"
                                @input="eventMenu = false"
                              ></v-date-picker>
                            </v-menu>
                          </v-flex>
                          <v-flex xs12 md4 class="pa-2">
                            <v-menu
                              ref="menu"
                              v-model="menu2"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              :return-value.sync="startTime"
                              transition="scale-transition"
                              offset-y
                              max-width="100px"
                              min-width="200px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="startTime"
                                  label="Event starting time"
                                  prepend-icon="event"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-if="menu2"
                                v-model="startTime"
                                full-width
                                @click:minute="$refs.menu.save(startTime)"
                              ></v-time-picker>
                            </v-menu>
                          </v-flex>
                          <v-flex xs12 md4>
                            <v-select
                              denses
                              label="Choose Level"
                              v-model="selectedLevel"
                              :items="levels"
                              prepend-icon="signal_cellular_alt"
                            ></v-select>
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

                          <v-flex xs12 md3 class="pa-2 mt-3">
                            <v-btn
                              dark
                              text
                              class="primary"
                              @click="saveEvent"
                              :loading="eventRegistrationLoading"
                            >
                              <span class="text-capitalize">Save Event</span>
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
          <template v-slot:[`item.eventDescription`]="{ item }">
            <p class="d-inline-block text-truncate" style="max-width: 150px">
              {{ item.eventDescription }}
            </p>
          </template>
          <template v-slot:[`item.eventImage`]="{ item }">
            <v-img
              v-if="item.eventImage"
              :src="require(`../../../../server/images/${item.eventImage}`)"
              alt="Image"
              contain
              height="50px"
              width="50px"
            ></v-img>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div
              v-if="
                getAllEvents.indexOf(selectedEvent[0]) ==
                  getAllEvents.indexOf(item) && singleSelect
              "
            >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="blue--text mr-2"
                    @click="editEvent(item)"
                    >edit</v-icon
                  >
                </template>
                <span>Update event</span>
              </v-tooltip>

              <v-tooltip top dark>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    small
                    class="red--text ml-2"
                    @click="deleteEvent(item)"
                    >delete</v-icon
                  >
                </template>
                <span>Delete event</span>
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
    eventRegistrationSuccess: "",
    eventRegistrationError: "",
    getAllEventsError: "",

    eventLoading: false,
    singleSelect: true,
    eventDialog: false,
    checkValidity: false,
    eventRegistrationLoading: false,
    eventRegOrUpdateTitle: "",

    search: "",
    eventName: "",
    selectedLevel: "",
    eventDescription: "",

    limitedNumberPeople: 0,
    eventImage: "",
    eventSelectedItem: "",
    whatToDo: "",

    eventImageToBinary: "",
    eventImagePreview: "",
    isEditEventClicked: true,
    deleteEventLoading: false,

    levels: ["Gold", "Bronze", "silver", "Diamend", "All"],

    selectedEvent: [],
    getAllEvents: [],

    eventMenu: false,
    startTime: null,
    menu2: false,

    eventDate: new Date().toISOString().substr(0, 10),

    eventNameValidation: [
      (v) =>
        /^[A-Za-z 0-9ሀ-ፐ]{2,32}/.test(v) ||
        "Invalid event name, it contains A-Z, a-z, , 0-9, ሀ-ፐ and minimum 2 and maximum 32 characters",
    ],
    eventDescriptionValidation: [
      (input) =>
        /^[a-zA-Z0-9.\n ]{8,250}$/.test(input) ||
        "Description  contains a-z,A-Z,0-9 or space and with at least 8 characters andd maximum 250 characters",
    ],
    headers: [
      {
        text: "Event Title",
        align: "start",
        value: "eventTitle",
      },
      {
        text: "Event Date",

        value: "eventDate",
      },
      {
        text: "Event Time",

        value: "eventStartTime",
      },
      {
        text: "Branch",

        value: "eventBranch",
      },
      {
        text: "Description",

        value: "eventDescription",
      },
      {
        text: "Level",

        value: "selectedLevel",
      },
      {
        text: "No People",

        value: "numberOfPeople",
      },
      {
        text: "Image",

        value: "eventImage",
      },
      {
        text: "Actions",

        value: "actions",
      },
    ],
  }),

  methods: {
    selectEventImage() {
      this.eventImageToBinary = this.$refs.image.files[0];
      const image = this.eventImageToBinary;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.isEditEventClicked = false;
        this.eventImagePreview = e.target.result;
      };
    },
    eventAddClicked() {
      this.whatToDo = "add";
      this.eventRegOrUpdateTitle = "Event registration";
    },
    async saveEvent() {
      this.eventRegistrationError = "";
      this.eventRegistrationSuccess = "";
      if (this.checkValidity) {
        if (this.whatToDo == "add") {
          if (
            this.startTime != null &&
            this.eventDate >= new Date().toISOString().substr(0, 10)
          ) {
            this.eventRegistrationLoading = true;
            try {
              if (this.eventImagePreview && !this.isEditEventClicked) {
                const formData = new FormData();
                formData.append("img", this.eventImageToBinary);
                const eventImageResponse = await apiService.uploadImage(
                  formData
                );
                this.eventImage = eventImageResponse.data.imageUrl;
              }
              const eventResponsee = await apiService.saveEvent({
                eventTitle: this.eventName,
                eventDescription: this.eventDescription,
                eventImage: this.eventImage,
                eventDate: this.eventDate,
                eventStartTime: this.startTime,
                selectedLevel: this.selectedLevel,
                numberOfPeople: this.limitedNumberPeople,
                eventBranch: this.$store.state.admin.assignedTo,
              });

              this.getAllEvents.push(eventResponsee.data.event);
              this.eventRegistrationSuccess = "Event registered successfully!";
              this.eventRegistrationError = "";
              this.eventRegistrationLoading = false;
              this.eventDialog = false;
            } catch (err) {
              this.eventRegistrationLoading = false;
              this.eventRegistrationSuccess = "";
              if (err.response) {
                if (err.response.data.error == 0) {
                  this.$store.dispatch("setAdmin", "");
                  this.$store.dispatch("setAdminToken", "");
                  this.$store.dispatch("setSession", false);
                  this.$router.push({ name: "adminLoginPage" });
                } else this.eventRegistrationError = err.response.data.error;
              } else
                this.eventRegistrationError = "Connection to server failed";
            }
          } else
            this.eventRegistrationError =
              "Please make sure event date abd time are correct";
        } else if (this.whatToDo == "update") {
          this.eventRegistrationLoading = true;
          try {
            if (this.eventImagePreview && !this.isEditEventClicked) {
              const formData = new FormData();
              formData.append("img", this.eventImageToBinary);
              const eventImageResponse = await apiService.uploadImage(formData);
              this.eventImage = eventImageResponse.data.imageUrl;
            }
            await apiService.updateEvent({
              eventTitle: this.eventName,
              eventDescription: this.eventDescription,
              eventImage: this.eventImage,
              eventDate: this.eventDate,
              eventStartTime: this.startTime,
              selectedLevel: this.selectedLevel,
              numberOfPeople: this.limitedNumberPeople,
              eventId: this.eventSelectedItem._id,
            });

            Object.assign(
              this.getAllEvents[
                this.getAllEvents.indexOf(this.eventSelectedItem)
              ],
              {
                eventTitle: this.eventName,
                eventDescription: this.eventDescription,
                eventImage: this.eventImage,
                eventDate: this.eventDate,
                eventStartTime: this.startTime,
                selectedLevel: this.selectedLevel,
                numberOfPeople: this.limitedNumberPeople,
              }
            );
            this.eventRegistrationSuccess = "Event updated successfully!";
            this.eventRegistrationError = "";
            this.eventRegistrationLoading = false;
            this.eventDialog = false;
          } catch (err) {
            this.eventRegistrationLoading = false;
            this.eventRegistrationSuccess = "";
            if (err.response) {
              if (err.response.data.error == 0) {
                this.$store.dispatch("setAdmin", "");
                this.$store.dispatch("setAdminToken", "");
                this.$store.dispatch("setSession", false);
                this.$router.push({ name: "adminLoginPage" });
              } else this.eventRegistrationError = err.response.data.error;
            } else this.eventRegistrationError = "Connection to server failed";
          }
        }
      } else
        this.eventRegistrationError = "Please fill all the required fields";

      setTimeout(() => {
        this.eventRegistrationError = "";
        this.eventRegistrationSuccess = "";
        this.getAllEventsError = "";
      }, 5000);
    },
    editEvent(item) {
      this.whatToDo = "update";
      this.eventRegOrUpdateTitle = "Update Event";
      this.eventDialog = true;

      this.eventName = item.eventTitle;
      this.eventDescription = item.eventDescription;
      this.eventImage = item.eventImage;
      this.eventDate = item.eventDate;
      this.startTime = item.eventStartTime;
      this.selectedLevel = item.selectedLevel;
      this.limitedNumberPeople = item.numberOfPeople;

      this.eventSelectedItem = item;
    },
    async deleteEvent(item) {
      const deleteConfirmation = confirm(
        "Are you sure you want to delete this(these) events(s) ?"
      );
      if (deleteConfirmation) {
        let count = 0;
        try {
          if (this.singleSelect) {
            await apiService.deleteEvent({
              eventId: item._id,
            });
            this.getAllEvents.splice(this.getAllEvents.indexOf(item), 1);
            this.selectedEvent = [];
            this.eventRegistrationError = "Event deleted";
          } else {
            this.deleteEventLoading = true;
            let i = 0;
            for (i = 0; i < item.length; i++) {
              await apiService.deleteEvent({
                eventId: item[i]._id,
              });
              this.getAllEvents.splice(this.getAllEvents.indexOf(item[i]), 1);
              count++;
            }
            this.eventRegistrationError = count + " Events deleted";
            this.deleteEventLoading = false;

            this.selectedEvent = [];
            count = 0;
          }
        } catch (err) {
          this.deleteEventLoading = false;
          if (err.response) {
            if (err.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else this.eventRegistrationError = err.response.data.error;
          } else this.eventRegistrationError = "Connection to server  failed";
        }
      }
      setTimeout(() => {
        this.eventRegistrationError = "";
        this.eventRegistrationSuccess = "";
        this.getAllEventsError = "";
      }, 5000);
    },
  },
  async created() {
    this.getAllEventsError = "";
    this.eventLoading = true;

    try {
      const response = await apiService.getAllEvents();
      this.eventLoading = false;
      this.getAllEvents = response.data.allEvents;
    } catch (error) {
      this.eventLoading = false;
      if (error.response) {
        if (error.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        } else this.getAllEventsError = error.response.data.error;
      } else this.getAllEventsError = "Connection to server failed";
    }
    setTimeout(() => {
      this.eventRegistrationError = "";
      this.eventRegistrationSuccess = "";
      this.getAllEventsError = "";
    }, 5000);
  },
};
</script>
<style  scoped>
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
.v-data-table {
  font-size: 24px;
  border: 1px solid rgb(223, 217, 217);
}
</style>