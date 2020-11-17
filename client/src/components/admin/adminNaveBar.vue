<template>
  <div>
    <!-- for both branch and supper -->
    <v-app-bar
      flat
      app
      dark
      class="blue"
      height="50"
      v-if="!$store.state.isAdminLoggedIn"
    >
      <v-app-bar-nav-icon
        @click="sideBarDrawer = !sideBarDrawer"
        class="hidden-lg-only mt-3"
        v-if="$store.state.isAdminLoggedIn"
      >
        <v-icon large class="white--text">dehaze</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="ml-10">
        <span class="display-1 white--text">Loyalty|</span>
        <span class="headline">program</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <div class="hidden-md-and-up">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-app-bar-nav-icon class="blue text-capitalize" v-on="on">
              <span class="white--text">
                <v-icon>more_vert</v-icon>
              </span>
            </v-app-bar-nav-icon>
          </template>
          <v-list>
            <v-list-item
              id="menuItem"
              @click="navigator({ name: 'adminLoginPage' })"
              v-if="!$store.state.isAdminLoggedIn"
            >
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item id="menuItem">
              <v-list-item-title>Help</v-list-item-title>
            </v-list-item>
            <v-list-item
              id="menuItem"
              @click="navigator({ name: 'adminLoginPage' })"
              v-if="$store.state.isAdminLoggedIn"
            >
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <div class="hidden-xs-only hidden-sm-only">
        <v-btn
          text
          @click="navigator({ name: 'adminLoginPage' })"
          v-if="!$store.state.isAdminLoggedIn"
        >
          <span class="text-capitalize">Login</span>
        </v-btn>
        <v-btn text>
          <span class="text-capitalize">Help</span>
        </v-btn>
        <v-btn
          text
          @click="navigator({ name: 'adminLoginPage' })"
          v-if="$store.state.isAdminLoggedIn"
        >
          <span class="text-capitalize">Logout</span>
        </v-btn>
      </div>
    </v-app-bar>
    <!-- for branch only -->
    <v-app-bar
      flat
      app
      dark
      class="blue"
      height="50"
      v-if="$store.state.admin.actor == 'branch'"
    >
      <v-app-bar-nav-icon
        @click="sideBarDrawer = !sideBarDrawer"
        class="hidden-lg-only mt-3"
        v-if="$store.state.isAdminLoggedIn"
      >
        <v-icon large class="white--text">dehaze</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="ml-10">
        <span class="display-1 white--text">Loyalty|</span>
        <span class="headline">program</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <div class="hidden-md-and-up">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-app-bar-nav-icon class="blue text-capitalize" v-on="on">
              <span class="white--text">
                <v-icon>more_vert</v-icon>
              </span>
            </v-app-bar-nav-icon>
          </template>
          <v-list>
            <v-list-item
              id="menuItem"
              @click="navigator({ name: 'adminLoginPage' })"
              v-if="!$store.state.isAdminLoggedIn"
            >
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item id="menuItem">
              <v-list-item-title>Help</v-list-item-title>
            </v-list-item>
            <v-list-item
              id="menuItem"
              @click="navigator({ name: 'adminLoginPage' })"
              v-if="$store.state.isAdminLoggedIn"
            >
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <div class="hidden-xs-only hidden-sm-only">
        <v-btn
          text
          @click="navigator({ name: 'adminLoginPage' })"
          v-if="!$store.state.isAdminLoggedIn"
        >
          <span class="text-capitalize">Login</span>
        </v-btn>
        <v-btn text>
          <span class="text-capitalize">Help</span>
        </v-btn>
        <v-btn
          text
          @click="navigator({ name: 'adminLoginPage' })"
          v-if="$store.state.isAdminLoggedIn"
        >
          <span class="text-capitalize">Logout</span>
        </v-btn>
      </div>
    </v-app-bar>
    <!-- for supper only -->
    <v-app-bar
      flat
      app
      dark
      class="blue lighten-2"
      height="40"
      v-if="$store.state.admin.actor == 'supper'"
    >
      <v-app-bar-nav-icon
        @click="sideBarDrawer = !sideBarDrawer"
        class="hidden-lg-only mt-3"
        v-if="$store.state.isAdminLoggedIn"
      >
        <v-icon large class="white--text">dehaze</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="ml-10">
        <span class="white--text display-1">Logo</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div>
        <v-btn
          text
          @click="navigator({ name: 'adminLoginPage' })"
          v-if="!$store.state.isAdminLoggedIn"
        >
          <span class="text-capitalize">Login</span>
        </v-btn>

        <v-btn
          text
          @click="navigator({ name: 'adminLoginPage' })"
          v-if="$store.state.isAdminLoggedIn"
        >
          <span class="text-capitalize">Logout</span>
        </v-btn>
      </div>
    </v-app-bar>
    <!-- Branch admin side bar drawer -->
    <v-navigation-drawer
      v-model="sideBarDrawer"
      class="grey darken-1"
      app
      v-if="
        $store.state.isAdminLoggedIn && $store.state.admin.actor == 'branch'
      "
      id="sidNaveDrawer"
      width="220px"
    >
      <p>
        <a v-on:mouseover="mouseover" @mouseleave="mouseleave" class="ml-4">
          <v-avatar color="grey" size="80" class="ml-10 mt-5">
            <v-img
              id="adminProfile"
              v-if="$store.state.admin.adminPicture"
              :src="
                require(`../../../../server/images/${$store.state.admin.adminPicture}`)
              "
              alt="Picture"
            >
              <span class="mt-10 ml-7" v-if="editAdminProfile">
                <v-icon midium class="white--text">edit</v-icon>
              </span>
            </v-img>
          </v-avatar>
        </a>
      </p>
      <span class="white--text ml-10 pl-2 text-capitalize">
        {{ $store.state.admin.firstName }}&nbsp;{{
          $store.state.admin.middleName
        }}
      </span>
      <v-app-bar-nav-icon
        right
        @click="sideBarDrawer = !sideBarDrawer"
        class="ml-10 hidden-lg-only"
        v-if="$store.state.isAdminLoggedIn"
      >
        <v-icon class="white--text">close</v-icon>
      </v-app-bar-nav-icon>
      <v-divider class="white"></v-divider>
      <br />
      <dl class="pl-0">
        <v-btn
          text
          @click="navigator({ name: 'adminDashboard' })"
          id="sideBarBtns"
        >
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="yellow--text" left>home</v-icon>Dashboard
          </dt>
        </v-btn>

        <v-btn
          text
          id="sideBarBtns"
          @click="navigator({ name: 'serviceDisplay' })"
        >
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="yellow--text" left>restaurant</v-icon>Services
          </dt>
        </v-btn>

        <v-btn
          text
          @click="compaignClicked = !compaignClicked"
          id="sideBarBtns"
        >
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="yellow--text" left>event</v-icon>Campaign
            <v-icon class="mr-0 ml-4 white--text" right v-if="!compaignClicked"
              >navigate_next</v-icon
            >
            <v-icon class="mr-0 ml-4 white--text" right v-if="compaignClicked"
              >expand_more</v-icon
            >
          </dt>
        </v-btn>
        <v-btn
          text
          v-if="compaignClicked"
          id="sideBarBtns"
          @click="navigator({ name: 'earningPointRules' })"
        >
          <dd class="white--text pt-2 pb-2 text-capitalize">
            &nbsp;&nbsp;&nbsp;
            <v-icon class="blue--text" left>build</v-icon>
            <span>Earning point</span>
          </dd>
        </v-btn>
        <v-btn
          text
          v-if="compaignClicked"
          id="sideBarBtns"
          @click="navigator({ name: 'offers' })"
        >
          <dd class="white--text pt-2 pb-2 text-capitalize">
            &nbsp;&nbsp;&nbsp;
            <v-icon class="blue--text" left>emoji_food_beverage</v-icon>Offers
          </dd>
        </v-btn>
        <v-btn
          text
          v-if="compaignClicked"
          id="sideBarBtns"
          @click="navigator({ name: 'event' })"
        >
          <dd class="white--text pt-2 pb-2 text-capitalize">
            &nbsp;&nbsp;&nbsp;
            <v-icon class="blue--text" left>spa</v-icon>Events
          </dd>
        </v-btn>

        <v-btn text id="sideBarBtns" @click="navigator({ name: 'customers' })">
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="yellow--text" left>group</v-icon>Customer
          </dt>
        </v-btn>

        <v-btn text id="sideBarBtns" @click="navigator({ name: 'levels' })">
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="yellow--text" left>signal_cellular_alt</v-icon>Level
          </dt>
        </v-btn>
        <v-btn text id="sideBarBtns">
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="yellow--text" medium left>shopping_basket</v-icon
            >Transaction
          </dt>
        </v-btn>
        <v-btn text id="sideBarBtns" @click="navigator({ name: 'rewards' })">
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="yellow--text" left>emoji_events</v-icon>Reward
          </dt>
        </v-btn>
        <v-btn text id="sideBarBtns">
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="yellow--text" left>report</v-icon>Report
          </dt>
        </v-btn>
        <v-btn text id="sideBarBtns">
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="yellow--text" left>comment</v-icon>Comments
          </dt>
        </v-btn>
      </dl>
    </v-navigation-drawer>
    <!-- supper admin side bar drawer -->
    <v-navigation-drawer
      v-model="sideBarDrawer"
      class="grey darken-2"
      app
      v-if="
        $store.state.isAdminLoggedIn && $store.state.admin.actor == 'supper'
      "
      id="sidNaveDrawer"
      width="220px"
    >
      <v-toolbar-title class="">
        <span class="display-1 blue--text ml-2">Loyalty|</span>
        <span class="headline white--text">program</span>
      </v-toolbar-title>
      <v-layout raw wrap class="grey darken-1 pb-4 pl-3 mt-2">
        <v-flex xs5 class="">
          <a v-on:mouseover="mouseover" @mouseleave="mouseleave" class="">
            <v-avatar color="grey" size="60" class="ml-3 mt-5">
              <v-img
                id="adminProfile"
                v-if="$store.state.admin.adminPicture"
                :src="
                  require(`../../../../server/images/${$store.state.admin.adminPicture}`)
                "
                alt="Picture"
              >
                <span class="mt-10 ml-7" v-if="editAdminProfile">
                  <v-icon midium class="white--text">edit</v-icon>
                </span>
              </v-img>
            </v-avatar>
          </a>
        </v-flex>

        <v-flex xs6 class="mt-8">
          <span class="white--text pl-2 text-capitalize">
            {{ $store.state.admin.firstName }}&nbsp;{{
              $store.state.admin.middleName
            }}
            Administrator
          </span>
        </v-flex>
      </v-layout>

      <v-app-bar-nav-icon
        right
        @click="sideBarDrawer = !sideBarDrawer"
        class="ml-10 hidden-lg-only"
        v-if="$store.state.isAdminLoggedIn"
      >
        <v-icon class="white--text">close</v-icon>
      </v-app-bar-nav-icon>

      <br />
      <dl class="pl-0">
        <v-btn
          text
          @click="navigator({ name: 'supperDashboard' })"
          id="sideBarBtns"
        >
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="blue--text" left>home</v-icon>Dashboard
          </dt>
        </v-btn>
        <v-btn text @click="navigator({ name: 'branch' })" id="sideBarBtns">
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="blue--text" left>home</v-icon>Branch
          </dt>
        </v-btn>
        <v-btn
          text
          @click="navigator({ name: 'supperDashboard' })"
          id="sideBarBtns"
        >
          <dt class="white--text pl-4 pt-2 pb-2 text-capitalize">
            <v-icon class="blue--text" left>signal_cellular_alt</v-icon>Report
          </dt>
        </v-btn>
      </dl>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sideBarDrawer: true,
      editAdminProfile: false,
      compaignClicked: false,
    };
  },
  methods: {
    navigator(navigateTo) {
      if (navigateTo.name == "adminLoginPage") {
        this.$store.dispatch("setAdmin", "");
        this.$store.dispatch("setAdminToken", "");
        this.$store.dispatch("setSession", false);
      }
      this.$router.push(navigateTo);
    },
    mouseover: function () {
      this.editAdminProfile = true;
    },
    mouseleave: function () {
      this.editAdminProfile = false;
    },
  },
};
</script>
<style scoped>
#sidNaveDrawer {
  opacity: 1;
}
#adminProfile:hover {
  opacity: 0.7;
}
dl dt,
dl dd {
  list-style-type: none;
  font-size: 16px;
}
#sideBarBtns {
  width: 100%;
  padding-left: 10px;
  justify-content: left;
  justify-items: left;
  align-content: left;
  align-items: left;
  padding-top: 25px;
  padding-bottom: 25px;
  margin-top: 5px;
}
#sideBarBtns:hover {
  background-color: grey;
}
#menuItem:hover {
  background-color: rgb(245, 239, 239);
}
</style>
