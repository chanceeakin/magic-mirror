/* global Module */

/* Magic Mirror
 * Module: google-cal
 *
 * By {{AUTHOR_NAME}}
 * {{LICENSE}} Licensed.
 */

Module.register("google-cal", {
	defaults: {
		updateInterval: 300000,
		retryDelay: 5000,
		calendars:[
			"Emma & Chance's Calendar",
			"Exercise",
			"Home",
			"Church"
		]
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;
		Log.log("Starting THE FUCKING module: " + this.name);

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	 async getData(email) {
		var self = this;
		var retry = true;

		// var urlApi = "https://jsonplaceholder.typicode.com/posts/1";
		try {
			if (!email) {
				throw new Error("no email")
			}
			const data = await self.getCals(email)
			self.processData(data)
		} catch (e) {
			console.error(e)
			retry = false
		} finally {
			if (retry) {
				self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
			}
		}
		// var dataRequest = new XMLHttpRequest();
		// dataRequest.open("GET", urlApi, true);
		// dataRequest.onreadystatechange = function() {
		// 	console.log("logging ready state", this.readyState);
		// 	if (this.readyState === 4) {
		// 		if (this.status === 200) {
		// 			self.processData(JSON.parse(this.response));
		// 		} else if (this.status === 401) {
		// 			self.updateDom(self.config.animationSpeed);
		// 			Log.error(self.name, this.status);
		// 			retry = false;
		// 		} else {
		// 			Log.error(self.name, "Could not load data.");
		// 		}
		// 		if (retry) {
		// 			self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
		// 		}
		// 	}
		// };
		// dataRequest.send();
	},
	/**
	 * [getCals grabs all the calendars]
	 * @return {Promise} [description]
	 */
	async getCals (email) {
		var self = this;
		var savedCals = []
		const query = `query calList($email: String!) {
			calendarList(email: $email) {
				listItems {
					summary
					Primary
					id
				}
			}
		}`
		try {
			let calList = await fetch("http://localhost:8000/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify({
					query: query,
					variables: {
						email: email
					}
				})
			})
			calList = await calList.json()
			savedCals = await self.defaults.calendars.map(cal => {
				const sc = calList.data.calendarList && calList.data.calendarList.listItems ?
					calList.data.calendarList.listItems.filter(fil => fil.summary === cal)
					: undefined
				if (sc) {
					console.log("sc!!!!!!!!!!!", sc);
					if (sc[0].Primary) {
						return "primary"
					}
					return sc[0].id
				}
			})
			console.log("SAVED CALLLLLS!", savedCals);
			const promCalls = savedCals.map(cal => {
				return self.getCal(email, cal)
			})
			let promises = await Promise.all(promCalls)
			return promises
		} catch (e) {
			console.error(e);
		}
	},
	/**
	 * [getCal grabs a single calendar]
	 * @param  {[type]}  calID [description]
	 * @return {Promise}       [description]
	 */
	async getCal (email, calID) {
		try {
			const query = `query GetCal($calID: String!, $email: String!) {
				calendar(calID: $calID, email: $email) {
					title
					timezone
					items {
						summary
						location
						start {
							date
							dateTime
							TimeZone
						}
						end {
							dateTime
						}
					}
				}
			}`
			let cal = await fetch("http://localhost:8000/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify({
					query: query,
					variables: {
						calID,
						email
					}
				})
			})
			cal = await cal.json()
			return cal.data.calendar
		} catch (e) {
			console.error(e);
		}
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		wrapper.insertAdjacentHTML("beforeend", "<h2 class='g-cal-header'>Events</h2><hr class='g-cal-hr'>")
		// If this.dataRequest is not empty
		if (this.dataRequest) {
			this.dataRequest.map(datum => {
				if (datum) {
					var wrapperDataRequest = document.createElement("div");
					wrapperDataRequest.className = "g-cal"
					wrapperDataRequest.id = datum.title;
					// check format https://jsonplaceholder.typicode.com/posts/1
					wrapperDataRequest.innerHTML = `<h4 class="g-cal-title">${datum.title}</h4>`;
					datum.items.map(item => {
						const today = moment()
						const tomorrow = moment().add(1, "days")
						if (moment(item.start.dateTime).isSame(today, "d")) {
							wrapperDataRequest.insertAdjacentHTML("beforeend",
								`<p>${item.summary}: ${moment(item.start.dateTime).format("hh:mm a")} - ${moment(item.end.dateTime).format("hh:mm a")}</p>`)
						} else if (moment(item.start.dateTime).isSame(tomorrow, "d")){
							wrapperDataRequest.insertAdjacentHTML("beforeend",
								`<p>${item.summary}: Tomorrow, ${moment(item.start.dateTime).format("hh:mm a")} - ${moment(item.end.dateTime).format("hh:mm a")}</p>`)
						} else {
							wrapperDataRequest.insertAdjacentHTML("beforeend",
								`<p>${item.summary}: ${moment(item.start.dateTime).format("MM.DD hh:mm a")} - ${moment(item.end.dateTime).format("hh:mm a")}</p>`)
						}
					})
					wrapper.appendChild(wrapperDataRequest);
				}
			})

		}

		// Data from helper
		// if (this.dataNotification) {
		// 	console.log("DATA NOTE", this.dataNotification);
		// 	var wrapperDataNotification = document.createElement("div");
		// 	// translations  + datanotification
		// 	wrapperDataNotification.innerHTML =  this.translate("UPDATE") + ": " + this.dataNotification.date;
		//
		// 	wrapper.appendChild(wrapperDataNotification);
		// }
		return wrapper;
	},

	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function () {
		return [
			"google-cal.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		return {
			en: "translations/en.json"
		};
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) {
			self.updateDom(self.config.animationSpeed);
		}
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("google-cal-NOTIFICATION_TEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "google-cal-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},

	notificationReceived: function (notification, payload, sender) {
		var that = this;
		if (notification === "GOOGLE_CAL_CALL") {
			if (payload === "Chance") {
				console.log("hey man");
				that.getData("Chance.eakin@gmail.com");
			}
		}
	},
});
