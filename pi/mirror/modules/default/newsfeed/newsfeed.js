/* global Module */

/* Magic Mirror
 * Module: NewsFeed
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("newsfeed",{

	// Default module config.
	defaults: {
		feeds: [
			{
				title: "New York Times",
				url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml",
				encoding: "UTF-8" //ISO-8859-1
			}
		],
		showSourceTitle: true,
		showPublishDate: true,
		showDescription: false,
		wrapTitle: true,
		wrapDescription: true,
		hideLoading: false,
		reloadInterval:  5 * 60 * 1000, // every 5 minutes
		updateInterval: 10 * 1000,
		animationSpeed: 2.5 * 1000,
		maxNewsItems: 0, // 0 for unlimited
		ignoreOldItems: false,
		ignoreOlderThan: 24 * 60 * 60 * 1000, // 1 day
		removeStartTags: "",
		removeEndTags: "",
		startTags: [],
		endTags: []

	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	// Define required translations.
	getTranslations: function() {
		// The translations for the default modules are defined in the core translation files.
		// Therefor we can just return false. Otherwise we should have returned a dictionary.
		// If you're trying to build your own module including translations, check out the documentation.
		return false;
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);

		this.newsItems = [];
		this.loaded = false;
		this.activeItem = 0;

		this.registerFeeds();

	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "NEWS_ITEMS") {
			this.generateFeed(payload);

			if (!this.loaded) {
				this.scheduleUpdateInterval();
			}

			this.loaded = true;
		}
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		if (this.config.feedUrl) {
			wrapper.className = "small bright";
			wrapper.innerHTML = "The configuration options for the newsfeed module have changed.<br>Please check the documentation.";
			return wrapper;
		}

		if (this.activeItem >= this.newsItems.length) {
			this.activeItem = 0;
		}

		if (this.newsItems.length > 0) {

			// this.config.showFullArticle is a run-time configuration, triggered by optional notifications
			if (!this.config.showFullArticle && (this.config.showSourceTitle || this.config.showPublishDate)) {
				var sourceAndTimestamp = document.createElement("div");
				sourceAndTimestamp.className = "light small dimmed";

				if (this.config.showSourceTitle && this.newsItems[this.activeItem].sourceTitle !== "") {
					sourceAndTimestamp.innerHTML = this.newsItems[this.activeItem].sourceTitle;
				}
				if (this.config.showSourceTitle && this.newsItems[this.activeItem].sourceTitle !== "" && this.config.showPublishDate) {
					sourceAndTimestamp.innerHTML += ", ";
				}
				if (this.config.showPublishDate) {
					sourceAndTimestamp.innerHTML += moment(new Date(this.newsItems[this.activeItem].pubdate)).fromNow();
				}
				if (this.config.showSourceTitle && this.newsItems[this.activeItem].sourceTitle !== "" || this.config.showPublishDate) {
					sourceAndTimestamp.innerHTML += ":";
				}

				wrapper.appendChild(sourceAndTimestamp);
			}

			//Remove selected tags from the beginning of rss feed items (title or description)

			if (this.config.removeStartTags == "title" || this.config.removeStartTags == "both") {

				for (f=0; f<this.config.startTags.length;f++) {
					if (this.newsItems[this.activeItem].title.slice(0,this.config.startTags[f].length) == this.config.startTags[f]) {
						this.newsItems[this.activeItem].title = this.newsItems[this.activeItem].title.slice(this.config.startTags[f].length,this.newsItems[this.activeItem].title.length);
					}
				}

			}

			if (this.config.removeStartTags == "description" || this.config.removeStartTags == "both") {

				if (this.config.showDescription) {
					for (f=0; f<this.config.startTags.length;f++) {
						if (this.newsItems[this.activeItem].description.slice(0,this.config.startTags[f].length) == this.config.startTags[f]) {
							this.newsItems[this.activeItem].title = this.newsItems[this.activeItem].description.slice(this.config.startTags[f].length,this.newsItems[this.activeItem].description.length);
						}
					}
				}

			}

			//Remove selected tags from the end of rss feed items (title or description)

			if (this.config.removeEndTags) {
				for (f=0; f<this.config.endTags.length;f++) {
					if (this.newsItems[this.activeItem].title.slice(-this.config.endTags[f].length)==this.config.endTags[f]) {
						this.newsItems[this.activeItem].title = this.newsItems[this.activeItem].title.slice(0,-this.config.endTags[f].length);
					}
				}

				if (this.config.showDescription) {
					for (f=0; f<this.config.endTags.length;f++) {
						if (this.newsItems[this.activeItem].description.slice(-this.config.endTags[f].length)==this.config.endTags[f]) {
							this.newsItems[this.activeItem].description = this.newsItems[this.activeItem].description.slice(0,-this.config.endTags[f].length);
						}
					}
				}

			}

			if(!this.config.showFullArticle){
				var title = document.createElement("div");
				title.className = "bright medium light" + (!this.config.wrapTitle ? " no-wrap" : "");
				title.innerHTML = this.newsItems[this.activeItem].title;
				wrapper.appendChild(title);
			}

			if (this.config.showDescription) {
				var description = document.createElement("div");
				description.className = "small light" + (!this.config.wrapDescription ? " no-wrap" : "");
				description.innerHTML = this.newsItems[this.activeItem].description;
				wrapper.appendChild(description);
			}

			if (this.config.showFullArticle) {
				var fullArticle = document.createElement("iframe");
				fullArticle.className = "";
				fullArticle.style.width = "100%";
				fullArticle.style.top = "0";
				fullArticle.style.left = "0";
				fullArticle.style.position = "fixed";
				fullArticle.height = window.innerHeight;
				fullArticle.style.border = "none";
				fullArticle.src = this.newsItems[this.activeItem].url;
				wrapper.appendChild(fullArticle);
			}

			if (this.config.hideLoading) {
				this.show();
			}

		} else {
			if (this.config.hideLoading) {
				this.hide();
			} else {
				wrapper.innerHTML = this.translate("LOADING");
				wrapper.className = "small dimmed";
			}
		}

		return wrapper;
	},

	/* registerFeeds()
	 * registers the feeds to be used by the backend.
	 */
	registerFeeds: function() {
		for (var f in this.config.feeds) {
			var feed = this.config.feeds[f];
			this.sendSocketNotification("ADD_FEED", {
				feed: feed,
				config: this.config
			});
		}
	},

	/* generateFeed()
	 * Generate an ordered list of items for this configured module.
	 *
	 * attribute feeds object - An object with feeds returned by the node helper.
	 */
	generateFeed: function(feeds) {
		var newsItems = [];
		for (var feed in feeds) {
			var feedItems = feeds[feed];
			if (this.subscribedToFeed(feed)) {
				for (var i in feedItems) {
					var item = feedItems[i];
					item.sourceTitle = this.titleForFeed(feed);
					if (!(this.config.ignoreOldItems && ((Date.now() - new Date(item.pubdate)) > this.config.ignoreOlderThan))) {
						newsItems.push(item);
					}
				}
			}
		}
		newsItems.sort(function(a,b) {
			var dateA = new Date(a.pubdate);
			var dateB = new Date(b.pubdate);
			return dateB - dateA;
		});
		if(this.config.maxNewsItems > 0) {
			newsItems = newsItems.slice(0, this.config.maxNewsItems);
		}
		this.newsItems = newsItems;
	},

	/* subscribedToFeed(feedUrl)
	 * Check if this module is configured to show this feed.
	 *
	 * attribute feedUrl string - Url of the feed to check.
	 *
	 * returns bool
	 */
	subscribedToFeed: function(feedUrl) {
		for (var f in this.config.feeds) {
			var feed = this.config.feeds[f];
			if (feed.url === feedUrl) {
				return true;
			}
		}
		return false;
	},

	/* titleForFeed(feedUrl)
	 * Returns title for a specific feed Url.
	 *
	 * attribute feedUrl string - Url of the feed to check.
	 *
	 * returns string
	 */
	titleForFeed: function(feedUrl) {
		for (var f in this.config.feeds) {
			var feed = this.config.feeds[f];
			if (feed.url === feedUrl) {
				return feed.title || "";
			}
		}
		return "";
	},

	/* scheduleUpdateInterval()
	 * Schedule visual update.
	 */
	scheduleUpdateInterval: function() {
		var self = this;

		self.updateDom(self.config.animationSpeed);

		timer = setInterval(function() {
			self.activeItem++;
			self.updateDom(self.config.animationSpeed);
		}, this.config.updateInterval);
	},

	/* capitalizeFirstLetter(string)
	 * Capitalizes the first character of a string.
	 *
	 * argument string string - Input string.
	 *
	 * return string - Capitalized output string.
	 */
	capitalizeFirstLetter: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	resetDescrOrFullArticleAndTimer: function() {
		this.config.showDescription = false;
		this.config.showFullArticle = false;
		if(!timer){
			this.scheduleUpdateInterval();
		}
	},

	notificationReceived: function(notification, payload, sender) {
		Log.info(this.name + " - received notification: " + notification);
		if(notification == "ARTICLE_NEXT"){
			var before = this.activeItem;
			this.activeItem++;
			if (this.activeItem >= this.newsItems.length) {
				this.activeItem = 0;
			}
			this.resetDescrOrFullArticleAndTimer();
			Log.info(this.name + " - going from article #" + before + " to #" + this.activeItem + " (of " + this.newsItems.length + ")");
			this.updateDom(100);
		} else if(notification == "ARTICLE_PREVIOUS"){
			var before = this.activeItem;
			this.activeItem--;
			if (this.activeItem < 0) {
				this.activeItem = this.newsItems.length - 1;
			}
			this.resetDescrOrFullArticleAndTimer();
			Log.info(this.name + " - going from article #" + before + " to #" + this.activeItem + " (of " + this.newsItems.length + ")");
			this.updateDom(100);
		}
		// if "more details" is received the first time: show article summary, on second time show full article
		else if(notification == "ARTICLE_MORE_DETAILS"){
			this.config.showDescription = !this.config.showDescription;
			this.config.showFullArticle = !this.config.showDescription;
			clearInterval(timer);
			timer = null;
			Log.info(this.name + " - showing " + this.config.showDescription ? "article description" : "full article");
			this.updateDom(100);
		} else if(notification == "ARTICLE_LESS_DETAILS"){
			this.resetDescrOrFullArticleAndTimer();
			Log.info(this.name + " - showing only article titles again");
			this.updateDom(100);
		} else {
			Log.info(this.name + " - unknown notification, ignoring: " + notification);
		}
	},

});
