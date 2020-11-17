const mongoose = require("mongoose");

const offerModelConnection = mongoose.model("offerCollection");
const offerConnection = require("../database/offerSchema");

module.exports = {
	async saveOffer(req, res) {
		const offerConnection = new offerModelConnection();

		offerConnection.offerTitle = req.body.offerTitle;
		offerConnection.serviceName = req.body.serviceName;
		offerConnection.servicePrice = req.body.servicePrice;
		offerConnection.selectedLevel = req.body.selectedLevel;
		offerConnection.selectedServiceCatagory = req.body.selectedServiceCatagory;
		offerConnection.selectedServiceSubCatagory =
			req.body.selectedServiceSubCatagory;
		offerConnection.serviceImage = req.body.serviceImage;
		offerConnection.discountPercent = req.body.discountPercent;
		offerConnection.discountPrice = req.body.discountPrice;
		offerConnection.numberOfPeople = req.body.numberOfPeople;
		offerConnection.startDate = req.body.startDate;
		offerConnection.endDate = req.body.endDate;
		offerConnection.like = 0;
		offerConnection.dislike = 0;
		offerConnection.share = 0;

		try {
			await offerConnection.save((err, offer) => {
				if (err) {
					return res.status(403).send({
						error: "Offer already posted on the same service",
					});
				} else if (offer != "") {
					res.send({
						offer: offer,
					});
				} else
					return res.status(404).send({
						error: "Offer not saved",
					});
			});
		} catch (err) {
			return res.status(400).send({
				error: err,
			});
		}
	},
	async getAllOffers(req, res) {
		try {
			await offerConnection.find((err, allOffers) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (allOffers == "") {
					return res.status(404).send({
						error: "There is no offer",
					});
				} else {
					res.send({
						allOffers: allOffers,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async updateOfferInfo(req, res) {
		const offerUpdateInfo = {
			offerTitle: req.body.offerTitle,
			serviceName: req.body.serviceName,
			servicePrice: req.body.servicePrice,
			selectedLevel: req.body.selectedLevel,
			selectedServiceCatagory: req.body.selectedServiceCatagory,
			selectedServiceSubCatagory: req.body.selectedServiceSubCatagory,
			serviceImage: req.body.serviceImage,
			discountPercent: req.body.discountPercent,
			discountPrice: req.body.discountPrice,
			numberOfPeople: req.body.numberOfPeople,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
		};
		const offerId = {
			_id: req.body.offerId,
		};

		try {
			await offerConnection.updateOne(
				offerId,
				offerUpdateInfo,
				(err, updateResult) => {
					if (err)
						return res.status(403).send({
							error: "Offer not updated due to dublication of service name",
						});
					else if (updateResult.nModified == 1)
						return res.send({
							updateResult: updateResult,
						});
					else
						return res.status(404).send({
							error: "Offer not updated please make change to update",
						});
				}
			);
		} catch (err) {
			return res.status(403).send({
				error: err,
			});
		}
	},

	async deleteOffer(req, res) {
		const deleteOfferQuery = {
			_id: req.body.offerId,
		};
		try {
			await offerConnection.deleteOne(deleteOfferQuery, (err, deleteResult) => {
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
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},
};
