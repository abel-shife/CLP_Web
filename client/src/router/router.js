import Vue from "vue";
import Router from "vue-router";
import adminLoginPage from "../components/admin/adminLoginPage";
import adminRegistration from "../components/admin/adminRegistration";
import adminDashboard from "../components/admin/adminDashboard";
import serviceDisplay from "../components/service/services";
import customers from "../components/customer/customer";
import level from "../components/customer/level";
import rewards from "../components/customer/reward";
import earningPointRules from "../components/campaign/earningPointRules";
import offers from "../components/campaign/offers";
import event from "../components/campaign/event";
import supperAdminDashboard from "../components/admin/supperAdminDashBoard";
import branch from "../components/admin/branch";

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: "/",
			name: "adminLoginPage",
			component: adminLoginPage,
		},
		{
			path: "/adminRegistration",
			name: "adminRegistration",
			component: adminRegistration,
		},
		{
			path: "/adminDashboard",
			name: "adminDashboard",
			component: adminDashboard,
		},
		{
			path: "/customers",
			name: "customers",
			component: customers,
		},
		{
			path: "/levels",
			name: "levels",
			component: level,
		},
		{
			path: "/rewards",
			name: "rewards",
			component: rewards,
		},
		{
			path: "/serviceDisplay",
			name: "serviceDisplay",
			component: serviceDisplay,
		},
		{
			path: "/earningPointRules",
			name: "earningPointRules",
			component: earningPointRules,
		},
		{
			path: "/offers",
			name: "offers",
			component: offers,
		},
		{
			path: "/event",
			name: "event",
			component: event,
		},
		{
			path: "/Dashboard",
			name: "supperDashboard",
			component: supperAdminDashboard,
		},
		{
			path: "/branch",
			name: "branch",
			component: branch,
		},
	],
});
