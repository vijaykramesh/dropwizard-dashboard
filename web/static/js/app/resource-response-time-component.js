(function() {

    var options = {
        "width": 400, "height": 200,
        "chartArea": {
            left: 10, top: 10,
            width: "80%", height: "90%"
        },
        "is3D": true,
        "legend": {
            position: "right",
            textStyle : {
                fontSize : 13
            }
        },
        backgroundColor : {
            fill : "transparent"
        }
    };

    var component = {
        name                : "Resource Response Times",
        shortDescription    : "Resource response times",
        dom_id              : "resource_response_time_container"
    };

    var bindings = {
        resourceResponseTimes : ko.observable({})
    };

    // Discount metric GET requests from the statistics, otherwise it will completely
    // dominate at a rate of 1 request / second

    // Use local storage to persist count across page refreshes

    var getNumberOfMetricRequestsToIgnore = function() {
        return localStorage["dropwizard-dashboard.numberOfMetricRequestsToIgnore"];
    };

    var setNumberOfMetricRequestsToIgnore = function(num) {
        localStorage["dropwizard-dashboard.numberOfMetricRequestsToIgnore"] = num;
    };

    var ignoreMetricRequest = function() {
        localStorage["dropwizard-dashboard.numberOfMetricRequestsToIgnore"]++;
    };

    var resetIgnorableMetricRequests = function() {
        setNumberOfMetricRequestsToIgnore(0);
    };

    if (!getNumberOfMetricRequestsToIgnore()) {
        resetIgnorableMetricRequests();
    }

    var pieChart;

    Dropwizard.registerComponent({
        bindings : bindings,
        pageComponent : component,

        onMetrics : function(update) {
            var upsellCounterResource = update["org.change.ml.upsellservice.resources.UpsellCounterResource"];
            upsellCounterResource["incrementCounter"]["duration"]
           
            bindings.resourceResponseTimes({
                upsellCounterDuration : upsellCounterResource["incrementCounter"]["duration"],
            });

            ignoreMetricRequest();
        },

        onDropwizardConnectionRestored: function() {
            // The server probably restarted, so reset this count.
            resetIgnorableMetricRequests();
        },

        /**
         * Download and install the heap page component template and install it to
         * activate Knockout.js data binding.
         */
        beforeSocketConnect : function() {
            Dropwizard.installRemoteTemplate("resource-response-time-template", "/static/templates/resource-response-times.html");
            Dropwizard.appendTemplateTo("resource-response-time-template", document.getElementById(component.dom_id));

            $(["min", "max", "mean", "median"]).each(function(i,v){
                $("#upsell_counter_resource").append("div").addClass(v);
            })

            bindings.resourceResponseTimes.subscribe(function(responseTimes) {
                $(["min", "max", "mean", "median"]).each(function(i,v){
                    $("#upsell_counter_resource").find("." + v).text(responseTimes["upsellCounterDuration"][v]);
                })
            });
        }
    });

})();