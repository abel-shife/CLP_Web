const mongoose = require("mongoose");

const eventModelConnection = mongoose.model("eventCollection");
const eventConnection = require("../database/eventSchema");

module.exports = {
	async saveEvent(req, res) {
		const eventConnection = new eventModelConnection();

		eventConnection.eventTitle = req.body.eventTitle;
		eventConnection.eventDescription = req.body.eventDescription;
		eventConnection.eventImage = req.body.eventImage;
		eventConnection.eventDate = req.body.eventDate;
		eventConnection.eventStartTime = req.body.eventStartTime;
		eventConnection.selectedLevel = req.body.selectedLevel;
		eventConnection.numberOfPeople = req.body.numberOfPeople;
		eventConnection.eventBranch = req.body.eventBranch;
		eventConnection.like = 0;
		eventConnection.dislike = 0;
		eventConnection.share = 0;

		try {
			await eventConnection.save((err, event) => {
				if (err) {
					return res.status(403).send({
						error: "Event already posted on the same title",
					});
				} else if (event != "") {
					res.send({
						event: event,
					});
				} else
					return res.status(404).send({
						error: "Event not saved",
					});
			});
		} catch (err) {
			return res.status(400).send({
				error: err,
			});
		}
	},
	async getAllEvents(req, res) {
		try {
			await eventConnection.find((err, allEvents) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (allEvents == "") {
					return res.status(404).send({
						error: "There is no event",
					});
				} else {
					res.send({
						allEvents: allEvents,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async updateEvent(req, res) {
		const eventUpdateInfo = {
			eventTitle: req.body.eventTitle,
			eventDescription: req.body.eventDescription,
			eventImage: req.body.eventImage,
			eventDate: req.body.eventDate,
			eventStartTime: req.body.eventStartTime,
			selectedLevel: req.body.selectedLevel,
			numberOfPeople: req.body.numberOfPeople,
		};

		const eventId = {
			_id: req.body.eventId,
		};

		try {
			await eventConnection.updateOne(
				eventId,
				eventUpdateInfo,
				(err, updateResult) => {
					if (err)
						return res.status(403).send({
							error: "Event not updated due to dublication of event title",
						});
					else if (updateResult.nModified == 1)
						return res.send({
							updateResult: updateResult,
						});
					else
						return res.status(404).send({
							error: "Event not updated, please make changes to update",
						});
				}
			);
		} catch (err) {
			return res.status(403).send({
				error: err,
			});
		}
	},
	async deleteEvent(req, res) {
		const deleteEventQuery = {
			_id: req.body.eventId,
		};
		try {
			await eventConnection.deleteOne(deleteEventQuery, (err, deleteResult) => {
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
