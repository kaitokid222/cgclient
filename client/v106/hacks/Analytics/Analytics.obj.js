        const Analytics = {
            apiVersion: "1",
            trackID: "UA-60150088-3",
            clientID: null,
            userID: null,
            appName: "coregrounds",
            appVersion: Config.VERSION,
            debug: !1,
            performanceTracking: !1,
            errorTracking: !0,
            userLanguage: "en",
            currency: "EUR",
            lastScreenName: "",
            sendRequest: function(t, e) {
                this.clientID && null != this.clientID || (this.clientID = this.generateClientID()), this.userID && null != this.userID || (this.userID = this.generateClientID());
                var o = "v=" + this.apiVersion + "&aip=1&tid=" + this.trackID + "&cid=" + this.clientID + "&uid=" + this.userID + "&an=" + this.appName + "&av=" + this.appVersion + "&sr=" + this.getScreenResolution() + "&vp=" + this.getViewportSize() + "&sd=" + this.getColorDept() + "&ul=" + this.userLanguage + "&ua=" + this.getUserAgent() + "&ds=app";
                Object.keys(t).forEach(function(e) {
                    var n = t[e];
                    void 0 !== n && (o += "&" + e + "=" + n)
                });
                var n = new XMLHttpRequest,
                    r = "https://www.google-analytics.com";
                this.debug ? r += "/debug/collect" : r += "/collect", n.open("POST", r, !0), n.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), n.onreadystatechange = function() {
                    Analytics.debug && console.log(n.response), 4 == n.readyState && 200 == n.status ? e && e(!0) : e && e(!1)
                }, n.send(o)
            },
            generateClientID: function() {
                for (var t = "", e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", o = 0; o < 5; o++) t += e.charAt(Math.floor(Math.random() * e.length));
                return t
            },
            getScreenResolution: function() {
                return screen.width + "x" + screen.height
            },
            getColorDept: function() {
                return screen.colorDepth + "-bits"
            },
            getUserAgent: function() {
                return navigator.userAgent
            },
            getViewportSize: function() {
                return window.screen.availWidth + "x" + window.screen.availHeight
            },
            screenView: function(t) {
                var e = {
                    t: "screenview",
                    cd: t
                }; 
				this.lastScreenName = t
            },
            event: function(t, e, o, n) {
                var r = {
                    t: "event",
                    ec: t,
                    ea: e,
                    el: o,
                    ev: n,
                    cd: this.lastScreenName
                };
            },
            exception: function(t, e) {
                var o = {
                    t: "exception",
                    exd: t,
                    exf: e || 0
                };
            },
            timing: function(t, e, o, n) {
                var r = {
                    t: "timing",
                    utc: t,
                    utv: e,
                    utt: o,
                    utl: n
                };
            },
            ecommerce: {
                transactionID: !1,
                generateTransactionID: function() {
                    for (var t = "", e = 0; e < 5; e++) t += "0123456789".charAt(Math.floor(Math.random() * "0123456789".length));
                    return t
                },
                transaction: function(t, e) {
                    var o = "",
                        n = {
                            t: "transaction",
                            ti: o = this.ecommerce.transactionID ? this.ecommerce.transactionID : this.ecommerce.generateTransactionID(),
                            tr: t,
                            cu: this.currency
                        };
                }
            },
            custom: function(t) {
            }
        };