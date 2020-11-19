const mongoose = require("mongoose");

const levelModelConnection = mongoose.model("levelCollection");
const levelConnection = require("../database/levelSchema");

module.exports = {
	async saveLevel(req, res) {
		const levelConnection = new levelModelConnection();

		levelConnection.levelName =
			req.body.levelName.charAt(0).toUpperCase() +
			req.body.levelName.slice(1).toLowerCase();
		levelConnection.levelDescription = req.body.levelDescription;
		levelConnection.maximumRange = req.body.maximumRange;
		levelConnection.minimumRange = req.body.minimumRange;
		levelConnection.noCustomers = 0;

		try {
			await levelConnection.save((err, level) => {
				if (err) {
					return res.status(403).send({
						error: "Level already registered",
					});
				} else if (level != "") {
					res.send({
						level: level,
					});
				} else
					return res.status(404).send({
						error: "Level not registered",
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
