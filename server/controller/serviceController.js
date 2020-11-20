const mongoose = require("mongoose");
const serviceConnectionModel = mongoose.model("serviceCollection");
const serviceCatagoryModel = mongoose.model("catagoryCollection");
const allServicesConnection = require("../database/serviceSchema");
const catagoryConnection = require("../database/catagorySchema");
//const getAllServicesConnection = require("../database/serviceSchema");
//const catagoryDB = require("../database/catagorySchema");

module.exports = {
	async serviceRegistration(req, res) {
		if (req.body.actionSendFrom == "register") {
			const serviceConnection = new serviceConnectionModel();
			serviceConnection.selectedServiceCatagory =
				req.body.selectedServiceCatagory;

			serviceConnection.selectedServiceSubCatagory =
				req.body.selectedServiceSubCatagory;

			serviceConnection.serviceName = req.body.serviceName;
			serviceConnection.servicePrice = req.body.servicePrice;
			serviceConnection.serviceDescription = req.body.serviceDescription;
			serviceConnection.serviceImage = req.body.serviceImage;

			try {
				await serviceConnection.save((err, service) => {
					if (err) {
						return res.status(403).send({
							error: err,
						});
					}
					if (service) {
						return res.send({
							service: service,
						});
					}
				});
			} catch (err) {
				res.status(400).send({
					error: err,
				});
			}
		} else if (req.body.actionSendFrom == "update") {
			const serviceUpdateQuery = {
				selectedServiceCatagory: req.body.selectedServiceCatagory,
				selectedServiceSubCatagory: req.body.selectedServiceSubCatagory,
				serviceName: req.body.serviceName,
				servicePrice: req.body.servicePrice,
				serviceDescription: req.body.serviceDescription,
				serviceImage: req.body.serviceImage,
			};

			const serviceUpdateId = {
				_id: req.body.serviceUpdateId,
			};

			try {
				await allServicesConnection.updateOne(
					serviceUpdateId,
					serviceUpdateQuery,
					(err, updateResult) => {
						if (err) {
							return res.status(403).send({
								error: err,
							});
						}
						if (updateResult.nModified == 1) {
							return res.send("Service was updated successfully");
						} else
							return res.status(404).send({
								error: "Please make a change",
							});
					}
				);
			} catch (err) {
				res.status(400).send({
					error: err,
				});
			}
		}
	},

	async getAllServices(req, res) {
		try {
			await allServicesConnection.find((err, allServices) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				}
				if (allServices == "") {
					return res.status(404).send({
						error: "There is no service please add a service",
					});
				} else {
					res.send({
						allServices: allServices,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async deleteService(req, res) {
		try {
			const deleteServiceQuery = {
				_id: req.body.serviceIdToDelete,
			};
			await allServicesConnection.deleteOne(
				deleteServiceQuery,
				(err, serviceDeleteResult) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					if (serviceDeleteResult) {
						return res.send({
							serviceDeleteResult: serviceDeleteResult,
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

	async serviceCatagoryRegistration(req, res) {
		const serviceSubCatagory =
			req.body.serviceSubCatagory.charAt(0).toUpperCase() +
			req.body.serviceSubCatagory.slice(1).toLowerCase();
		const serviceCatagory =
			req.body.serviceCatagory.charAt(0).toUpperCase() +
			req.body.serviceCatagory.slice(1).toLowerCase();

		const catagoryQuery = {
			catagoryName: serviceCatagory,
		};

		try {
			const isCatagoryExist = await catagoryConnection.findOne(catagoryQuery);
			if (isCatagoryExist) {
				var isFound = false;
				for (let i = 0; i < isCatagoryExist.subCatagory.length; i++) {
					if (
						serviceSubCatagory == isCatagoryExist.subCatagory[i].subCatagoryName
					) {
						isFound = true;
						break;
					}
				}
				if (!isFound) {
					const result = await catagoryConnection.findOneAndUpdate(
						{ _id: isCatagoryExist._id },
						{
							$push: {
								subCatagory: {
									subCatagoryName: serviceSubCatagory,
								},
							},
						},
						{ upsert: true, new: true, useFindAndModify: false }
					);
					if (result) {
						return res.send({
							success: "Sub catagory was added",
						});
					} else {
						return res.status(400).send({
							error: "Sub catagory was not added",
						});
					}
				} else {
					return res.status(400).send({
						error: "Sub catagory already exist",
					});
				}
			} else {
				const catagoryConnectionModel = new serviceCatagoryModel();
				catagoryConnectionModel.catagoryName = serviceCatagory;

				catagoryConnectionModel.subCatagory = [
					{
						subCatagoryName: serviceSubCatagory,
					},
				];

				await catagoryConnectionModel.save((err, serviceCatagory) => {
					if (err) {
						return res.status(404).send({
							error: err,
						});
					}
					if (serviceCatagory != "") {
						return res.send({
							success: "Service catagory was registered successfully!",
						});
					} else
						return res.status(404).send({
							error: "Catagory not registered",
						});
				});
			}
		} catch (err) {
			res.status(400).send({
				error: "Error status: " + err,
			});
		}
	},

	async getAllCatagories(req, res) {
		try {
			await catagoryConnection.find((err, allCatagories) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				}
				if (allCatagories == "") {
					return res.status(404).send({
						error: "There is no catagory please add first",
					});
				} else {
					res.send({
						allCatagories: allCatagories,
					});
				}
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},

	async deleteCatagory(req, res) {
		const whichOneToDelete = req.body.whichOneToDelete;
		const deleteCatagoryQuery = {
			_id: req.body.catagoryId,
		};

		try {
			if (whichOneToDelete == "catagory") {
				await catagoryConnection.deleteOne(
					deleteCatagoryQuery,
					(err, catagoryDeleteResult) => {
						if (err)
							return res.status(400).send({
								error: "Error " + err,
							});
						if (catagoryDeleteResult.deletedCount == 1) {
							return res.send({
								catagoryDeleteResult: catagoryDeleteResult,
							});
						} else
							return res.status(400).send({
								error: "Deleting was not complete",
							});
					}
				);
			} else {
				const deleteSubCatagoryQuery = {
					_id: req.body.subCatagoryId,
				};
				await catagoryConnection.findOneAndUpdate(
					deleteCatagoryQuery,
					{
						$pull: {
							subCatagory: deleteSubCatagoryQuery,
						},
					},
					{ upsert: true, useFindAndModify: false },

					(err, subCatagoryDeleteResult) => {
						if (err)
							return res.status(400).send({
								error: "Error " + err,
							});
						if (subCatagoryDeleteResult) {
							return res.send({
								subCatagoryDeleteResult: subCatagoryDeleteResult,
							});
						} else {
							{
								return res.status(400).send({
									error: "Deleting was not complete",
								});
							}
						}
					}
				);
			}
		} catch (err) {
			res.status(400).send({
				error: "Error: " + err,
			});
		}
	},
	//abel
	// async getServicescatagories(req, res) {
	//   try {
	//     await catagoryDB.find((err, serviceCatagory) => {
	//       if (!serviceCatagory) {
	//         return res.status(404).send({
	//           error: `Error in fetching catagories`
	//         });
	//       } else {
	//         res.send({
	//           serviceCatagory: serviceCatagory
	//         });
	//       }
	//     });
	//   } catch (err) {
	//     res.status(500).send({
	//       error: err
	//     });
	//   }
	// },
	async getServiceName(req, res) {
		console.log(req.body);

		try {
			await allServicesConnection.find(
				{
					$and: [
						{ selectedServiceCatagory: req.body.selectedServiceCatagory },
						{ selectedServiceSubCatagory: req.body.selectedServiceSubCatagory },
					],
				},
				(err, serviceName) => {
					if (err) {
						return res.status(403).send({
							error: err,
						});
					}
					if (serviceName == "") {
						return res.status(400).send({
							error: "There is no service",
						});
					} else {
						res.send(serviceName);
					}
				}
			);
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},
	async getServicePrice(req, res) {
		try {
			await allServicesConnection.find(
				{
					$and: [
						{ selectedServiceCatagory: req.body.selectedServiceCatagory },
						{ selectedServiceSubCatagory: req.body.selectedServiceSubCatagory },
						{ serviceName: req.body.selectedServiceName },
					],
				},
				(err, servicePrice) => {
					if (err) {
						return res.status(403).send({
							error: err,
						});
					}
					if (servicePrice == "") {
						return res.status(400).send({
							error: "There is no service",
						});
					} else {
						res.send(servicePrice);
					}
				}
			);
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},
};
