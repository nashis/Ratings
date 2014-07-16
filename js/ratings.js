var YCustom = YCustom || YUI();

YCustom.use("node", "io-base", function(Y) {
    // Initialize config parameters
    var config = {
        url: "/ratings/_xhr/postratings",
        method: "POST"
    };

    // Initialize default container
    var data = {
        cont: "rating_container"
    };

    // Anyone who wants to use this widget, must fire this event
    Y.on("global-ratings", function(evntData) {
        if (!evntData) {
            evntData = data;
        }
        initializeRatings(evntData);
    });

    // All event binding and core widget logic
    function initializeRatings(data) {
        if (!data.cont) {
            return false;
        }

        var cont = Y.one("#" + data.cont);
        if (!cont) {
            return false;
        }

        var ratingSelector
                , emptyRating
                , fullRating = cont.one(".rating-full")
                , userCnt
                , ratVal
                , width = 0
                , ratMouseMove = ''
                , ratMouseOut = ''
                , ratMouseClick = ''
                ;

        // User has already rated the content, so return from here
        if (fullRating && fullRating.getStyle("width") != "0%") {
            return false;
        }

        ratingSelector = cont.one("#rating_widget");
        emptyRating = cont.one(".rating-empty");
        userCnt = cont.one("#rate_user_cont");
        ratVal = cont.one(".ratings-value");

        if (ratingSelector) {
            var ratWidth = parseInt(emptyRating.getComputedStyle("width"));
            if (parseInt(fullRating.getComputedStyle("width")) > 0) {
                emptyRating.setStyle("cursor", "auto");
                return false;
            }

            if (emptyRating) {
                // Bind mousemove on empty stars
                ratMouseMove = emptyRating.on("mousemove", function(e) {
                    var segment = parseInt(ratingSelector.getX()) + 10;
                    // Capturing whole values only i.e. round off to next number
                    width = (parseInt(e.clientX) - segment) / ratWidth * 100;

                    if (width >= 80) {
                        width = 100;
                    } else if (width >= 60) {
                        width = 80;
                    } else if (width >= 40) {
                        width = 60;
                    } else if (width >= 20) {
                        width = 40;
                    } else if (width >= 0) {
                        width = 20;
                    }

                    fullRating.setStyle("width", width + "%");
                });
                ratMouseOut = fullRating.on("mouseout", function(e) {
                    fullRating.setStyle("width", "0%");
                });
            }

            // Bind click handler for capturing user data
            ratMouseClick = emptyRating.on("click", function(e) {
                var newUserCnt = 1
                        , newRateVal
                        , diff = 0
                        , newRate = (width * 5.0 / 100)
                        , oldRate = parseFloat(ratVal.get("text"));

                ratMouseOut.detach();
                var cfg = {
                    method: config.method,
                    data: {
                        rating: newRate,
                        object_id: ratingSelector.getAttribute("data-objid")
                    },
                    on: {
                        complete: function() {
                            var response = (arguments[1].responseText) ? Y.JSON.parse(arguments[1].responseText) : {};

                            if (response.status && (response.status === "success")) {
                                emptyRating.setStyle("cursor", "auto");

                                if (userCnt) {
                                    newUserCnt = parseInt(userCnt.get("text")) + 1;
                                    userCnt.set("text", newUserCnt);
                                }

                                diff = Math.abs(oldRate - newRate) / newUserCnt;
                                if (newRate > oldRate) {
                                    newRateVal = oldRate + diff;
                                } else {
                                    newRateVal = oldRate - diff;
                                }
                                newRateVal = Math.round(newRateVal * 10) / 10;
                                ratVal.set("text", newRateVal);
                                cont.one(".rate-user-text").set("text", "Your Rating");
                                // Now detach all event listeners
                                if (ratMouseClick) {
                                    ratMouseClick.detach();
                                }
                                if (ratMouseMove) {
                                    ratMouseMove.detach();
                                }
                            }
                        }
                    },
                    context: this
                };

                try {
                    Y.io(config.url, cfg);
                } catch (e) {
                    Y.log("Error in ratings widget: " + e.message);
                }
            });
        }
    }
});