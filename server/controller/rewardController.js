const mongoose = require("mongoose");

const rewardModelConnection = mongoose.model("rewardCollection");
const rewardConnection = require("../database/rewardSchema");

module.exports = {
	async saveReward(req, res) {
		const rewardConnection = new rewardModelConnection();

		rewardConnection.rewardName =
			req.body.rewardName.charAt(0).toUpperCase() +
			req.body.rewardName.slice(1).toLowerCase();
		rewardConnection.rewardDescription = req.body.rewardDescription;
		rewardConnection.minPoint = req.body.minPoint;
		rewardConnection.level = req.body.level;
		rewardConnection.expiryDate = req.body.expiryDate;

		try {
			await rewardConnection.save((err, reward) => {
				if (err) {
					return res.status(403).send({
						error: "Reward already registered",
					});
				} else if (reward != "") {
					res.send({
						reward: reward,
					});
				} else
					return res.status(404).send({
						error: "Reward not registered",
					});
			});
		} catch (err) {
			return res.status(400).send({
				error: err,
			});
		}
	},
	async getAllRewards(req, res) {
		try {
			await rewardConnection.find((err, allRewards) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (allRewards == "") {
					return res.status(404).send({
						error: "There is no reward",
					});
				} else {
					res.send({
						allRewards: allRewards,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async updateReward(req, res) {
		const rewardUpdateInfo = {
			rewardName:
				req.body.rewardName.charAt(0).toUpperCase() +
				req.body.rewardName.slice(1).toLowerCase(),
			rewardDescription: req.body.rewardDescription,
			minPoint: req.body.minPoint,
			level: req.body.level,
			expiryDate: req.body.expiryDate,
		};
		const rewardId = {
			_id: req.body.rewardId,
		};

		try {
			await rewardConnection.updateOne(
				rewardId,
				rewardUpdateInfo,
				(err, updateResult) => {
					if (err)
						return res.status(403).send({
							error: "Reward not updated due to dublication reward name",
						});
					else if (updateResult.nModified == 1)
						return res.send({
							updateResult: updateResult,
						});
					else
						return res.status(404).send({
							error: "Reward not updated please make change to update",
						});
				}
			);
		} catch (err) {
			return res.status(403).send({
				error: err,
			});
		}
	},

	async deleteReward(req, res) {
		const deleteRewardQuery = {
			_id: req.body.rewardId,
		};
		try {
			await rewardConnection.deleteOne(
				deleteRewardQuery,
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
