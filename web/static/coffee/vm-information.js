// Generated by CoffeeScript 1.3.1
(function() {
  var Bindings, vmBindings,
    _this = this;

  Bindings = (function() {

    Bindings.name = 'Bindings';

    function Bindings() {
      var _this = this;
      this.vminfo = ko.observable({
        name: 'Unknown',
        version: 'Unknown',
        time: new Date(0),
        uptime: 0
      });
      this.readableVmUptime = ko.computed(function() {
        var uptime;
        uptime = _this.vminfo().uptime;
        return moment.humanizeDuration(uptime * 1000);
      });
      this.readableServerTime = ko.computed(function() {
        var serverTime;
        serverTime = _this.vminfo().time;
        return moment(serverTime).format("Do MMMM YYYY HH:mm:ss");
      });
    }

    return Bindings;

  })();

  vmBindings = new Bindings();

  Dropwizard.mainDashboard.addPageComponent({
    bindings: vmBindings,
    onMetrics: function(metrics) {
      var jvm, vm;
      jvm = metrics.jvm;
      vm = jvm.vm;
      return vmBindings.vminfo({
        name: vm.name,
        version: vm.version,
        time: jvm.current_time,
        uptime: jvm.uptime
      });
    }
  });

}).call(this);
