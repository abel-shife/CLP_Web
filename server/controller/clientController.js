const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const config = require("../config/config");
const clientRequireConnection = require("../database/clientSchema");
const passwordEncription = require("../Encription/passwordEncriptionComparison");
const clientConnectionModel = mongoose.model("clientCollection");
var fs = require("fs");
var ReadableData = require("stream").Readable;
module.exports = {
	async clientRegistration(req, res) {
		const clientConnection = new clientConnectionModel();
		clientConnection.firstName = req.body.firstName;
		clientConnection.lastName = req.body.lastName;
		clientConnection.phoneNumber = req.body.phoneNumber;
		clientConnection.email = req.body.email;
		clientConnection.birthDate = req.body.birthDate;
		clientConnection.isFemale = req.body.isFemale;
		clientConnection.points = 0;
		clientConnection.totalPoints = 0;
		clientConnection.profileImage = "";
		clientConnection.password = passwordEncription.passwordEncription(
			req.body.password
		);

		try {
			await clientConnection.save((err, client) => {
				if (err) {
					return res.status(403).send({
						error: "Client already exist",
					});
				}
				if (client) {
					const clientJSON = client.toJSON();
					return res.status(201).send({
						client: clientJSON,
						clientToken: jwtSignUser(clientJSON),
					});
				}
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},

	async clientLogin(req, res) {
		const clientLoginQuery = {
			phoneNumber: req.body.phoneNumber,
		};
		try {
			await clientRequireConnection.findOne(clientLoginQuery, (err, client) => {
				if (err)
					return res.status(404).send({
						error: "User name does not exist try again",
					});
				if (!client) {
					return res.status(404).send({
						error: "User name does not exist try again",
					});
				} else {
					if (
						passwordEncription.comparePassword(
							req.body.password,
							client.password
						)
					) {
						// const clientJson = client.toJSON();
						res.status(201).send(client);
					} else
						res.status(400).send({
							error: "Incorrect password",
						});
				}
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},

	async UploadProfileImage(req, res) {
		// if (req.body.oldImage) {
		// 	try {
		// 		fs.unlinkSync("./server/profileImages/" + req.body.oldImage);
		// 		console.log("successfully deleted");
		// 	} catch (err) {
		// 		// handle the error
		// 		console.log(err);
		// 	}
		// }
		var name = req.body.name;
		var img = req.body.image;

		const imageBufferData = Buffer.from(img, "base64");

		var streamObj = new ReadableData();

		streamObj.push(imageBufferData);

		streamObj.push(null);

		var image = streamObj.pipe(
			fs.createWriteStream("./server/profileImages/" + name + ".jpg")
		);
		if (!image.errorEmitted) {
			const clientPhone = {
				phoneNumber: name,
			};
			const clientImage = {
				profileImage: name + ".jpg",
			};

			try {
				await clientRequireConnection.updateOne(
					clientPhone,
					clientImage,
					(err, updateResult) => {
						if (err)
							return res.status(403).send({
								error: err,
							});
						else if (updateResult) {
							try {
								clientRequireConnection.findOne(clientPhone, (err, client) => {
									if (err)
										return res.status(403).send({
											error: "User does not exist try again",
										});
									if (!client) {
										return res.status(404).send({
											error: "User name does not exist try again",
										});
									} else {
										return res.status(201).send(client);
									}
								});
							} catch (err) {
								res.status(400).send({
									error: err,
								});
							}
						} else
							return res.status(403).send({
								error: "Image not updated",
							});
					}
				);
			} catch (err) {
				return res.status(400).send({
					error: err,
				});
			}
		}
	},
	async getProfileImage(req, res) {},
};

function jwtSignUser(client) {
	return JWT.sign(client, config.authentication.jwtSecret, {
		expiresIn: 24 * 60 * 60,
	});
}
