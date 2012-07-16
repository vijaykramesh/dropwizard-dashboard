(function() {

    google.load('visualization', '1', { packages:['corechart', 'gauge'] });
    google.setOnLoadCallback(googleChartsLoaded);

    function googleChartsLoaded() {
        Dropwizard.mainDashboard.bindings.googleChartsLoaded(true);
        Dropwizard.mainDashboard.applyBindings();
        Dropwizard.mainDashboard.connectToProxy();

        Dropwizard.mainDashboard.bindings.proxyHeartbean.subscribe(function(beat) {
            if (beat === 1) {
                jQuery(".hiddenFromStart").css("visibility", "visible");
            }

            var heart = $("#heart");
            heart.fadeTo(70, 0.4, function () {
                heart.fadeTo(250, 0.2);
            });
        });
    }

})();