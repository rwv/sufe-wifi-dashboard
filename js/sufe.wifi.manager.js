var service_url = 'http://localhost:29869/RPC2'

function service_start() {
    // Stop service
    $.xmlrpc({
        url: service_url,
        methodName: 'start',
        params: [],
        success: function (response, status, jqXHR) { /* ... */ },
        error: function (jqXHR, status, error) { /* ... */ }
    });
    info_update();
}

function service_stop() {
    // Stop service
    $.xmlrpc({
        url: service_url,
        methodName: 'stop',
        params: [],
        success: function (response, status, jqXHR) { /* ... */ },
        error: function (jqXHR, status, error) { /* ... */ }
    });
    info_update();
}

function info_update() {
    // Update infomation card
    $.xmlrpc({
        url: service_url,
        methodName: 'get_status',
        params: [],
        success: function (response, status, jqXHR) {
            // Information Card
            var service_status = response[0];
            $('#service-status').text(service_status.service_status);
            $('#internet-connection').text(service_status.internet_connection);
            $('#network-type').text(service_status.network_type);
            $('#ssid').text(service_status.ssid);
        },
        error: function (jqXHR, status, error) { /* ... */ }
    });
}

function log_update() {
    // Update log modal
    $.xmlrpc({
        url: service_url,
        methodName: 'get_log',
        params: [],
        success: function (response, status, jqXHR) {
            // Log modal
            $('#service-log').text(response[0]);
        },
        error: function (jqXHR, status, error) { /* ... */ }
    });
}

function config_update() {
    // Update config modal
    $.xmlrpc({
        url: service_url,
        methodName: 'get_config',
        params: [],
        success: function (response, status, jqXHR) {
            var service_config = response[0];
            // Config model
            $("input[name=config-network-type][value=" + service_config.login.network_type + "]").prop("checked", true);
            $('#config-username').val(service_config.login.username);
            $('#config-password').val(service_config.login.password);
            $('#config-retry-interval').val(service_config.other.retry_interval);
            $('#config-retry-times').val(service_config.other.retry_times);
            $('#config-detect-interval').val(service_config.other.detect_interval);
            $('#config-log-level').val(service_config.other.log_level);
        },
        error: function (jqXHR, status, error) { /* ... */ }
    });
}

function login_config_submit() {
    var login_config = {
        "login": {
            "network_type": $('input[name=config-network-type]:checked').val(),
            "username": $('#config-username').val(),
            "password": $('#config-password').val()
        }
    };
    $.xmlrpc({
        url: service_url,
        methodName: 'update_config',
        params: [login_config],
        success: function (response, status, jqXHR) { /* ... */ },
        error: function (jqXHR, status, error) { /* ... */ }
    });
}

function other_config_submit() {
    var other_config = {
        "other": {
            "detect_interval": $('#config-detect-interval').val(),
            "log_level": $('#config-log-level').val(),
            "retry_interval": $('#config-retry-interval').val(),
            "retry_times": $('#config-retry-times').val()
        }
    };
    $.xmlrpc({
        url: service_url,
        methodName: 'update_config',
        params: [other_config],
        success: function (response, status, jqXHR) { /* ... */ },
        error: function (jqXHR, status, error) { /* ... */ }
    });
}

function myOnload() {
    // when html is ready
    $(document).ready(function () {
        info_update();
        // config_update();
        log_update();
    });

}

myOnload();
$('#nav-start').click(function () {
    service_start();
});
$('#nav-stop').click(function () {
    service_stop();
});
$('#log-modal').on('shown.bs.modal', function (e) {
    log_update();
})
$('#login-settings-modal').on('shown.bs.modal', function (e) {
    config_update();
})
$('#other-settings-modal').on('shown.bs.modal', function (e) {
    config_update();
})
$('#login-settings-save').click(function () {
    login_config_submit();
});
$('#other-settings-save').click(function () {
    other_config_submit();
});