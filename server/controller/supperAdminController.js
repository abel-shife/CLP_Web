const mongoose = require("mongoose");
const branchConnection = require("../database/branchSchema");
const adminConnection = require("../database/adminSchema");
const { compareSync } = require("bcrypt");
const passwordEncription = require("../Encription/passwordEncriptionComparison");

const branchModelConnection = mongoose.model("branchCollection");

function generateRandomNumber(digit) {
	return (Math.floor(Math.random() * digit) + digit).toString().substring(1);
}

const accountSid = "ACd4b30b2ca4ddd489ac0541c74113a3be";
const authToken = "6d9e9304c09962ab521c8e2153cef5be";
const client = require("twilio")(accountSid, authToken);

async function sendSMS(usernamePassword, adminPhone) {
	var status = "";
	await client.messages
		.create({
			body: "Phone number: " + adminPhone + ":  " + usernamePassword,
			from: "+19387773444",
			to: "+251947012893",
		})
		.then((message) => {
			status = message.status;
		})
		.catch((err) => {
			status = err.isAxiosError;
		});

	return Promise.resolve(status).then((token) => {
		return token;
	});
}

module.exports = {
	async saveBranchInfo(req, res) {
		const connection = new branchModelConnection();
		connection.branchName = req.body.branchName;
		connection.branchCity = req.body.branchCity;
		connection.branchRegion = req.body.branchRegion;
		connection.branchTelephone = req.body.branchTelephone;
		connection.branchAdminId = "";

		try {
			await connection.save((err, branchInfo) => {
				if (err)
					return res.status(403).send({
						error: err + " Branch already registered",
					});
				else if (branchInfo) {
					return res.send({
						branchInfo: branchInfo,
					});
				} else
					return res.status(403).send({
						error: " Branch not registered please try again",
					});
			});
		} catch (err) {
			return res.status(403).send({
				error: err,
			});
		}
	},
	async getAllBranchs(req, res) {
		try {
			await branchConnection.find((err, allBranchs) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (allBranchs == "") {
					return res.status(404).send({
						error: "There is no Branch",
					});
				} else {
					res.send({
						allBranchs: allBranchs,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async getAllAdmins(req, res) {
		try {
			await adminConnection.find((err, allAdmins) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (allAdmins == "") {
					return res.status(404).send({
						error: "There is no admin",
					});
				} else {
					res.send({
						allAdmins: allAdmins,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async assignAdmin(req, res) {
		const branchId = {
			_id: req.body.branchId,
		};

		const branchAdminIdInAdmin = {
			_id: req.body.branchAdminId,
		};

		const branchAdminId = {
			branchAdminId: req.body.branchAdminId,
		};

		var username = "admin" + generateRandomNumber(100);
		var password = generateRandomNumber(10000000);

		console.log(username + " " + password);
		const brancAdminInfoUpdate = {
			adminUserName: username,
			adminPassword: passwordEncription.passwordEncription(password),
			adminAssigned: true,
			assignedTo: req.body.branchName,
		};

		try {
			await branchConnection.updateOne(
				branchId,
				branchAdminId,
				(err, assignResult) => {
					if (err) {
						return res.status(403).send({
							error: err,
						});
					}
					if (assignResult) {
						try {
							adminConnection.updateOne(
								branchAdminIdInAdmin,
								brancAdminInfoUpdate,
								(err, adminResult) => {
									if (err) {
										return res.status(403).send({
											error: err,
										});
									}
									if (adminResult) {
										var isUserSent = sendSMS(
											"User name: " + username + " Password: " + password,
											req.body.adminPhone
										);
										isUserSent.then(function (result) {
											if (result == "queued")
												return res.send({
													adminResult: adminResult,
												});
											else
												res.status(404).send({
													error:
														"Admin assigned but admin Username and password not sent please try again",
												});
										});
									} else
										return res.status(403).send({
											error: "Admin not assigned",
										});
								}
							);
						} catch (err) {
							res.status(403).send({
								error: err,
							});
						}
					} else
						return res.status(403).send({
							error: "Admin not assigned",
						});
				}
			);
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},
	async updateBranchInfo(req, res) {
		const branchInfoUpdate = {
			branchName: req.body.branchName,
			branchCity: req.body.branchCity,
			branchRegion: req.body.branchRegion,
		};

		const branchId = {
			_id: req.body.branchId,
		};
		try {
			await branchConnection.updateOne(
				branchId,
				branchInfoUpdate,
				(err, updateResult) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					else if (updateResult.nModified == 1) {
						res.send({
							updateResult: updateResult,
						});
					} else
						return res.status(404).send({
							error: "Branch not updated please make a change",
						});
				}
			);
		} catch (err) {
			return res.status(403).send({
				error: err,
			});
		}
	},
	async deleteBranch(req, res) {
		const deleteBranchQuery = {
			_id: req.body.branchId,
		};
		const branchAdminIdInAdmin = {
			_id: req.body.branchAdminId,
		};

		const branchNameANDAssignedBool = {
			adminUserName: "",
			adminPassword: "",
			adminAssigned: false,
			assignedTo: "",
		};
		try {
			await branchConnection.deleteOne(
				deleteBranchQuery,
				(err, deleteResult) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					else if (deleteResult) {
						try {
							adminConnection.updateOne(
								branchAdminIdInAdmin,
								branchNameANDAssignedBool,
								(err, adminResult) => {
									if (err) {
										return res.status(403).send({
											error:
												"Branch deleted, but Admin was not assigned before",
										});
									}
									if (adminResult.nModified == 1) {
										return res.send({
											adminResult: adminResult,
										});
									} else
										return res.status(404).send({
											error: "Branch deleted but admin not modified",
										});
								}
							);
						} catch (err) {
							res.status(400).send({
								error: err,
							});
						}
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
	async shiftAdmin(req, res) {
		const firstBranchId = {
			_id: req.body.firstBranchId,
		};
		const branchAdminIdFirst = {
			branchAdminId: "",
		};
		const secondBranchId = {
			_id: req.body.secondBranchId,
		};
		const branchAdminIdSecond = {
			branchAdminId: req.body.adminId,
		};
		const branchAdminId = {
			_id: req.body.adminId,
		};
		const branchName = {
			assignedTo: req.body.destinationBranchName,
		};

		const branchNameANDAssignedBool = {
			adminUserName: "",
			adminPassword: "",
			adminAssigned: false,
			assignedTo: "",
		};
		const destinationAdminId = {
			_id: req.body.destinationAdminId,
		};

		try {
			await branchConnection.updateOne(
				secondBranchId,
				branchAdminIdSecond,
				(err, result) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					else if (result.nModified == 1) {
						try {
							branchConnection.updateOne(
								firstBranchId,
								branchAdminIdFirst,
								(err, result) => {
									if (err)
										return res.status(403).send({
											error: err,
										});
									else if (result.nModified == 1) {
										try {
											adminConnection.updateOne(
												branchAdminId,
												branchName,
												(err, result) => {
													if (err)
														return res.status(403).send({
															error: err,
														});
													else if (result.nModified == 1) {
														if (req.body.destinationAdminId != "") {
															try {
																adminConnection.updateOne(
																	destinationAdminId,
																	branchNameANDAssignedBool,
																	(err, result) => {
																		if (err)
																			return res.status(403).send({
																				error: err,
																			});
																		else if (result.nModified == 1) {
																			return res.send({
																				result: result,
																			});
																		} else
																			return res.status(403).send({
																				error:
																					"Admin shifted from the first to the second but admin status not modified",
																			});
																	}
																);
															} catch (err) {
																res.status(400).send({
																	error: err,
																});
															}
														} else {
															return res.send({
																result: result,
															});
														}
													} else
														return res.status(403).send({
															error:
																"Admin shifted from the first to the second but admin status not modified",
														});
												}
											);
										} catch (err) {
											res.status(400).send({
												error: err,
											});
										}
									} else
										return res.status(403).send({
											error: "Admin shifted but not cleared from the first",
										});
								}
							);
						} catch (err) {
							res.status(400).send({
								error: err,
							});
						}
					} else
						return res.status(403).send({
							error: "Admin not shifted",
						});
				}
			);
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},

	async deleteBranchAdmin(req, res) {
		const branchId = {
			_id: req.body.branchId,
		};
		const branchAdminId = {
			branchAdminId: "",
		};
		const adminId = {
			_id: req.body.branchAdminId,
		};

		const branchNameANDAssignedBool = {
			adminUserName: "",
			adminPassword: "",
			adminAssigned: false,
			assignedTo: "",
		};

		try {
			await branchConnection.updateOne(
				branchId,
				branchAdminId,
				(err, updateResult) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					else if (updateResult) {
						try {
							adminConnection.updateOne(
								adminId,
								branchNameANDAssignedBool,
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
											error:
												"Admin removed from branch but not deleted from admin collection.",
										});
								}
							);
						} catch (err) {
							return res.status(403).send({
								error: err,
							});
						}
					} else {
						return res.status(404).send({
							error: "Admin not deleted.",
						});
					}
				}
			);
		} catch (err) {
			return res.status(403).send({
				error: err,
			});
		}
	},
};
