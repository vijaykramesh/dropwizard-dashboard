class Bindings
    constructor: ->
        @vminfo = ko.observable {
            name      : 'Unknown',
            version   : 'Unknown',
            time      : new Date(0),
            uptime    : 0
        }

        @readableVmUptime = ko.computed =>
            uptime = @vminfo().uptime
            moment.humanizeDuration(uptime * 1000)

        @readableServerTime = ko.computed =>
            serverTime = @vminfo().time
            moment(serverTime).format("Do MMMM YYYY HH:mm:ss")


vmBindings = new Bindings()


Dropwizard.mainDashboard.addPageComponent {

    bindings : vmBindings,

    onMetrics : (metrics) =>
        jvm = metrics.jvm
        vm = jvm.vm

        vmBindings.vminfo({
            name    : vm.name,
            version : vm.version,
            time    : jvm.current_time,
            uptime  : jvm.uptime
        });
}
