const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const config = require("../config/config");
const adminRequireConnection = require("../database/adminSchema");
const supperAdminConnection = require("../database/supperAdminSchema");
const passwordEncription = require("../Encription/passwordEncriptionComparison");
const adminConnectionModel = mongoose.model("adminCollection");
const supperAdminModel = mongoose.model("supperAdminCollection");

module.exports = {
	async adminRegistration(req, res) {
		const adminConnection = new adminConnectionModel();
		adminConnection.firstName = req.body.firstName;
		adminConnection.middleName = req.body.middleName;
		adminConnection.lastName = req.body.lastName;
		adminConnection.phoneNumber = req.body.phoneNumber;
		adminConnection.address = req.body.address;
		adminConnection.adminUserName = "";
		adminConnection.adminPassword = "";
		adminConnection.actor = "branch";
		adminConnection.adminPicture = req.body.adminPicture;
		adminConnection.adminAssigned = false;
		adminConnection.assignedTo = "";
		try {
			await adminConnection.save((err, admin) => {
				if (err) {
					return res.status(403).send({
						error: "Admin already exist",
					});
				}
				if (admin != "") {
					return res.send({
						admin: admin,
					});
				} else
					return res.status(404).send({
						error: "Admin not registered",
					});
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async adminLogin(req, res) {
		const adminLoginQuery = {
			adminUserName: req.body.adminUserName,
		};
		if (req.body.actor == "branch") {
			try {
				await adminRequireConnection.findOne(adminLoginQuery, (err, admin) => {
					if (err)
						return res.status(400).send({
							error: err,
						});
					if (!admin) {
						return res.status(404).send({
							error: "Username does not exist try again",
						});
					} else {
						if (
							passwordEncription.comparePassword(
								req.body.adminPassword,
								admin.adminPassword
							)
						) {
							const adminJson = admin.toJSON();
							res.send({
								admin: adminJson,
								adminToken: jwtSignUser(adminJson),
							});
						} else
							res.status(400).send({
								error: "Incorrect password",
							});
					}
				});
			} catch (err) {
				res.status(500).send({
					error: err,
				});
			}
		} else if (req.body.actor == "supper") {
			try {
				await supperAdminConnection.findOne(adminLoginQuery, (err, admin) => {
					if (err)
						return res.status(400).send({
							error: err,
						});
					if (!admin) {
						return res.status(404).send({
							error: "Username does not exist try again",
						});
					} else {
						if (
							passwordEncription.comparePassword(
								req.body.adminPassword,
								admin.adminPassword
							)
						) {
							const adminJson = admin.toJSON();
							res.send({
								admin: adminJson,
								adminToken: jwtSignUser(adminJson),
							});
						} else
							res.status(400).send({
								error: "Incorrect password",
							});
					}
				});
			} catch (err) {
				res.status(500).send({
					error: err,
				});
			}
		}
	},
};

function jwtSignUser(admin) {
	return JWT.sign(admin, config.authentication.jwtSecret, {
		expiresIn: 24 * 60 * 60,
	});
}
