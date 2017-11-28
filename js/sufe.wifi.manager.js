var service_url = 'http://localhost:29869/RPC2'

var error_code_map = {
    1: '<strong>Oops!</strong><br> Something went wrong, check if SUFE Wi-Fi is running.'
}


function pop_error_alert(error_code) {
    var alert_html = '<div class="alert alert-danger" role="alert">' + error_code_map[error_code] + '</div>'
    $('#alert-placeholder').html(alert_html);
}

function dismiss_alert() {
    $('#alert-placeholder').html('');
}


function service_start() {
    // Stop service
    $.xmlrpc({
        url: service_url,
        methodName: 'start',
        params: [],
        success: function (response, status, jqXHR) {
            dismiss_alert()
        },
        error: function (jqXHR, status, error) {
            pop_error_alert(1);
        }
    });
    info_update();
}

function service_stop() {
    // Stop service
    $.xmlrpc({
        url: service_url,
        methodName: 'stop',
        params: [],
        success: function (response, status, jqXHR) {
            dismiss_alert()
        },
        error: function (jqXHR, status, error) {
            pop_error_alert(1);
        }
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
            dismiss_alert()
            // Information Card
            var service_status = response[0];
            $('#service-status').text(service_status.service_status);
            $('#internet-connection').text(service_status.internet_connection);
            $('#network-type').text(service_status.network_type);
            $('#ssid').text(service_status.ssid);
        },
        error: function (jqXHR, status, error) {
            // Information Card
            $('#service-status').text('Error');
            $('#internet-connection').text();
            $('#network-type').text();
            $('#ssid').text();
            pop_error_alert(1);
        }
    });
}

function log_update() {
    // Update log modal
    $.xmlrpc({
        url: service_url,
        methodName: 'get_log',
        params: [],
        success: function (response, status, jqXHR) {
            dismiss_alert()
            // Log modal
            $('#service-log').text(response[0]);
        },
        error: function (jqXHR, status, error) {
            pop_error_alert(1);
        }
    });
}

function config_update() {
    // Update config modal
    $.xmlrpc({
        url: service_url,
        methodName: 'get_config',
        params: [],
        success: function (response, status, jqXHR) {
            dismiss_alert()
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
        error: function (jqXHR, status, error) {
            pop_error_alert(1);
        }
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
        success: function (response, status, jqXHR) {
            dismiss_alert()
        },
        error: function (jqXHR, status, error) {
            pop_error_alert(1);
        }
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
        success: function (response, status, jqXHR) {
            dismiss_alert()
        },
        error: function (jqXHR, status, error) {
            pop_error_alert(1);
        }
    });
}

function myOnload() {
    // when html is ready
    $(document).ready(function () {
        info_update();
        config_update();
    });

}

myOnload();
$('#nav-start').click(service_start);
$('#nav-stop').click(service_stop);
$('#log-modal').on('shown.bs.modal', log_update);
$('#login-settings-modal').on('shown.bs.modal', config_update);
$('#other-settings-modal').on('shown.bs.modal', config_update);
$('#login-settings-save').click(login_config_submit);
$('#other-settings-save').click(other_config_submit);
setInterval(info_update, 3000);