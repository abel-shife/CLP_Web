const mongoose = require("mongoose");

const purchasePointRuleModel = mongoose.model("purchasePointRuleCollection");

const otherPointRuleModel = mongoose.model("otherPointRuleCollection");

const purchasePointRuleConnection = require("../database/purchasePointRuleSchema");
const otherPointRuleConnection = require("../database/otherPointRuleSchema");

module.exports = {
	async addPurchasePointRules(req, res) {
		const purchaseCollection = new purchasePointRuleModel();

		purchaseCollection.serviceName = req.body.serviceName;
		purchaseCollection.servicePrice = req.body.servicePrice;
		purchaseCollection.point = req.body.point;

		try {
			await purchaseCollection.save((err, point) => {
				if (err) {
					return res.status(403).send({
						error:
							"point already set with the same service name. Please try with other service",
					});
				} else if (point != "") {
					return res.send({
						point: point,
					});
				} else
					return res.status(403).send({
						error: "point not set",
					});
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},

	async getPurchasePointRules(req, res) {
		try {
			await purchasePointRuleConnection.find((err, purchasePointRules) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				}
				if (purchasePointRules == "") {
					return res.status(404).send({
						error: "There is no purchase point rule",
					});
				} else {
					return res.send({
						purchasePointRules: purchasePointRules,
					});
				}
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},
	async updatePurchasePointRules(req, res) {
		const purchasePointId = {
			_id: req.body.purchasePointId,
		};
		const purchasePoint = {
			point: req.body.point,
		};
		try {
			await purchasePointRuleConnection.updateOne(
				purchasePointId,
				purchasePoint,
				(err, updateResult) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					else if (updateResult.nModified == 1)
						return res.send({
							updateResult: updateResult,
						});
					else
						return res.status(404).send({
							error: "Point not updated, please make changes to update",
						});
				}
			);
		} catch (err) {
			return res.status(403).send({
				error: err,
			});
		}
	},
	async deletePurchasePoint(req, res) {
		const deletePurchasePointQuery = {
			_id: req.body.purchasePointId,
		};
		try {
			await purchasePointRuleConnection.deleteOne(
				deletePurchasePointQuery,
				(err, deleteResult) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					else if (deleteResult) {
						return res.send({
							deleteResult: deleteResult,
						});
					} else
						return res.status(404).send({
							error: "Delete not completed",
						});
				}
			);
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},

	async addOtherPointRules(req, res) {
		const otherCollection = new otherPointRuleModel();

		otherCollection.cause = req.body.cause;
		otherCollection.point = req.body.point;

		try {
			await otherCollection.save((err, point) => {
				if (err) {
					return res.status(403).send({
						error: "point already set with the same cause. Please try again",
					});
				} else if (point != "") {
					return res.send({
						point: point,
					});
				} else
					return res.status(404).send({
						error: "point not set",
					});
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},

	async getOtherRules(req, res) {
		try {
			await otherPointRuleConnection.find((err, otherPointRules) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				}
				if (otherPointRules == "") {
					return res.status(404).send({
						error: "There is no other point rule",
					});
				} else {
					return res.send({
						otherPointRules: otherPointRules,
					});
				}
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},
	async updateOtherPointRules(req, res) {
		const otherPointId = {
			_id: req.body.otherPointId,
		};
		const otherPoint = {
			point: req.body.point,
		};
		try {
			await otherPointRuleConnection.updateOne(
				otherPointId,
				otherPoint,
				(err, updateResult) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					else if (updateResult.nModified == 1)
						return res.send({
							updateResult: updateResult,
						});
					else
						return res.status(404).send({
							error: "Point not updated, please make changes to update",
						});
				}
			);
		} catch (err) {
			return res.status(403).send({
				error: err,
			});
		}
	},

	async deleteOtherPoint(req, res) {
		const deleteOtherPointQuery = {
			_id: req.body.otherPointId,
		};
		try {
			await otherPointRuleConnection.deleteOne(
				deleteOtherPointQuery,
				(err, deleteResult) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					else if (deleteResult) {
						return res.send({
							deleteResult: deleteResult,
						});
					} else
						return res.status(404).send({
							error: "Delete not completed",
						});
				}
			);
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},
};
