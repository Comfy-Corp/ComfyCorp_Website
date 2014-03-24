function startstream() {
    var newStreamName = document.getElementById('streamselect').value;
    var newStreamRadioID = getCookie("radioID");
    $.ajax({
        url: '/cgi-bin/api.php?q=genconfig&name=' + newStreamName + '&id=' + newStreamRadioID,
        dataType: 'json',
        success: function(response) {
            json = response;
            if (json.result == 'success') {
                bootstrap_alert.success('Success: Stream started');
                window.setTimeout(closealert, 5000);
                getJsonFile();
            } else {
                bootstrap_alert.warning('Error: Er is een fout opgetreden (Error code: 1337)');
                window.setTimeout(closealert, 5000);
            }
        }
    })
}

function getcurrent()
{
        var json;
        $.ajax({
        url: '/cgi-bin/api.php?q=getcurrent',
        dataType: 'json',
        success: function(response) 
        {
            var json = response;
            console.log(json.result);
            if(json.result == "")
            {
                $('#current_placeholder').html('<h4 class="timeline-title">No stream playing </h4>');
            }
            else
            {
                $('#current_placeholder').html('<h4 class="timeline-title">Now playing: ' + json.result + '</h4>');
            }
        }
    })
}

function stopstream() {
    var newStreamRadioID = getCookie("radioID");
    $.ajax({
        url: '/cgi-bin/api.php?q=genconfigstop',
        dataType: 'json',
        success: function(response) {
            json = response;
            if (json.result == 'success') {
                bootstrap_alert.success('Success: Stream stopped');
                window.setTimeout(closealert, 5000);
                getJsonFile();
            } else {
                bootstrap_alert.warning('Error: Er is een fout opgetreden (Error code: 1338)');
                window.setTimeout(closealert, 5000);
            }
        }
    })
}

function deletecookie() {
    var d = new Date();
    d.setTime(d.getTime()-(14*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie="radioID=" + ";"+ expires;
    document.cookie="radioName=" + ";" + expires;
    window.location = 'login.html';
};

function closealert() {
    $('#alertmssg').alert('close');
}

function saveStream() {
    var newStreamName = document.getElementById('newStreamName').value;
    var newStreamURL = document.getElementById('newStreamURL').value;
    var newStreamRadioID = getCookie("radioID");
    $.ajax({
        url: '/cgi-bin/api.php?q=addstream&name=' + newStreamName + '&url=' + newStreamURL + '&id=' + newStreamRadioID,
        dataType: 'json',
        success: function(response) {
            console.log("mmmh");
            json = response;
            $('#myModal').modal('hide');
            getJsonFile();
            populateSavedStreams(document.getElementById('streamselect'), json.streams);
        }
    })
}

function saveAlarm() {
    var newAlarmStream = document.getElementById('streamselect2').value;
    var newAlarmType;
    var newAlarmTime;
    	newAlarmType = 0;
    	newAlarmTime = document.getElementById('timeAlarm').value;
    var newAlarmDesc = document.getElementById('newAlarmDesc').value;
    var newStreamRadioID = getCookie("radioID");
    $.ajax({
        url: '/cgi-bin/api.php?q=addalarm&id=' + newStreamRadioID + '&time=' + newAlarmTime + '&type=' + newAlarmType + '&stream=' + newAlarmStream + '&desc=' + newAlarmDesc,
        dataType: 'json',
        success: function(response) {
            json = response;
            $('#addAlarm').modal('hide');
            getJsonFile();
            populateSavedAlarms(document.getElementById('alarmselect'), json.alarms);
        }
    })
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie() {
    var user = getCookie("radioName");
    if (user != "") {
        return;
    } else {
        window.location = 'login.html';
    }
}

function load() {
    checkCookie();
    getJsonFile();
}

function getJsonFile() {
    var json
    $.ajax({
        url: '/cgi-bin/api.php',
        dataType: 'json',
        success: function(response) {
            json = response;
            populateSavedStreams(document.getElementById('streamselect'), json.streams);
            populateSavedStreams(document.getElementById('streamselect2'), json.streams);
            populateSavedAlarms(document.getElementById('alarmselect'), json.alarms);
            populateHeader(document.getElementById('header'));
            getcurrent();
        }
    })
}

function populateSavedStreams(select, data) 
{
    var items = [];
        $.each(data, function (id, option) {
        items.push('<option value="' + option.id +  '" alt="' + option.url +'">' + option.name + '<\/option>');
    });
    select.innerHTML= items.join('');
}

bootstrap_alert = function() {}
bootstrap_alert.warning = function(message) {
    $('#alert_placeholder').html('<div class="alert alert-danger alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span>' + message + '</span></div>')
}
bootstrap_alert.success = function(message) {
    $('#alert_placeholder').html('</br><div class="alert alert-success alert-dismissable" id="alertmssg"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span>' + message + '</span></div>')
}