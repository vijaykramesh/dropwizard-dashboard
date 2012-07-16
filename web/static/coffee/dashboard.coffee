window.Dropwizard = {}


class Dropwizard.Dashboard

    constructor: ->
        @bindings =
            proxyHeartbean : ko.observable()
            googleChartsLoaded : ko.observable(false)
            connectionToProxyEstablished : ko.observable(false)
            connectionToProxyLost : ko.observable(false)
            connectionError : ko.observable()
            beforeSocketConnect : ko.observable()
            pageComponents : ko.observableArray()
            metrics : ko.observable()

        @messageCounter = 0

    applyBindings: ->
        ko.applyBindings @bindings

    onMetrics: (updatedMetrics) ->
        @bindings.metrics updatedMetrics

    addPageComponent: (component) ->

        # Add component bindings
        for own name, binding of component.bindings
            @bindings[name] = binding

        if component.hasOwnProperty "pageComponent"
            @bindings.pageComponents.push(component.pageComponent)

        if component.hasOwnProperty "onMetrics"
            @bindings.metrics.subscribe(component.onMetrics)

        if component.hasOwnProperty "beforeSocketConnect"
            @bindings.beforeSocketConnect.subscribe(component.beforeSocketConnect)

    installRemoteTemplate: (id, url) =>
        jQuery.ajax {
            url     : url,
            async   : false,
            success : (template) => jQuery("body").append("""<script id="#{id}" type="text/html">#{template}</script>""")
            error   : => alert "Failed to install template " + id
        }

    appendTemplateTo : (templateId, node) =>
        jQuery("""<div id="#{templateId}-node" data-bind="template: { name: '#{templateId}' }"></div>""").appendTo(node)
        element = document.getElementById(templateId + "-node")
        ko.applyBindingsToNode(element, null, Dropwizard.mainDashboard.bindings)

    connectToProxy : ->
        if window.WebSocket
            @bindings.beforeSocketConnect(true)
            socket = new WebSocket("ws://localhost:9000")
            socket.onmessage = (event) =>
                @bindings.proxyHeartbean(++@messageCounter)

                json = JSON.parse(event.data)
                if json.namespace == "metrics"
                    @onMetrics(json.payload)

            socket.onerror = (event) => @bindings.connectionError(event)
            socket.onopen = (event) => @bindings.connectionToProxyEstablished(true)
            socket.onclose = (event) => @bindings.connectionToProxyLost(true)
        else
            alert "No websocket support! Use a recent version of Chrome or Firefox"


Dropwizard.mainDashboard = new Dropwizard.Dashboard